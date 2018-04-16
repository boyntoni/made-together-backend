FROM node:carbon

WORKDIR /Users/ianboynton/code/personal/made-together/made-together-backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "start" ]


