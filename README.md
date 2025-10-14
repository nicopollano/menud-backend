### URL:

**Develop**:

```
    https://api.ristokit.com
```


<details>
  <summary>Variables de entorno</summary>

  ## .env Example

  ```
    HOST=<VALUE>
    PORT_DB=<VALUE>
    USERNAME_DB=<VALUE>
    PASSWORD=<VALUE>
    DATABASE=<VALUE>
    DB_SSL=<VALUE>
    PORT=<VALUE>
    TOKENDURATION=<VALUE>
    REFRESHTOKENDURATION=<VALUE>
    TOKENRESETPASSWORDDURATION=<VALUE>
    WEBSOCKET_PORT=<VALUE>
    GOOGLECLOUDPROJECTID=<VALUE>
    GOOGLECLOUDFILEPATH=<VALUE>
    STAGE=<VALUE>
    TOKENINVITATIONDURATION=<VALUE>
    TEMPLATE_EMAIL_PATH=<VALUE>
    IMAGEKIT_PUBLIC_KEY=<VALUE>
    IMAGEKIT_PRIVATE_KEY=<VALUE>
    IMAGEKIT_URL_ENDPOINT=<VALUE>
  ```
</details>

<details>
  <summary>Manejo de cuentas</summary>

  ## Flujo para crear una cuenta empleado
  - Crear cuenta administrador
  - Crear empresa
  - Crear sucursal 
  <br>

  - Crear cuenta empleado
  - Con la cuenta de admin y el id de la cuenta del empleado, agregar a una sucursal en especifico

  ---
</details>


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


## Pasos para correr backend

Descargar repositorio
```bash
git clone https://github.com/ristokit/backend.git ristokit-backend
```

Entrar a la carpeta del repositorio
```bash
cd ristokit-backend
```

Instalar dependencias
```bash
npm i
```

Iniciar backend
```bash
npm run build \
npm run start:dev
```


Paquetes para sigoz
```
  "@opentelemetry/api": "^1.9.0",
  "@opentelemetry/auto-instrumentations-node": "^0.203.0",
  "@opentelemetry/exporter-otlp-http": "^0.203.0",
  "@opentelemetry/exporter-trace-otlp-http": "^0.203.0",
  "@opentelemetry/instrumentation-http": "^0.203.0",
  "@opentelemetry/instrumentation-typeorm": "^0.4.0",
  "@opentelemetry/sdk-node": "^0.203.0",
  "@willsoto/nestjs-prometheus": "^6.0.2",
```