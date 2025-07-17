FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm i npm -g
RUN npm install  

COPY . .

FROM node:20-alpine  

WORKDIR /app

COPY --from=build /app /app

EXPOSE 3000

CMD ["npm", "run", "dev:docker"]