import time
import logging

from datetime import datetime
from typing import List, Dict, Tuple

class GenomeProcessorService:

    def __init__(self, db):
        # Inicialización del cliente MongoDB con Motor (asíncrono)
        self.collection = db["genomasv2_vcf"]

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

    async def process_file_parallel(self, file_path: str):
        """Función principal para procesar el archivo VCF de manera paralela."""
        start_time = time.time()
        start_datetime = datetime.now()

        logging.info(f"Starting processing of {file_path}")
        logging.info(f"Start time: {start_datetime}")

        # Obtener información del encabezado
        sample_columns, column_positions = await self.get_header_info(file_path)
        
        logging.info(f"Found {len(sample_columns)} sample columns")

        '''
        # Crear índices primero
        await self.create_indices()

        # Obtener las posiciones de los fragmentos a procesar
        chunk_positions = []
        total_lines = 0
        with open(file_path, "r") as f:
            while True:
                pos = f.tell()
                lines = [f.readline() for _ in range(CHUNK_SIZE)]
                if not lines[-1]:
                    break
                total_lines += len(lines)
                chunk_positions.append((pos, len(lines)))

        logging.info(f"Total lines to process: {total_lines}")
        logging.info(f"Number of chunks: {len(chunk_positions)}")

        # Procesar los fragmentos en paralelo
        futures = []
        for start_pos, chunk_len in chunk_positions:
            futures.append(
                asyncio.create_task(
                    self.process_file_chunk(
                        file_path, start_pos, chunk_len, column_positions
                    )
                )
            )

        await asyncio.gather(*futures)

        end_time = time.time()
        end_datetime = datetime.now()
        total_time = end_time - start_time

        logging.info(f"Processing completed at: {end_datetime}")
        logging.info(f"Total processing time: {total_time/60:.2f} minutes")
        logging.info(
            f"Average processing speed: {total_lines/total_time:.0f} lines/second"
        )
        logging.info(f"Number of processes used: {NUM_PROCESSES}")
        logging.info(f"Chunk size: {CHUNK_SIZE}")
        '''