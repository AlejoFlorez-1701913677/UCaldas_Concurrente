import asyncio
from fastapi import APIRouter,Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from database.mongo import Database
from typing import Optional, List
from models.genome_record import GenomeRecord
from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from database.mongo import Database
from models.genome_record import GenomeRecord

routeGenome = APIRouter()

@routeGenome.get("/genomes2", response_model=List[GenomeRecord])
async def get_genomes_v2(
    fileName: Optional[str] = Query(None, description="Nombre del archivo"),
    chrom: Optional[str] = Query(None, description="Filtro por cromosoma"),
    #pos: Optional[int] = Query(None, description="Posición del cromosoma"),
    filter: Optional[str] = Query(None, description="Filtro por campo filter"),
    info: Optional[str] = Query(None, description="Filtro por información"),
    format: Optional[str] = Query(None, description="Filtro por formato"),
    limit: int = Query(100, description="Número máximo de registros a retornar"),
    offset: int = Query(0, description="Offset para paginación de registros"),
    db: AsyncIOMotorDatabase = Depends(Database.get_db)
):
    collection = db["genomas_vcf"]
    query = {}

    if fileName:
        query["FileName"] = fileName
    if chrom:
        query["CHROM"] = chrom
    if filter:
        query["FILTER"] = filter
    if info:
        query["INFO"] = info
    if format:
        query["FORMAT"] = format

    try:
        cursor = collection.find(query).skip(offset).limit(limit)
        results = [doc async for doc in cursor]
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener datos: {e}")


async def fetch_batch(collection, query, limit, offset):
    """Función auxiliar para realizar una consulta por lotes"""
    cursor = collection.find(query).skip(offset).limit(limit)
    results = [doc async for doc in cursor]
    return results

@routeGenome.get("/genomes", response_model=List[GenomeRecord])
async def get_genomes(
    fileName: Optional[str] = Query(None, description="Nombre del archivo"),
    chrom: Optional[str] = Query(None, description="Filtro por cromosoma"),
    filter: Optional[str] = Query(None, description="Filtro por campo filter"),
    info: Optional[str] = Query(None, description="Filtro por información"),
    format: Optional[str] = Query(None, description="Filtro por formato"),
    limit: int = Query(100, description="Número máximo de registros a retornar"),
    offset: int = Query(0, description="Offset para paginación de registros"),
    db: AsyncIOMotorDatabase = Depends(Database.get_db)
):
    """
    Obtiene registros de la colección `genomas_vcf` con filtros opcionales y paginación.
    Si el número de registros supera los 100,000, se hace la consulta por lotes.
    """
    collection = db["genomas_vcf"]
    query = {}

    if fileName:
        query["FileName"] = fileName
    if chrom:
        query["CHROM"] = chrom
    if filter:
        query["FILTER"] = filter
    if info:
        query["INFO"] = info
    if format:
        query["FORMAT"] = format

    try:
        # Contamos el total de registros que cumplen con la consulta (sin limitación)
        total_count = await collection.count_documents(query)

        print(f"Total de registros: {total_count}")
        print(f"Límite de registros: {limit}")
        # Si hay más de 100,000 registros, realizamos la consulta en lotes
        if limit > 100000 and total_count > 100000:
            batch_size = 100000  # Tamaño del lote
            tasks = []  # Lista de tareas asíncronas
            print(f"Se obtendrán los datos en lotes de {batch_size} registros")

            print("residuo: ", limit % batch_size)
            # Se calculará el número de lotes necesarios
            num_batches = (limit // batch_size) + (1 if limit % batch_size != 0 else 0)
            print(f"Número de lotes: {num_batches}")

            total_records_fetched = 0  # Total de registros que se van a buscar

            for i in range(num_batches):

                # Ajustar el tamaño del lote si es necesario
                if total_records_fetched + batch_size > limit:
                    batch_size = limit - total_records_fetched  # Ajustar el tamaño del último lote

                batch_offset = i * batch_size
                # Para cada lote, llamamos a fetch_batch y lo añadimos a la lista de tareas
                tasks.append(fetch_batch(collection, query, batch_size, batch_offset))

                total_records_fetched += batch_size  # Incrementar el total de registros ya planificados para buscar

            # Ejecutamos todas las tareas en paralelo
            results = await asyncio.gather(*tasks)

            # Aplanamos los resultados de las tareas
            all_results = [item for sublist in results for item in sublist]
            return all_results

        # Si no hay más de 100,000 registros, realizamos la consulta normalmente
        else:
            print("Se obtendrán los datos en una sola consulta")
            cursor = collection.find(query).skip(offset).limit(limit)
            results = [doc async for doc in cursor]
            return results

    except Exception as e:
        print(f"Error al obtener datos: {e}")
        raise HTTPException(status_code=500, detail=f"Error al obtener datos: {e}")

# Endpoint para obtener un registro por su ID
@routeGenome.get("/genomes/{record_id}", response_model=GenomeRecord)
async def get_genome_by_id(record_id: str,
    db: AsyncIOMotorDatabase = Depends(Database.get_db)):
    """
    Obtiene un único registro de la colección `genomas_vcf` por su ID.
    """
    collection = db["genomas_vcf"]

    try:
        record = await collection.find_one({"_id": record_id})
        if not record:
            raise HTTPException(status_code=404, detail="Registro no encontrado")
        return record
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al buscar el registro: {e}")
    
@routeGenome.get("/genomesCount", response_model=object)
async def get_genomes_count(
    fileName: Optional[str] = Query(None, description="Nombre del archivo"),
    chrom: Optional[str] = Query(None, description="Filtro por cromosoma"),
    #pos: Optional[int] = Query(None, description="Posición del cromosoma"),
    filter: Optional[str] = Query(None, description="Filtro por campo filter"),
    info: Optional[str] = Query(None, description="Filtro por información"),
    format: Optional[str] = Query(None, description="Filtro por formato"),
    db: AsyncIOMotorDatabase = Depends(Database.get_db)
):
    collection = db["genomas_vcf"]
    query = {}

    if fileName:
        query["FileName"] = fileName
    if chrom:
        query["CHROM"] = chrom
    if filter:
        query["FILTER"] = filter
    if info:
        query["INFO"] = info
    if format:
        query["FORMAT"] = format

    try:
        total_count = await collection.count_documents(query)
        
        return {"records": total_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener datos: {e}")


