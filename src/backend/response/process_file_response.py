from pydantic import BaseModel

class ProcessFileResponse(BaseModel):
    message: str
    files_processed: int