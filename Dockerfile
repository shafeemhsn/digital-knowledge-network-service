FROM node:22.15.1-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN apk add --no-cache python3 make g++ \
  && npm ci

COPY . .

RUN npm run build \
  && npm prune --omit=dev

FROM node:22.15.1-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 10000

CMD ["npm", "start"]
