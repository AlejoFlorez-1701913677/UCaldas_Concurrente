from database.mongo import Database
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, HTTPException
from response.process_file_response import ProcessFileResponse
from services.genoma_serviceV2 import GenomeProcessorService
from motor.motor_asyncio import AsyncIOMotorDatabase

import os
import tempfile
import traceback

from multiprocessing import Pool, cpu_count

routerV2 = APIRouter()

# Define the response model
@routerV2.post("/process_file", response_model=ProcessFileResponse)
async def process_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(Database.get_db),
) -> ProcessFileResponse:
    
    processor = GenomeProcessorService(db)

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
            
            processor.process_file_in_chunks(temp_file_path)

            return ProcessFileResponse(
                message="Archivo recibido y procesado en segundo plano",
                files_processed=1,
                total_time=0,
            )

    except Exception as e:
        traceback.print_exc()
        return ProcessFileResponse(
            message=f"Error procesando archivo: {str(e)}", files_processed=0
        )