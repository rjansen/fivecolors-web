# Builds a Docker to deliver dist/
FROM nginx:latest
COPY dist/ /usr/share/nginx/html
#RUN ln -sf /dev/stdout /var/log/nginx/access.log \
#    && ln -sf /dev/stderr /var/log/nginx/error.log