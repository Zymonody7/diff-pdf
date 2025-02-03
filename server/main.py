import os
import subprocess
from pathlib import Path
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/compare-pdfs/")
async def compare_pdfs(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    # 保存上传的文件
    file1_path = Path(f"temp1_{file1.filename}")
    file2_path = Path(f"temp2_{file2.filename}")
    output_diff_path = Path("diff.pdf")

    with open(file1_path, "wb") as f1:
        f1.write(await file1.read())

    with open(file2_path, "wb") as f2:
        f2.write(await file2.read())

    command = [
        "diff-pdf",
        "--output-diff=diff.pdf",
        "--mark-differences",
        "--grayscale",
        str(file1_path),
        str(file2_path),
    ]

    try:
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        print("Command output:", result.stdout)
    except subprocess.CalledProcessError as e:
        print("Command failed with error:", e)
    finally:
        os.remove(file1_path)
        os.remove(file2_path)
    print('ttt')
    return FileResponse(
        str(output_diff_path),
        media_type="application/pdf",
        filename=str(output_diff_path.name),
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)