FROM node:20-alpine AS base
WORKDIR /app

FROM base AS build
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

ENV NODE_ENV=production
EXPOSE 4002
ENTRYPOINT ["./entrypoint.sh"]
