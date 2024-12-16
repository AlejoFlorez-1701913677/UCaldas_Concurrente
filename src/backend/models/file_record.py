from datetime import datetime
from pydantic import BaseModel

class FileRecord(BaseModel):
    filename: str
    status: str
    created_at: str
    processed_time: datetime
    error: str = None
