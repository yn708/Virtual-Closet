# 外部イメージをbaseステージとして扱う
FROM oven/bun:1.2.1 AS base

# baseステージをもとにbuilderステージを開始
FROM base AS builder
WORKDIR /frontend

COPY package.json bun.lockb ./
RUN bun install

# ソースコードのコピーとビルド
COPY . .
RUN bun run build

# baseステージをもとにrunnerステージを開始
FROM base AS runner
WORKDIR /frontend


COPY --from=builder /frontend/package.json ./
COPY --from=builder /frontend/bun.lockb ./
COPY --from=builder /frontend/node_modules ./node_modules
COPY --from=builder /frontend/public ./public
COPY --from=builder /frontend/.next/static ./.next/static
COPY --from=builder /frontend/.next/standalone ./

CMD ["bun", "server.js"]