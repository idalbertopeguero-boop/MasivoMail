# MasivoMail

Terminal pixel-retro en Docker para enviar correos por tandas desde tu propio Gmail o SMTP.

MasivoMail nacio de una idea simple: hay veces en las que un solo correo no basta. Si te toca insistir, ordenar tandas, medir tiempos y mantener una salida visualmente clara, esta app lo hace desde una web local con estilo retro, sin depender de un SaaS externo.

## Capturas

### Principal

![Vista principal](docs/images/main.png)

### Configuracion

![Vista de configuracion](docs/images/config.png)

## Que hace

- Corre localmente en Docker.
- Permite salida por `Gmail key`, `SMTP guiado` y `SMTP manual`.
- Deja definir `correos por tanda`, `intervalo`, `modo de envio`, `ventana de tiempo` y `reinicio automatico`.
- Acepta adjuntos de imagen y PDF.
- Muestra progreso, log y agenda de tandas.
- Incluye selector `ES | EN`, onboarding y detalles visuales pixel-art.

## Por que existe

No intenta ser una herramienta corporativa ni una plataforma de marketing.

La idea es mas directa:

- escribir una vez
- organizar envios por tandas
- dejar visible cuando sale cada bloque
- insistir desde tu propio correo sin perder el ritmo

## Arranque en una linea

```bash
docker compose up -d --build
```

Luego abre [http://localhost:3000](http://localhost:3000).

Para apagar:

```bash
docker compose down
```

## Modos de salida

### `Gmail key`

Usa tu Gmail y una clave de aplicacion de Google.

### `SMTP guiado`

Usa un preset ya preparado para:

- Gmail
- Outlook.com
- Microsoft 365
- Hostinger

### `SMTP manual`

Te deja tocar host, puerto, TLS y usuario cuando tu salida no esta en la lista.

## Flujo de uso

1. En `Configuracion`, eliges el modo de salida y pruebas la conexion.
2. En `Principal`, pegas destinatarios, asunto, cuerpo y adjuntos.
3. Defines:
   - correos por tanda
   - cada cuantos segundos o minutos
   - si sale `De golpe` o `Encolado`
   - cuanto dura la ventana
   - si quieres que reinicie otra ventana igual al terminar
4. Lanzas la cola y revisas `Progreso`, `Agenda` y `Log`.

## Stack

- Node.js
- Express
- Nodemailer
- Docker
- HTML, CSS y JavaScript vanilla

## Ejecutar sin Docker

```bash
npm install
npm start
```

## Estructura

```text
public/         interfaz retro
server.js       backend y logica de cola
storage/        config local y adjuntos temporales
docker-compose.yml
Dockerfile
```

## Validacion usada

- `node --check server.js`
- `node --check public/app.js`
- `docker compose up -d --build`

## Uso responsable

MasivoMail envia desde tu propia cuenta y tu propia salida SMTP.

No incluye:

- ocultacion de identidad
- evasiones de filtros
- proxies raros
- automatismos para saltarse limites del proveedor

La responsabilidad del uso, del volumen y de las credenciales sigue siendo tuya.
