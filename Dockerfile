FROM nvidia/cuda:12.1.0-devel-ubuntu22.04

# 기본 도구 설치
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv \
    git curl wget ffmpeg nvidia-utils-525\
    libglib2.0-0 libsm6 libxext6 libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리
WORKDIR /workspace

# 가상환경 생성 및 활성화
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# 가상환경에 패키지 설치
RUN pip install --upgrade pip && \
    pip install \
        torch torchvision torchaudio  --index-url https://download.pytorch.org/whl/cu121 && \
    pip install \
        jupyterlab \
        opencv-python \
        matplotlib \
        numpy \
        pandas \
        seaborn \
        tqdm \
        fastapi \
        uvicorn \
        ultralytics \
        python-multipart \
        notebook

# JupyterLab 시작
CMD ["jupyter", "lab", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root", "--NotebookApp.token=''", "--NotebookApp.password=''"]


# FROM python:3.10-slim

# # 필수 패키지 설치
# RUN apt-get update && apt-get install -y \
#     git \
#     curl \
#     wget \
#     libglib2.0-0 \
#     libsm6 \
#     libxext6 \
#     libxrender-dev \
#     ffmpeg \
#     && rm -rf /var/lib/apt/lists/*

# RUN apt-get update && apt-get install -y procps

# # YOLO를 위한 pytorch, opencv 등 설치
# RUN pip install --upgrade pip && \
#     pip install \
#     torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu && \
#     pip install \
#     jupyterlab \
#     opencv-python \
#     matplotlib \
#     numpy \
#     pandas \
#     seaborn \
#     tqdm \
#     fastapi \
#     uvicorn \
#     ultralytics \
#     python-multipart \
#     notebook
    

# # 작업 디렉토리 설정
# WORKDIR /workspace

# # JupyterLab 시작 시 자동 실행되도록 설정
# CMD ["jupyter", "lab", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root", "--NotebookApp.token=''", "--NotebookApp.password=''"]
