# Himnario Adventista Broadcast

![obs-websocket](https://img.shields.io/badge/obs--websocket-4.x-blue?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/jhormanrus/himnario-adventista-broadcast?style=for-the-badge)

![Preview](https://res.cloudinary.com/jhormanrus/image/upload/v1650001781/my-repositories/himnario-adventista/1.png)

## ¿Qué es?

Himnario Adventista Broadcast es una GUI web diseñada para ser usada con [OBS Studio](https://obsproject.com) o simplemente como un reproductor de himnos.

Esta GUI permite:

- Buscar himnos por número
- Mostrar número, título, verso y letra del himno en pantalla
- Reproducir la melodía del himno (instrumental o cantado)
- Controlar la letra y la melodía del himno
- Personalizar los estilos de la letra y el fondo

## Instalación

Para usarla con OBS Studio, es requerido tener instalado el plugin [obs-websocket](https://obsproject.com/forum/resources/obs-websocket-remote-control-obs-studio-using-websockets.466/history) versión 4. La GUI usa el puerto 4444 por defecto de este plugin.

> **Nota**: Si usas la versión 5.x de obs-websocket, puedes leer la documentación de la [versión 2](https://github.com/jhormanrus/himnario-adventista-broadcast) de la GUI.

La GUI se encuentra en la siguiente dirección: <https://himnario-adventista-broadcast-old.vercel.app>. Puedes usarla directamente en tu navegador web o agregarla como un **panel de navegador personalizado** en OBS Studio.

## Configuración básica

La GUI requiere que tengas y respetes obligatoriamente los nombres de las siguientes fuentes en una misma escena en OBS Studio:

```text
ESCENA
└── Himnario (nombre de ejemplo)
    └── FUENTES
        ├── hymn_number
        ├── hymn_title
        ├── verse_number
        └── verse_content
```

Todas las fuentes requeridas deben ser de tipo **Texto (GDI+)** en Windows o **Texto (FreeType 2)** en Linux y macOS.

La visibilidad de las fuentes son administradas por la GUI, pero la personalización de los estilos de las fuentes (fuente, tamaño, color, etc.) es responsabilidad del usuario.

Si bien la GUI requiere que tengas la escena y fuentes mencionadas, puedes agregar libremente otras fuentes a la escena para personalizarla a tu gusto como por ejemplo: un fondo, un logo, etc.

Finalmente, en la GUI debes conectarla con OBS Studio usando el botón **Connect**.

## Configuración avanzada

La GUI tiene una configuración avanzada que puedes acceder desde el botón tuerca en la parte superior derecha de la GUI. En la configuración avanzada puedes establecer:

### Al buscar un himno
- **Only instrumental**: Melodía solo instrumental (si no está marcado, se reproducirá la melodía cantada)
- **Autoplay music**: Auto reproducir la melodía
- **Autodrive verses**: Auto dirigir la letra del himno en pantalla
- **Switch to hymn scene**: Cambiar a la escena del himno (ninguna por defecto)

### Al terminar de reproducir un himno
- **Switch to scene**: Cambiar a una escena específica (ninguna por defecto)

### Red
- **Custom OBS websocket**: Usar un servidor websocket de OBS Studio personalizado (por defecto usa localhost:4444)
- **Custom music host**: Usar un servidor de melodías personalizado (por defecto usa el del [Himnario Adventista API](https://github.com/jhormanrus/himnario-adventista-api))
- **Custom hymnal API**: Usar un servidor de la API de Himnario Adventista personalizado (por defecto usa el [Himnario Adventista API](https://sdah.my.to/hymn))

La GUI está pensada para usarla online, pero gracias a la configuración avanzada puedes usarla sin conexión a internet levantando localmente el [Himnario Adventista API](https://github.com/jhormanrus/himnario-adventista-api) y configurando la GUI para usarlo.

## Necesito ayuda

Si tienes alguna duda o sugerencia, puedes abrir un [issue](https://github.com/jhormanrus/himnario-adventista-api/issues) o ponerte en contacto conmigo en mi [LinkedIn](https://www.linkedin.com/in/jhormanrus/).
