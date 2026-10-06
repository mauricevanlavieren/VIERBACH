# VIERBACH on Railway

Deploy the repository with its Dockerfile. The container serves React and PHP together on port 8080.

Required service settings:
- PORT=8080.
- Attach a persistent volume at /var/lib/vierbach before editing content.
- Set ADMIN_USERNAME (defaults to admin).
- Set ADMIN_PASSWORD_HASH to a bcrypt hash, or set a strong ADMIN_PASSWORD through Railway Variables. Never commit credentials.

No default admin password is accepted. Public content works without admin credentials.

The first start seeds content and images. Subsequent deployments preserve existing content and uploaded images. Configure volume backups in Railway. Keep one replica for this file-based CMS.

The account trial is temporary. Review billing and the recurring domain renewal price before purchasing.
