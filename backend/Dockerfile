# ベースイメージの設定 (ビルドステージ)
FROM python:3.12-slim AS builder

# Pythonの標準出力のバッファリングを解除
ENV PYTHONUNBUFFERED=1

# 作業ディレクトリの設定
WORKDIR /backend

# 必要なパッケージのインストール
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    wget \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 容量が大きいため、使用時にダウンロードする方式に
# # u2netモデルのダウンロード (rembg 用)
# RUN mkdir -p /root/.u2net && \
#     wget https://github.com/danielgatis/rembg/releases/download/v0.0.0/u2net.onnx -O /root/.u2net/u2net.onnx

# pipの最新バージョンにアップグレード
RUN pip install --upgrade pip

# 依存関係のインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 実行用の軽量イメージ
FROM python:3.12-slim AS runner

ENV PYTHONUNBUFFERED=1
WORKDIR /backend

# 必要なシステムライブラリを再インストール (PostgreSQL 用)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# builderからの必要なファイルのコピー
# COPY --from=builder /root/.u2net /root/.u2net
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# アプリケーションコードのコピー
COPY . .
