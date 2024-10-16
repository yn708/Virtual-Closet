# ベースイメージの設定
FROM python:3.12

# Pythonの標準出力のバッファリングを解除して、出力を即座に表示できるよう設定
ENV PYTHONUNBUFFERED=1

# 作業ディレクトリの設定
WORKDIR /backend

# pipの最新バージョンにアップグレード
RUN pip install --upgrade pip

# 依存関係のインストール
ADD requirements.txt /backend/
RUN pip install --no-cache-dir -r requirements.txt

# ソースコードをコンテナ内にコピー
COPY . /backend