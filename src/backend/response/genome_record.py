from typing import Optional
from pydantic import BaseModel

# Define el modelo de respuesta
class GenomeRecord(BaseModel):
    CHROM: str
    POS: str
    ID: Optional[str]
    REF: str
    ALT: str
    QUAL: Optional[str]
    FILTER: Optional[str]
    INFO: Optional[str]
    FORMAT: Optional[str]

    class Config:
        orm_mode = True