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
rm -f /etc/apache2/mods-enabled/mpm_*.load /etc/apache2/mods-enabled/mpm_*.conf
ln -s /etc/apache2/mods-available/mpm_prefork.load /etc/apache2/mods-enabled/mpm_prefork.load
ln -s /etc/apache2/mods-available/mpm_prefork.conf /etc/apache2/mods-enabled/mpm_prefork.conf
export APACHE_CONFDIR=/etc/apache2
export APACHE_ENVVARS=/etc/apache2/envvars
apache2ctl -t
exec apache2ctl -D FOREGROUND
