import os
import mmap
import logging
import time
import asyncio
from typing import List, Dict
from multiprocessing import Pool, cpu_count
from pymongo import MongoClient
from dotenv import load_dotenv

# Configuración de variables globales
BATCH_SIZE = 100
NUM_PROCESSES = cpu_count()  # Utilizamos todos los núcleos de la CPU
CHUNK_SIZE = 1000  # Tamaño de cada bloque en líneas

class GenomeProcessorService:
    def __init__(self, db):
        """Inicialización del servicio de procesamiento y conexión a MongoDB."""
        self.collection = db["genomasv2_vcf"]

    def process_vcf_line(self, line: str) -> Dict:
        """Procesa una sola línea del archivo VCF."""
        columns = line.strip().split("\t")
        chrom = columns[0]
        pos = columns[1]
        ref = columns[3]
        alt = columns[4]
        qual = columns[5]
        filter = columns[6]
        info = columns[7]
        format = columns[8]


        # Aquí puedes añadir más lógica de procesamiento según sea necesario
        return {
            "CHROM": chrom,
            "POS": pos,
            "REF": ref,
            "ALT": alt,
            "QUAL": qual,
            "FILTER": filter,
            "INFO": info,
            "FORMAT": format,
        }

    def process_vcf_block(self, lines: List[str]) -> List[Dict]:
        """Procesa un bloque de líneas del archivo VCF."""
        return [self.process_vcf_line(line) for line in lines if not line.startswith('#')]

    def insert_to_mongo(self, processed_data: List[Dict]):
        """Inserta los datos procesados en MongoDB."""
        try:
            if processed_data:
                self.collection.insert_many(processed_data)
            logging.info(f"Se insertaron {len(processed_data)} registros.")
        except Exception as e:
            logging.error(f"Error insertando en MongoDB: {e}")
        
    def process_file_in_chunks(self, file_path: str):
        """Lee el archivo en bloques y procesa cada bloque en paralelo."""
        # Abrimos el archivo en modo lectura
        with open(file_path, 'r') as f:
            lines = []
            for line_number, line in enumerate(f, start=1):
                lines.append(line)
                # Cuando se alcanza el tamaño de un bloque, lo procesamos
                if len(lines) == CHUNK_SIZE:
                    self.process_chunk(lines)
                    lines = []  # Limpiamos el bloque
            # Procesamos cualquier fragmento restante
            if lines:
                self.process_chunk(lines)

    def process_chunk(self, chunk_lines: List[str]):
        """Procesa un bloque de líneas en paralelo y lo inserta en MongoDB."""
        with Pool(NUM_PROCESSES) as pool:
            # Distribuimos las líneas del bloque entre los procesos
            results = pool.map(self.process_vcf_block, [chunk_lines[i:i + BATCH_SIZE] for i in range(0, len(chunk_lines), BATCH_SIZE)])
            # Aplanamos los resultados (ya que cada bloque devuelve una lista de diccionarios)
            all_processed_data = [item for sublist in results for item in sublist]
            # Insertamos los datos procesados en MongoDB
            self.insert_to_mongo(all_processed_data)