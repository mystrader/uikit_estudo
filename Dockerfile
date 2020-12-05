#---------------Estágio usado para rodar apenas em ambiente de desenvolvimento com propósito de realizar depuração de código
FROM tjmt/angular:node-10 as debug

WORKDIR /source
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .

RUN chmod +x ./entrypoint-debug.sh
ENTRYPOINT ./entrypoint-debug.sh

#---------------Estágio usado para rodar os Testes (teste unitário, teste de integração, sonarqube)
FROM debug as tests

RUN chmod +x ./entrypoint-tests.sh
ENTRYPOINT ./entrypoint-tests.sh

#---------------Estágio usada para build/publish/pack
FROM debug as build

COPY docker-compose.cd-release.yml docker-compose.env* cd.sh /app/source/

# # Se precisar utilizar arquivos de ambiente customizados, ajuste a variável abaixo com o nome desejado.
# # Exemplo: Caso o nome do arquivo seguir o padrão 'docker-compose.env-api-{ambiente}.yml', passe o valor como 'ENV_SERVICES=api-'
# ENV ENV_SERVICES=

# COPY docker-compose.env-${ENV_SERVICES}alpha.yml /app/source/docker-compose.env-alpha.yml
# COPY docker-compose.env-${ENV_SERVICES}beta.yml /app/source/docker-compose.env-beta.yml
# COPY docker-compose.env-${ENV_SERVICES}rc.yml /app/source/docker-compose.env-rc.yml
# COPY docker-compose.env-${ENV_SERVICES}stable.yml /app/source/docker-compose.env-stable.yml

RUN npm run build -- --aot=true --build-optimizer=true --optimization=true --prod --configuration=production --base-href=/ --output-path=/app/www

# Caso use pacote npm, descomentar abaixo
# RUN npm pack
# RUN mkdir -p /app/packages/npm && mv *.tgz /app/packages/npm

#---------------Estágio usado para runtime
FROM tjmt/angular:nginx-latest AS runtime

ARG BASE_HREF="/"

COPY nginx/server.crt /etc/nginx/server.crt
COPY nginx/server.key /etc/nginx/server.key

# Copia o arquivo de configuração do nginx
COPY nginx/default.conf /etc/nginx/conf.d/

# Modifica o arquivo de configuração do NGINX para incluir o BASE_HREF
RUN MYVARS='$BASE_HREF' && envsubst "$MYVARS" < "/etc/nginx/conf.d/default.conf" > "/etc/nginx/conf.d/default.conf"
RUN cat "/etc/nginx/conf.d/default.conf"

# Remove o site padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /source/entrypoint.sh /usr/share/nginx/html
COPY --from=build /app/www/ /usr/share/nginx/html/

WORKDIR /usr/share/nginx/html
RUN chmod +x ./entrypoint.sh
ENTRYPOINT ./entrypoint.sh
