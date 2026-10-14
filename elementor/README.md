# Zayt Café → Elementor Free

Página completa en **inglés y árabe** para **Elementor Free**, sin Elementor Pro y sin plugins obligatorios.

```
src/ (React, fuente de verdad) ──► tools/elementor/build.mjs ──► elementor/templates/*.json
```

## Qué plantilla usar

| Archivo (`templates/`) | Uso |
|---|---|
| **`zayt-home-bilingual.json`** | **La recomendada para el experimento.** Una sola página con los dos idiomas; el selector EN/AR cambia en el sitio, sin recargar, y actualiza la URL (`/` ↔ `/ar/`). Trae su CSS/JS incrustado. |
| `zayt-home-bilingual.external-assets.json` | Igual, pero **sin** el bloque de CSS/JS. Se usa con `snippet-assets.php` (CSS/JS en todo el sitio), así nadie puede romper la página borrando un widget. |
| `zayt-home-en.json`, `zayt-home-ar.json` | Una plantilla por idioma, para el enfoque de dos páginas (p. ej. con Polylang). |
| `snippet-ar-route.php` | WordPress: hace que `/ar/` cargue la misma página de inicio (obligatorio con la bilingüe). |
| `snippet-assets.php` | WordPress: CSS + JS + fuentes para toda la web (solo con la variante `external-assets`). |
| `media-manifest.json` | Las 5 imágenes a subir a la Media Library, con medidas y clave de mapeo. |

`gemini-original/` conserva los dos JSON de Google AI Studio sin tocar, solo como referencia.

```bash
node tools/elementor/build.mjs                       # regenera elementor/templates
node tools/elementor/validate.mjs                    # validación estática de las 4 plantillas
node tools/elementor/test/bilingual.test.mjs         # comportamiento (necesita Playwright + Chromium, ver test/lib.mjs)
node tools/elementor/test/modular.test.mjs           # edición simulada: quitar, reordenar, duplicar, cambiar controles
node tools/elementor/build.mjs --media-map media.json --lang-urls en=/,ar=/ar/
```

## Cómo importar la bilingüe en un WordPress limpio

1. Tema **Hello Elementor** + plugin **Elementor** (Free, con Contenedores Flexbox, que es lo habitual hoy). *Ajustes → Enlaces permanentes → "Nombre de la entrada"*.
2. **Imágenes primero** (ver más abajo). Después, *Plantillas → Plantillas guardadas → Importar* (o desde el editor, ícono de carpeta) y subir `zayt-home-bilingual.json`.
3. Abrir la página **Home** con Elementor → ícono de carpeta → *Mis plantillas* → **Insertar** "Zayt Café — Home (EN + AR)". Layout **Elementor Canvas**. *Update*. En *Ajustes → Lectura*, Home como página de inicio estática.
4. **Ruta `/ar/`**: pegar `snippet-ar-route.php` en un plugin de fragmentos de código (p. ej. Code Snippets) o en el `functions.php` de un tema hijo. No hace falta crear una página "AR": si ya existe, borrarla. Al activarse, vacía las reglas de URL una sola vez.
5. Probar `http://tusitio.local/` y `http://tusitio.local/ar/` (también con el botón de idioma y con el botón Atrás del navegador).

En el **editor de Elementor** se ven los dos idiomas apilados (primero EN, luego AR) para poder editarlos; en la web pública se ve uno solo.

### Imágenes (sin `/src/assets/...`)

Todas las imágenes son URLs absolutas. Por defecto apuntan a una **URL temporal**: `https://raw.githubusercontent.com/yamilheredia7970-cmd/Zayt-Caf-/main/src/assets/images/…`. Si el repo es público, el importador de Elementor las descarga solas a la Media Library. Si no puede descargarlas, Elementor pone su imagen de relleno.

Opciones, de más a menos cómoda:
- Subir los 5 archivos a la Media Library y **reemplazar el prefijo** `https://raw.githubusercontent.com/yamilheredia7970-cmd/Zayt-Caf-/main/src/assets/images/` por la carpeta de uploads (buscar y reemplazar en el JSON, antes de importar).
- `--image-base-url https://tu-sitio/wp-content/uploads/zayt/` tras subir los 5 archivos por FTP.
- Regenerar con `--media-map`: `{"heroInterior":{"url":"https://…/x.jpg","id":123}, …}` (claves en `media-manifest.json`).

## Cómo funciona el cambio de idioma sin recargar

- Cada bloque de primer nivel lleva la clase `zayt-l-en` o `zayt-l-ar`. `zayt.js` fija `<html data-zayt-lang="en|ar">` (además de `lang` y `dir`) y el CSS muestra un idioma y oculta el otro. Se hace con clases, **sin tocar `display`** de los contenedores (por eso no rompe el flexbox de Elementor).
- El idioma sale de la **ruta** (`/ar/` = árabe, cualquier otra = inglés), así el enlace compartido abre en el idioma correcto, sin parpadeo del otro. El botón de idioma conserva su `href` real (`/` y `/ar/`): sin JavaScript funciona como enlace normal.
- `history.pushState` cambia la URL; el botón Atrás/Adelante cambia el idioma (`popstate`). También cambia `<title>` y mantiene al lector en la misma sección y al mismo punto de avance (las secciones tienen alturas distintas en cada idioma).
- Los anclas del árabe llevan sufijo (`#menu-ar`) para que **no haya IDs duplicados** en la página. El formulario, el drawer móvil, el filtro del menú y el newsletter están acotados a su idioma.
- No se recuerda la elección entre visitas (la URL es la fuente de verdad).

### SEO: qué cubre y qué no
Con esta estructura `/` y `/ar/` devuelven el **mismo HTML** (los dos idiomas); el idioma lo decide JavaScript. Google puede leer ambos textos y `/ar/` es una URL real, pero no hay `hreflang` ni contenido distinto por idioma en el servidor: no equivale a dos páginas traducidas. Para un sitio real que deba posicionarse en árabe, conviene el enfoque de **dos páginas** (`zayt-home-en.json` + `zayt-home-ar.json` + Polylang).

## Modularidad: qué puede cambiar un editor y qué no

`test/modular.test.mjs` simula en el JSON lo que haría alguien en Elementor y mide qué más se mueve (con el arnés aproximado, no con Elementor real):

| Edición | Resultado |
|---|---|
| Plantilla bilingüe frente a las de un solo idioma | Los 13 bloques miden lo mismo (EN y AR). |
| CSS/JS en todo el sitio (variante `external-assets`) | Altura idéntica; header fijo. |
| Borrar cualquier bloque (los 13, uno a uno) | Los demás no cambian de altura; el cambio de idioma sigue funcionando. |
| Reordenar secciones | Cada bloque conserva su altura. |
| Cambiar texto de un título, enlace de un botón, color de fondo, relleno de una sección (controles nativos) | Se aplican; solo cambia la sección editada. Editar el EN no toca el AR. |
| Quitar y duplicar tarjetas de producto | La tarjeta duplicada entra en el filtro de su categoría sin tocar el JS; la rejilla sigue regular. |
| "Gap" de las 5 rejillas (Features, Destacados, Menú, Testimonios, Galería) | Reacomoda las tarjetas desde el panel de Elementor. |

Lo que **sí** puede romper la página (conviene decírselo a quien edite):
- **Borrar o editar el bloque "[CODE] Zayt CSS + JS"** (el contenedor `zayt-assets`): la página queda sin estilos. La variante `external-assets` + `snippet-assets.php` elimina este punto único de fallo.
- **Quitar las clases `zayt-*`** de la pestaña *Avanzado → Clases CSS* (p. ej. `zayt-cols`): las rejillas colapsan a una columna.
- **Los widgets `[HTML] …`** (menú del header, selector de idioma, formulario, horarios, newsletter, estrellas…) solo se editan como código. Están etiquetados así en el Navigator.
- **Cada idioma se edita por separado**: un cambio de precio o de teléfono hay que hacerlo en el bloque EN y en el AR.
- Para **añadir un producto** hay que duplicar una tarjeta y mantener su clase de categoría (`zayt-cat-pastries`, etc.).
- **El número de columnas** de las rejillas y las proporciones de imagen (4:3, 16:10…) están en CSS, no en el panel.

Cada bloque de primer nivel y cada tarjeta lleva un nombre en el Navigator (`EN · Hero`, `AR · Gallery`, el nombre del producto…) para localizar rápido qué se toca.

## Estrategia por componente

| Componente | Solución | Detalle |
|---|---|---|
| Hero, Features, About, CTA, textos de todas las secciones | **Elementor Free** | Contenedores + Heading + Text Editor + Button + Image. Tipografías, colores, espaciados y responsive (desktop/tablet/móvil) son controles nativos. |
| Tarjetas de producto (4 destacadas + 19 del menú) | **Elementor Free** + CSS | Contenedor con imagen, título, precio, descripción y botón nativos. CSS solo para recorte de imagen, insignia, hover y `line-clamp`. |
| Botones WhatsApp, CTA, indicaciones | **Elementor Free** | Widget Button con enlaces `wa.me` prellenados (igual que `buildWhatsAppUrl`). Íconos Font Awesome incluidos en Elementor. |
| Galería, Testimonios | **Elementor Free** + CSS | Contenedores con imágenes nativas; la rejilla asimétrica de 12 columnas y el degradado van en CSS. Las estrellas son SVG en un widget HTML. No se necesitó plugin. |
| Location (tarjetas, horarios) | **Elementor Free** + HTML | Cuerpos de tarjeta en widget HTML (íconos + filas). |
| Google Maps | **Widget HTML** (iframe) | Mismo `iframe` y filtro `grayscale` que el original. |
| Header | **Contenedor Free + HTML + CSS/JS** | Elementor Free no tiene Theme Builder, Sticky ni Nav Menu. Vive dentro de la página: `position: sticky` por CSS, menú y drawer móvil en HTML, scroll-spy en JS. Botón WhatsApp nativo. |
| Filtro de menú por categoría | **JS** (≈15 líneas) | Cada tarjeta lleva clases `zayt-cat-*`; los botones alternan visibilidad. Idéntico al estado de React. No hace falta Essential Addons ni otro plugin. |
| Formulario de contacto | **HTML + JS (réplica visual)** | Misma validación y estados que `ContactForm.tsx`. **No envía nada**, igual que el original (envío simulado). Para recibir mensajes: instalar *Contact Form 7* o *Fluent Forms*, y reemplazar ese único widget HTML por un widget Shortcode. |
| Footer + newsletter | **Contenedores Free + HTML** | Newsletter simulada como en el original; conectar a un servicio al ir a producción. |
| Botón flotante de WhatsApp | **CSS** (`position: fixed`) + HTML | Elementor Free no tiene posicionamiento fijo para contenedores. |
| Idiomas EN/AR y RTL | **Una página bilingüe + JS + 1 fragmento PHP** (o dos páginas + Polylang) | El árabe está completo. Cada idioma es un conjunto de bloques con `direction` propio; `zayt.js` alterna el idioma y actualiza `<html lang dir>`. `snippet-ar-route.php` hace que `/ar/` exista. Alternativa para SEO real: dos páginas + Polylang. |
| Responsive | **Controles nativos** + CSS | Padding, tamaños, columnas y gaps por breakpoint. Las rejillas de tarjetas usan CSS con los breakpoints exactos de Tailwind (640/768/1024). |

### Qué es CSS/JS
Un único widget HTML al inicio de la página (`zayt-assets`) contiene: enlace a Google Fonts (Playfair Display, Plus Jakarta Sans, Alexandria), el CSS de `zayt.css` (~30 KB) y el JS de `zayt.js` (~7 KB, sin dependencias). Sirve para: cambio de idioma, header sticky, drawer móvil, scroll-spy, filtro, formulario, newsletter, rejillas de columnas, aspect-ratio, hover, botón flotante. En la variante `external-assets` no va en la página sino en `snippet-assets.php`.

### Plugins
Ninguno es obligatorio. Se evaluó Essential Addons (galería filtrable, menú avanzado): no aporta nada que justifique instalarlo aquí (instalado no molesta, pero esta página no usa ninguno de sus widgets). Para pegar los fragmentos PHP hace falta un plugin de fragmentos (p. ej. Code Snippets) o un tema hijo. **Polylang** solo si se opta por el enfoque de dos páginas.

## Correcciones respecto a lo generado por Gemini

Esquema de Elementor:
- `_html_tag` → `html_tag` (si no, todas las secciones eran `div`).
- `align_items` / `justify_content` → `flex_align_items` / `flex_justify_content` (los nombres sin prefijo se ignoran).
- Botones: `hover_background_color` → `button_background_hover_color`, `button_padding` → `text_padding`; `link.is_external` de booleano a `"on"`.
- Posicionamiento: `_position: "custom"` y `_offset_*` no existen; ahora por CSS. El botón flotante estaba como widget en la raíz: ahora va dentro de un contenedor.
- IDs: 32 de 66 elementos no tenían `id`; ahora todos son hex de 7 caracteres, únicos y deterministas.
- Grids: ya no dependen del contenedor Grid (versión-dependiente); se resuelven con CSS.
- Imágenes: rutas `/src/assets/...` → URLs absolutas (temporales y marcadas) + manifiesto.
- Contenido: el original cubría 6 de 12 bloques; ahora están los 12 más el flotante, los 19 productos y todo el árabe.

Valores que no coincidían con el código fuente (el código manda):
- H1 del hero 56 px → **60 px**; padding inferior del hero 112 px → **128 px**.
- Destacados: `zaatar-focaccia` → **`cold-brew-tahini`** (los 4 primeros con `isFeatured`).
- Total de productos 18 → **19**; título "Levantine Botanicals" → "Levantine Botanical Flavors".
- Mensaje de WhatsApp del hero: ahora el exacto de `buildWhatsAppUrl`.
- `#FAF9F6` **no** es un color inventado (corrijo mi auditoría anterior): es el resultado de `stone-50/50` y `stone-50/60` sobre `#FAF7F2`, y se usa tal cual.
- Corrección a mi auditoría anterior: `align_items` no era compatible (ver arriba).

## Desviaciones deliberadas del frontend

- Se **omite** el texto visible "Structured for WordPress & Elementor conversion" del footer (es una nota interna).
- El botón de mapa del footer usaba la dirección en texto como `href`; ahora apunta a `googleMapsDirectionsUrl`.
- Se conservan tal cual (son contenido, no conversión): "Service Hours 07:30 AM – 11:30 PM (Daily)" en Contact, que contradice los horarios de Location; la insignia "Today" fija en sábado–domingo; el enlace genérico `https://instagram.com`.
- Íconos de los botones nativos: Font Awesome (`fa-whatsapp`, flechas) en lugar de Lucide. El resto de los íconos son los mismos SVG de Lucide v0.546.
- El breakpoint `sm` (640 px) de Tailwind no existe en Elementor (tablet ≤1024, móvil ≤767): los valores nativos entre 640–767 px usan los de móvil. Las rejillas por CSS sí respetan 640.

## Qué se verificó y qué no

Verificado:
- `validate.mjs` (4 plantillas): JSON válido, IDs únicos (918 en la bilingüe), IDs de DOM únicos, solo controles de la lista permitida de Elementor Free, ningún widget Pro, sin rutas relativas, clases CSS definidas, cada enlace `#ancla` apunta a un elemento existente, cada `label for` a su campo, todos los bloques con nombre en el Navigator, EN y AR con la misma estructura bloque a bloque. Se comprobó que detecta 5 roturas introducidas a propósito.
- `snippet-*.php`: `php -l` sin errores; `snippet-assets.php` ejecutado con un stub emite CSS, configuración JS y fuentes.
- **Importación real (confirmada por quien lo probó en LocalWP, Elementor Free + Hello):** las plantillas de un solo idioma se importan y se ven con muy alta fidelidad (colores, mapa, estructura). El diseño Canvas hubo que aplicarlo a mano y las imágenes dependen de la URL (ver arriba).
- Tests en navegador de la bilingüe (`test/bilingual.test.mjs`, 26 comprobaciones): cambio de idioma sin recarga, URL `/` ↔ `/ar/`, Atrás/Adelante, entrada directa a `/ar/` sin parpadeo, anclas y scroll-spy por idioma, misma posición de lectura, filtro/drawer/formulario independientes por idioma, vista del editor con ambos idiomas, sin errores JS. Y `test/modular.test.mjs` (34 comprobaciones, ver tabla de modularidad).
- En Chromium, con un **arnés aproximado** (no es Elementor: recrea el DOM y los estilos básicos de los controles usados): alturas de sección frente al frontend original compilado, a 390/820/1440 px y en AR. La página completa queda dentro de ±0,3 % del original; las secciones, dentro de ±12 px. Además: filtro (19→3→4→19), validación y estados del formulario, newsletter, drawer móvil, scroll-spy, header sticky, RTL (espejado de header, hero, botón flotante).

**No verificado: la importación de la plantilla bilingüe ni la ruta `/ar/` en un WordPress real** (el entorno donde se desarrolló no puede descargar WordPress). Lo primero a mirar:
1. Que `html_tag`, `flex_align_items`, `flex_justify_content` y `css_classes` (contenedores) / `_css_classes` (widgets) se apliquen; en los contenedores se emiten ambos nombres de clase por prudencia.
2. Que `icon_align: "right"` coloque el ícono tras el texto (el CSS lo fuerza igualmente).
3. Que el `alt` de cada imagen sobreviva (si no, se completa en la Media Library).
4. Que el tema no recorte el `sticky` del header (algunos temas ponen `overflow` en un contenedor padre).
5. Que `page_settings.template: elementor_canvas` se aplique (en la prueba real con las plantillas de un solo idioma **no** se aplicó: elegir Canvas a mano).
6. `snippet-ar-route.php`: que `/ar/` cargue la página de inicio sin redirigir a `/` (usa `redirect_canonical`), y que no haya ya una página con slug `ar`.
7. En el editor de Elementor: que se vean EN y AR apilados y que los widgets `[HTML]` se rendericen.
8. Fuentes: en el arnés no hay acceso a Google Fonts, así que la tipografía real no se comparó; los saltos de línea pueden variar unos píxeles.
