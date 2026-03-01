FROM node:18

WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

RUN npm install

COPY . .

RUN npm run build --prefix frontend

CMD ["npm", "start", "--prefix", "backend"]
