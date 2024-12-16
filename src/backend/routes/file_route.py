from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, HTTPException
import os
import tempfile
from database.mongo import Database
from models.file_record import FileRecord
from services.genoma_service import GenomeProcessorService
from motor.motor_asyncio import AsyncIOMotorDatabase
from response.process_file_response import ProcessFileResponse

router = APIRouter()

# Define the response model
@router.post("/process_file", response_model=ProcessFileResponse)
async def process_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(Database.get_db),
) -> ProcessFileResponse:

    processor = GenomeProcessorService(db, file.filename)

    try:
        # Crear archivo temporal con un nombre más descriptivo
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=f"_{file.filename}",
        ) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name

            # Validación básica de archivo
            if not content:
                return ProcessFileResponse(
                    message="El archivo está vacío", files_processed=0
                )

            if not file.filename.lower().endswith(".vcf"):
                return ProcessFileResponse(
                    message="Por favor, suba un archivo VCF", files_processed=0
                )
            
        # Insertar registro de archivo en la base de datos antes de procesar
        file_doc = {
            "filename": file.filename,
            "status": "pending",
            "created_at": str(datetime.now()),
            "processed_time": None
        }
        file_record = await db["files_processed"].insert_one(file_doc)
        print(file_record)

        # Función para procesar el archivo en segundo plano
        async def process_file_in_background():
            try:
                print("Procesando archivo en segundo plano...")
                print(f"Archivo: {file.filename}")
                inserted_count, total_time, total_lines = await processor.process_file_parallel(temp_file_path)
                print(f"Registros insertados: {inserted_count}")
                print(f"Tiempo total: {total_time}")
                await db["files_processed"].update_one(
                    {"_id": file_record.inserted_id},
                    {"$set": {"status": "processed", "processed_time": str(datetime.now())}}
                )
                background_tasks.add_task(cleanup_temp_file)
                return inserted_count, total_time
            except Exception as e:
                await db["files_processed"].update_one(
                    {"_id": file_record.inserted_id},
                    {"$set": {"status": "failed", "error": str(e), "processed_time": datetime.now()}}
                )
                print(f"Error procesando el archivo en segundo plano: {str(e)}")
                return 0

        # Función para eliminar el archivo temporal
        def cleanup_temp_file():
            try:
                os.unlink(temp_file_path)
            except Exception as e:
                print(f"Error eliminando archivo temporal: {e}")

        # Añadir tarea en segundo plano
        files_processed, t_time = await process_file_in_background()

        return ProcessFileResponse(
            message="Archivo recibido y procesado en segundo plano",
            files_processed=files_processed,
            total_time=t_time,
        )

    except Exception as e:
        return ProcessFileResponse(
            message=f"Error procesando archivo: {str(e)}", files_processed=0
        )

@router.get("/processed_file", response_model=List[FileRecord])
async def get_processed_files(db: AsyncIOMotorDatabase = Depends(Database.get_db)):
    """Obtiene los registros de genomas procesados."""
    collection = db["files_processed"]
    try:
        cursor = collection.find()
        results = [doc async for doc in cursor]
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener datos: {e}")
    
@router.get("/createCollection")
async def main(db: AsyncIOMotorDatabase = Depends(Database.get_db)):
    await db["files_processed"].insert_one({"Config": "Success"})
    return "Done"

    