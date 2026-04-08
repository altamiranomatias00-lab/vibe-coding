FROM nginx:alpine

# Copiar los archivos estáticos al directorio de Nginx
COPY index.html /usr/share/nginx/html/index.html
COPY style.css /usr/share/nginx/html/style.css
COPY app.js /usr/share/nginx/html/app.js

# Cambiar el puerto de Nginx a 8080 para Cloud Run
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Exponer el puerto requerido por Cloud Run
EXPOSE 8080

# Ejecutar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
