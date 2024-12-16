import os
import time
from datetime import datetime
import logging
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import mmap
from typing import List, Dict, Tuple

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")
BATCH_SIZE = 10000
NUM_PROCESSES = 8
CHUNK_SIZE = 10000


class GenomeProcessorService:
    def __init__(self, db, fileName):
        # Inicialización del cliente MongoDB con Motor (asíncrono)
        self.collection = db["genomas_vcf"]
        self.fileName = fileName

    async def get_header_info(self, file_path: str) -> Tuple[List[str], Dict[str, int]]:
        """Extrae la información del encabezado del archivo VCF."""
        with open(file_path, "r") as f:
            for line in f:
                if line.startswith("#CHROM"):
                    headers = line.strip().split("\t")
                    sample_columns = headers[9:]
                    column_positions = {
                        name: idx + 9 for idx, name in enumerate(sample_columns)
                    }
                    return sample_columns, column_positions
        raise ValueError("No se encontró la línea de encabezado en el archivo VCF")

    async def process_line(self, line: str, column_positions: Dict[str, int]) -> Dict:
        """Procesa una línea del archivo VCF y retorna un documento."""
        if line.startswith("#"):
            return None

        fields = line.strip().split("\t")
        if len(fields) < 8:
            return None

        try:
            document = {
                "FileName": self.fileName,
                "CHROM": fields[0],
                "POS": fields[1],
                "ID": fields[2] if fields[2] != "." else None,
                "REF": fields[3],
                "ALT": fields[4],
                "QUAL": fields[5],
                "FILTER": fields[6],
                "INFO": fields[7],
                "FORMAT": fields[8],
            }

            # Procesar campos de muestra si existen
            if len(fields) > 8:
                for sample_name, position in column_positions.items():
                    if position < len(fields):
                        document[sample_name] = fields[position]

            return document
        except Exception as e:
            print(f"Error procesando línea: {e}")
            print(f"Contenido de la línea: {line}")
            return None

    async def bulk_insert_mongo(self, data: List[Dict]):
        """Inserta múltiples documentos en MongoDB de manera asíncrona."""
        if not data:
            return

        operations = [doc for doc in data if doc is not None]

        if operations:
            try:
                result = await self.collection.insert_many(operations)
                #print(f"Insertados {result.inserted_ids} documentos")
                print(f"Documentos Insertados.")
                return len(result.inserted_ids)
            except Exception as e:
                print(f"Error durante la inserción masiva: {e}")

    async def process_file_chunk(
        self,
        file_path: str,
        start_pos: int,
        chunk_size: int,
        column_positions: Dict[str, int]
    ):
        """Procesa un fragmento del archivo."""
        batch = []

        with open(file_path, "r") as f:
            mm = mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ)
            mm.seek(start_pos)

            try:
                for _ in range(chunk_size):
                    line = mm.readline().decode("utf-8")
                    if not line:
                        break

                    document = await self.process_line(line, column_positions)
                    if document is not None and document:
                        batch.append(document)

                    if len(batch) >= BATCH_SIZE:
                        inserted = await self.bulk_insert_mongo(batch)
                        batch = []
                        return inserted

                # Insertar registros restantes
                if batch:
                    inserted = await self.bulk_insert_mongo(batch)
                    return inserted

            except Exception as e:
                print(f"Error procesando fragmento: {e}")
            finally:
                mm.close()

    async def create_indices(self):
        """Crea índices para mejorar el rendimiento de las consultas."""
        try:
            await self.collection.create_index([("FileName", 1)])
            await self.collection.create_index([("CHROM", 1)])
            await self.collection.create_index([("POS", 1)])
            await self.collection.create_index([("ID", 1)])
            await self.collection.create_index([("REF", 1)])
            await self.collection.create_index([("ALT", 1)])
            await self.collection.create_index([("FILTER", 1)])
            await self.collection.create_index([("INFO", 1)])
            await self.collection.create_index([("FORMAT", 1)])
            await self.collection.create_index([("output", 1)])

            print("Índices creados con éxito")
        except Exception as e:
            print(f"Error creando índices: {e}")

    async def calculate_chunk_positions(self, file_path: str):
        """Calcula las posiciones de los fragmentos para el procesamiento en paralelo del archivo."""
        chunk_positions = []
        with open(file_path, "r") as file:
            file.seek(0)  # Asegurarse de empezar desde el principio del archivo
            while True:
                start_position = file.tell()
                lines = [file.readline() for _ in range(CHUNK_SIZE)]
                if not lines[-1]:  # Si la última línea leída no existe, hemos alcanzado el final del archivo
                    break
                # Asegurarse de no contar líneas vacías al final del archivo
                lines_count = len(lines) - (1 if not lines[-1].strip() else 0)
                chunk_positions.append((start_position, lines_count))

        return chunk_positions

    async def process_file_parallel(self, file_path: str):
        print(f"Procesando archivo process_file_parallel: {file_path}")
        start_time = time.time()
        start_datetime = datetime.now()

        # Obtener información del encabezado
        sample_columns, column_positions = await self.get_header_info(file_path)

        # Crear índices primero
        await self.create_indices()

        # Procesamiento paralelo aquí
        total_inserted = 0  # Contador para los registros insertados
        chunk_positions = await self.calculate_chunk_positions(file_path)  # Esto debería ser un método separado
        futures = []
        for start_pos, chunk_len in chunk_positions:
            future = asyncio.create_task(
                self.process_file_chunk(file_path, start_pos, chunk_len, column_positions)
            )
            futures.append(future)


        results = await asyncio.gather(*futures)
        #print(f"Resultados: {results}")
        for result in results:
            total_inserted += result  # Asumiendo que cada tarea retorna la cantidad de registros insertados

        end_time = time.time()
        total_time = end_time - start_time
        logging.info(f"Processing completed at: {datetime.now()}")
        print(f"Processing completed at: {datetime.now()}")
        logging.info(f"Total processing time: {total_time/60:.2f} minutes")
        print(f"Total processing time: {total_time/60:.2f} minutes")

        return total_inserted, total_time, len(chunk_positions)  # total_lines ahora es el número de chunks procesados

# Ejemplo de uso
async def main():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DATABASE_NAME]
    processor = GenomeProcessorService(db)
    await processor.process_file_parallel("path/to/your/file.vcf")


if __name__ == "__main__":
    asyncio.run(main())
