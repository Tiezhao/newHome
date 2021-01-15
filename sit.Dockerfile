FROM nginx:alpine

WORKDIR /data/www

COPY nginx.conf /etc/nginx

COPY default-sit.conf /etc/nginx/conf.d/

COPY build /data/www

EXPOSE 80
