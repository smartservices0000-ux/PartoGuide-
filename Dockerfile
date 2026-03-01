FROM node:18

WORKDIR /app

COPY . .

RUN npm install
RUN npm install --prefix frontend
RUN npm install --prefix backend

RUN npm run build --prefix frontend

ENV PORT=8080
ENV GOOGLE_CLOUD_LOCATION=europe-west1

CMD ["node", "backend/server.js"]
