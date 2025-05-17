from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str
    language: str
    input: str

@app.post("/execute")
async def execute_code(request: CodeRequest):
    try:
        with open("temp.py", "w") as f:
            f.write(request.code)
        
        with open("input.txt", "w") as f:
            f.write(request.input)
        
        process = subprocess.run(
            ["python", "temp.py"],
            input=request.input,
            text=True,
            capture_output=True
        )
        
        os.remove("temp.py")
        if os.path.exists("input.txt"):
            os.remove("input.txt")
        
        return {
            "output": process.stdout,
            "error": process.stderr
        }
    except Exception as e:
        return {"error": str(e)}