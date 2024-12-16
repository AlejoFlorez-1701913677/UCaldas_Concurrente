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

@routeGenome.get("/genomes", response_model=List[GenomeRecord])
async def get_genomes(
    fileName: Optional[str] = Query(None, description="Nombre del archivo"),
    chrom: Optional[str] = Query(None, description="Filtro por cromosoma"),
    #pos: Optional[int] = Query(None, description="Posición del cromosoma"),
    filter: Optional[str] = Query(None, description="Filtro por cromosoma"),
    info: Optional[str] = Query(None, description="Filtro por información"),
    format: Optional[str] = Query(None, description="Filtro por formato"),
    limit: int = Query(100, description="Número máximo de registros a retornar"),
    offset: int = Query(0, description="Offset para paginación de registros"),
    db: AsyncIOMotorDatabase = Depends(Database.get_db)
):
    """
    Obtiene registros de la colección `genomas_vcf` con filtros opcionales y paginación.
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
        cursor = collection.find(query).skip(offset).limit(limit)
        results = [doc async for doc in cursor]
        return results
    except Exception as e:
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