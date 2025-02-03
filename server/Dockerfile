# 使用 Python 基础镜像
FROM python:3.12-rc

# 安装 diff-pdf 工具的依赖
RUN apt-get update && apt-get install -y \
    poppler-utils \
    ghostscript \
    wget \
    && rm -rf /var/lib/apt/lists/*

# 下载并安装 diff-pdf
RUN wget https://github.com/vslavik/diff-pdf/releases/download/v1.4.0/diff-pdf_1.4.0_amd64.deb \
    && dpkg -i diff-pdf_1.4.0_amd64.deb \
    && rm diff-pdf_1.4.0_amd64.deb

# 设置工作目录
WORKDIR /app

# 复制 requirements.txt 并安装依赖
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# 复制项目代码
COPY . .

# 设置 FastAPI 运行端口
EXPOSE 8000

# 启动 FastAPI 应用
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
