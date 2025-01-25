# ベースイメージの設定
FROM python:3.12-slim

# Pythonの標準出力のバッファリングを解除して、出力を即座に表示できるよう設定
ENV PYTHONUNBUFFERED=1

# 作業ディレクトリの設定
WORKDIR /backend

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wget \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# u2netモデルのダウンロードを追加(rembg)
RUN mkdir -p /root/.u2net && \
    wget https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx -O /root/.u2net/u2net.onnx


# pipの最新バージョンにアップグレード
RUN pip install --upgrade pip

# 依存関係のインストール
ADD requirements.txt /backend/
RUN pip install --no-cache-dir -r requirements.txt

# ソースコードをコンテナ内にコピー
COPY . /backend