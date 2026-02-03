FROM php:8.2-fpm

# Create sail user
RUN useradd -m -s /bin/bash sail

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev zip curl \
    nodejs npm \
    && docker-php-ext-install pdo pdo_mysql zip mbstring exif pcntl bcmath gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy custom PHP INI files
COPY docker/php/*.ini /usr/local/etc/php/conf.d/

# Install PHP deps via Composer (cache layer)
COPY composer.json composer.lock* ./
# Install including dev dependencies so packages required for local/dev (like laravel/boost) are available
RUN if [ -f composer.json ]; then composer install --optimize-autoloader --no-interaction --no-progress || true; fi

COPY . .

RUN chown -R sail:sail /var/www/html && chmod -R 755 /var/www/html/storage || true

EXPOSE 9000

CMD ["php-fpm"]
