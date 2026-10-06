FROM node:22-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY index.html vite.config.ts tsconfig.json ./
COPY src ./src
RUN npm run build

FROM php:8.3-apache
RUN rm -f /etc/apache2/mods-enabled/mpm_*.load /etc/apache2/mods-enabled/mpm_*.conf \
 && a2enmod mpm_prefork rewrite headers \
 && sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf \
 && sed -i 's/:80>/:8080>/' /etc/apache2/sites-available/000-default.conf
COPY --from=frontend /app/dist/ /var/www/html/
COPY backend/ /var/www/html/
COPY docker/apache.conf /etc/apache2/conf-enabled/vierbach.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/vierbach.ini
COPY docker/entrypoint.sh /usr/local/bin/vierbach-start
COPY docker/migrate-content.php /usr/local/bin/vierbach-migrate-content.php
RUN php -l /usr/local/bin/vierbach-migrate-content.php
RUN find /var/www/html/api -name '*.php' -exec php -l {} \; \
 && mkdir -p /opt/vierbach-seed \
 && cp -a /var/www/html/data /var/www/html/uploads /opt/vierbach-seed/ \
 && rm -rf /var/www/html/data /var/www/html/uploads /var/www/html/tools \
 && ln -s /var/lib/vierbach/data /var/www/html/data \
 && ln -s /var/lib/vierbach/uploads /var/www/html/uploads \
 && chmod +x /usr/local/bin/vierbach-start \
 && apache2ctl -t
EXPOSE 8080
CMD ["vierbach-start"]
