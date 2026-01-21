FROM node:22-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN ls node_modules/axios
CMD ["npm", "start"]