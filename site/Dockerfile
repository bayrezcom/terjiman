# syntax=docker/dockerfile:1

# Static marketing site for terjiman.bayrez.com.
# nginx-unprivileged listens on 8080 as a non-root user, which is what
# Coolify and most container platforms expect.
FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx index.html   /usr/share/nginx/html/index.html
COPY --chown=nginx:nginx privacy.html /usr/share/nginx/html/privacy.html
COPY --chown=nginx:nginx icon.png    /usr/share/nginx/html/icon.png
COPY --chown=nginx:nginx favicon.png /usr/share/nginx/html/favicon.png
COPY --chown=nginx:nginx robots.txt  /usr/share/nginx/html/robots.txt
COPY --chown=nginx:nginx sitemap.xml /usr/share/nginx/html/sitemap.xml

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD ["/bin/sh", "-c", "wget -qO- http://127.0.0.1:8080/ >/dev/null || exit 1"]
