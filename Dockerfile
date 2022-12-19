FROM node:18-alpine as builder

ENV PROJECT_ENV production

WORKDIR /code

COPY package.json package-lock.json /code/
RUN npm install --omit=dev

COPY . /code
RUN npm run build

FROM nginx:alpine
COPY --from=builder /code/build /usr/share/nginx/html