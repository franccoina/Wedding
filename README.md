# Invitacion Web de Boda

Landing page en React para una invitacion digital de matrimonio. Incluye una introduccion animada, informacion del evento, cuenta regresiva, galeria, mapa embebido y formulario de confirmacion de asistencia. La invitación y su contenido han sido personalizados para la boda de Daniela y Michael.

## Tecnologias

- React 18
- Vite 6
- CSS nativo
- Google Apps Script para conectar el formulario a Google Sheets

## Requisitos

- Node.js 20 o superior
- npm
- Una cuenta de Google si se desea recibir confirmaciones en Google Sheets

## Instalacion

Desde la raiz del proyecto:

```powershell
npm.cmd install
```

## Ejecutar En Desarrollo

```powershell
npm.cmd run dev -- --host 127.0.0.1
```

Luego abre:

```text
http://127.0.0.1:5173
```

Para detener el servidor, usa `Ctrl + C` en la consola donde se esta
ejecutando.

## Compilar Para Produccion

```powershell
npm.cmd run build
```

El resultado se genera en la carpeta `dist/`.

Para revisar la compilacion localmente:

```powershell
npm.cmd run preview
```

## Funcionalidades

- Portada vertical con sobre y sello dorado.
- Animacion de apertura a pantalla completa al tocar la invitacion.
- Cuenta regresiva hasta el 25 de octubre de 2026.
- Secciones de bienvenida, historia, detalles, itinerario y regalos.
- Galeria navegable de imagenes.
- Mapa embebido de la recepcion y enlace a Google Maps.
- Formulario RSVP con:
  - Confirmacion o rechazo de asistencia.
  - Nombre completo.
  - Telefono.
  - Rango de edad.
  - Restricciones alimentarias.
  - Mensaje para la pareja.

___Nota:__ Cada asistente debe completar y enviar su propia confirmacion. Si una persona tiene permitido asistir con acompañante, este tambien debera registrar una respuesta independiente en el formulario._

## Informacion Actual Del Evento

- Fecha: 25 de octubre de 2026.
- Recepcion: Sagrado, Medellin.
- Direccion: via La Catedral, vereda El Vallano, km 4, Envigado, Antioquia.
- Mapa: configurado en la seccion `Ubicacion`.

## Datos Pendientes

El documento inicial no incluye:

- Nombres de la pareja.
- Hora del evento.
- Lugar de la ceremonia.
- Fotografias y videos personales.
- Cancion para la invitacion.
- Texto definitivo de cada seccion.

Estos datos deben actualizarse en `src/App.jsx`.

## Conectar El Formulario A Google Sheets

Sin configuracion adicional, el formulario guarda respuestas solo en el
`localStorage` del navegador. Para recibir respuestas reales desde cualquier
dispositivo, configura Google Sheets.

### 1. Crear La Hoja

1. Crea una hoja de calculo en Google Sheets.
2. Renombra la primera pestana como `Confirmaciones`.
3. En la primera fila agrega:

```text
Fecha | Asistencia | Nombre | Telefono | Rango de edad | Alimentacion | Mensaje | Fecha del dispositivo
```

### 2. Configurar Apps Script

1. En Google Sheets, abre `Extensiones > Apps Script`.
2. Reemplaza el contenido del editor con el archivo:

```text
google-apps-script/Code.gs
```

1. Guarda el proyecto.
2. Selecciona `Implementar > Nueva implementacion`.
3. Elige `Aplicacion web`.
4. En `Ejecutar como`, selecciona tu cuenta.
5. En acceso, selecciona `Cualquier usuario`.
6. Autoriza el script.
7. Copia la URL que termina en `/exec`.

### 3. Configurar El Frontend

1. Crea un archivo `.env` en la raiz del proyecto.
2. Usa `.env.example` como base:

```env
VITE_RSVP_ENDPOINT=https://script.google.com/macros/s/TU_ID/exec
```

1. Reinicia el servidor de desarrollo.

Cada envio agregara una fila en la pestana `Confirmaciones`.

## Estructura Del Proyecto

```text
.
|-- google-apps-script/
|   `-- Code.gs
|-- public/
|   |-- img/
|   `-- favicon.ico
|-- src/
|   |-- assets/
|   |   |-- couple-logotype.png
|   |   |-- hero-wedding.png
|   |   |-- invitation-cover.jpg
|   |   |-- invitation-opening.mp4
|   |   |-- ornament.png
|   |   |-- reception.png
|   |   `-- stationery.png
|   |-- App.jsx
|   |-- main.jsx
|   `-- styles.css
|-- .env.example
|-- index.html
|-- package.json
`-- vite.config.js
```

## Archivos Principales

- `src/App.jsx`: contenido, secciones y comportamiento.
- `src/styles.css`: estilos visuales y responsive.
- `src/assets/`: imagenes y video usados por la invitacion.
- `google-apps-script/Code.gs`: endpoint que agrega filas a Google Sheets.
- `.env.example`: plantilla para configurar la URL de Apps Script.

## Notas De Implementacion

- La URL del endpoint no se debe escribir directamente en `App.jsx`; usa
  siempre la variable `VITE_RSVP_ENDPOINT`.
- El archivo `.env` no debe subirse a un repositorio publico.
- El script de Google protege las celdas frente a valores que comienzan con
  caracteres interpretables como formulas.
- Para cambiar la fecha de la cuenta regresiva, modifica `weddingDate` en
  `src/App.jsx`.
