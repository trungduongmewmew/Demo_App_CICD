FROM node:18-alpine
WORKDIR /app
COPY package*.json ./

# Rất quan trọng: Cài đặt thư viện 'pg'
RUN npm install

COPY . .
EXPOSE 8080
CMD [ "node", "index.js" ]