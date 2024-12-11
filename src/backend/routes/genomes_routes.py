from fastapi import APIRouter,Depends, HTTPException, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from database.mongo import Database

from typing import Optional, List

from response.genome_record import GenomeRecord

routeGenome = APIRouter()

# Endpoint para obtener un subconjunto de datos
@routeGenome.get("/genomes", response_model=List[GenomeRecord])
async def get_genomes(
    chrom: Optional[str] = Query(None, description="Filtro por cromosoma"),
    pos_start: Optional[int] = Query(None, description="Posición inicial"),
    pos_end: Optional[int] = Query(None, description="Posición final"),
    limit: int = Query(100, description="Número máximo de registros a retornar"),
    db: AsyncIOMotorDatabase = Depends(Database.get_db)
):
    """
    Obtiene registros de la colección `genomas_vcf` con filtros opcionales.
    """
    collection = db["genomas_vcf"]

    query = {}

    if chrom:
        query["CHROM"] = chrom
    if pos_start is not None and pos_end is not None:
        query["POS"] = {"$gte": str(pos_start), "$lte": str(pos_end)}
    elif pos_start is not None:
        query["POS"] = {"$gte": str(pos_start)}
    elif pos_end is not None:
        query["POS"] = {"$lte": str(pos_end)}

    try:
        cursor = collection.find(query).limit(limit)
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