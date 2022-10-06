FROM node:16-alpin
ENV NODE_ENV=development

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 8000
CMD ["npm", "run", "start"]
