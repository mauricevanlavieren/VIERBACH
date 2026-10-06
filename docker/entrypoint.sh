#!/bin/sh
set -eu
mkdir -p /var/lib/vierbach/data /var/lib/vierbach/uploads
if [ ! -f /var/lib/vierbach/data/content.json ]; then
    cp /opt/vierbach-seed/data/content.json /var/lib/vierbach/data/content.json
fi
cp -n /opt/vierbach-seed/data/.htaccess /var/lib/vierbach/data/.htaccess
for file in /opt/vierbach-seed/uploads/*; do
    [ -f "$file" ] || continue
    cp -n "$file" /var/lib/vierbach/uploads/
done
chown -R www-data:www-data /var/lib/vierbach
exec apache2-foreground
