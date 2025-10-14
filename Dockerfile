FROM node:24.4.1-slim

RUN apt-get update -y && apt-get install -y ca-certificates curl gnupg
RUN echo "deb https://apt.postgresql.org/pub/repos/apt jammy-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
 && curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /usr/share/keyrings/postgresql.gpg \
 && echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] https://apt.postgresql.org/pub/repos/apt jammy-pgdg main" > /etc/apt/sources.list.d/pgdg.list \
 && apt-get update \
 && apt-get install -y postgresql-client-17 \
 && rm -rf /var/lib/apt/lists/*
 
COPY scripts/init-db.sh /tmp/init-db.sh
RUN chmod +x /tmp/init-db.sh

COPY scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["/usr/local/bin/entrypoint.sh"]
