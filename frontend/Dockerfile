
# oven/bun:latest を使用すると
# jest実行でエラーになるため、nodeを使用してそこにbunをインストールして使用
FROM node:21.7.3

WORKDIR /frontend

# npmのバージョンを最新にし、bunをインストール
RUN npm install -g npm@latest
RUN npm install -g bun

COPY package.json bun.lockb /frontend/
RUN bun install

COPY . /frontend

EXPOSE 4000

CMD ["bun", "dev", "-p", "4000"]
