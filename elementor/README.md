# Zayt Café → Elementor Free

Primera versión importable de la página completa (EN + AR) para **Elementor Free**, sin Elementor Pro y sin plugins obligatorios.

```
src/ (React, fuente de verdad) ──► tools/elementor/build.mjs ──► elementor/templates/zayt-home-{en,ar}.json
```

| Archivo | Qué es |
|---|---|
| `templates/zayt-home-en.json`, `templates/zayt-home-ar.json` | Plantillas de página de Elementor (importables). |
| `templates/media-manifest.json` | Las 5 imágenes a subir a la Media Library, con medidas y clave de mapeo. |
| `../tools/elementor/build.mjs` | Generador. Lee `src/data/content.ts` directamente; los textos de UI sueltos en los `.tsx` están transcritos en el propio script (EN/AR lado a lado). |
| `../tools/elementor/lib.mjs` | Constructores con los nombres de control reales de Elementor. |
| `../tools/elementor/zayt.css`, `zayt.js` | CSS/JS que se incrustan en la página (ver "Qué es CSS/JS"). |
| `../tools/elementor/validate.mjs` | Validador estático del JSON generado. |
| `gemini-original/` | Los dos JSON de Google AI Studio, sin tocar, solo como referencia. |

```bash
node tools/elementor/build.mjs                       # regenera elementor/templates
node tools/elementor/validate.mjs                    # valida
node tools/elementor/build.mjs --media-map media.json --lang-urls en=/,ar=/ar/
```

## Cómo importarlo en un WordPress limpio

1. Tema **Hello Elementor** (o cualquiera) + plugin **Elementor** (Free, versión reciente con Contenedores Flexbox activos, que es el valor por defecto actual).
2. *Templates → Saved Templates → Import Templates* → subir `zayt-home-en.json` y `zayt-home-ar.json`.
3. *Pages → Add New*, editar con Elementor, insertar la plantilla importada. La plantilla pide el diseño **Elementor Canvas** (sin cabecera/pie del tema); si el importador no lo aplica, elegirlo en *Page Settings → Layout*.
4. Crear dos páginas (una por idioma). Con Polylang/TranslatePress se enlazan como traducciones; el selector EN/AR ya apunta a `/` y `/ar/` (cambiar con `--lang-urls`).

### Imágenes (sin `/src/assets/...`)

Todas las imágenes son URLs absolutas. Por defecto apuntan a una **URL temporal**: `https://raw.githubusercontent.com/yamilheredia7970-cmd/Zayt-Caf-/main/src/assets/images/…`. Si el repo es público, el importador de Elementor las descarga solas a la Media Library. Si no puede descargarlas, Elementor pone su imagen de relleno.

Opciones, de más a menos cómoda:
- `--image-base-url https://tu-sitio/wp-content/uploads/zayt/` tras subir los 5 archivos por FTP.
- Subir los 5 archivos a la Media Library y regenerar con `--media-map`: `{"heroInterior":{"url":"https://…/x.jpg","id":123}, …}` (claves en `media-manifest.json`).

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
| Idiomas EN/AR y RTL | **Dos páginas + (opcional) Polylang** | El árabe está completo. La página AR lleva `direction: rtl` y un script que fija `<html dir=rtl lang=ar>`. Con Polylang/TranslatePress en idioma RTL, WordPress lo hace nativamente y el script es redundante. |
| Responsive | **Controles nativos** + CSS | Padding, tamaños, columnas y gaps por breakpoint. Las rejillas de tarjetas usan CSS con los breakpoints exactos de Tailwind (640/768/1024). |

### Qué es CSS/JS
Un único widget HTML al inicio de la página (`zayt-assets`) contiene: enlace a Google Fonts (Playfair Display, Plus Jakarta Sans, Alexandria), el CSS de `zayt.css` (~25 KB) y el JS de `zayt.js` (~5 KB, sin dependencias). Sirve para: header sticky, drawer móvil, scroll-spy, filtro, formulario, newsletter, rejillas, aspect-ratio, hover, botón flotante.

### Plugins
Ninguno es obligatorio. Se evaluó Essential Addons (galería filtrable, menú avanzado): no aporta nada que justifique instalarlo aquí. **Polylang** (gratuito) es lo único recomendable, y solo para vincular las dos páginas; el selector funciona igual sin él.

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
- `validate.mjs`: JSON válido, 460 elementos con IDs únicos, solo controles de la lista permitida de Elementor Free, ningún widget Pro, sin rutas relativas, clases CSS definidas, estructura EN = AR.
- En Chromium, con un **arnés aproximado** (no es Elementor: recrea el DOM y los estilos básicos de los controles usados): alturas de sección frente al frontend original compilado, a 390/820/1440 px y en AR. La página completa queda dentro de ±0,3 % del original; las secciones, dentro de ±12 px. Además: filtro (19→3→4→19), validación y estados del formulario, newsletter, drawer móvil, scroll-spy, header sticky, RTL (espejado de header, hero, botón flotante).

**No verificado: la importación real en WordPress.** Lo primero a mirar al importar:
1. Que `html_tag`, `flex_align_items`, `flex_justify_content` y `css_classes` (contenedores) / `_css_classes` (widgets) se apliquen; en los contenedores se emiten ambos nombres de clase por prudencia.
2. Que `icon_align: "right"` coloque el ícono tras el texto (el CSS lo fuerza igualmente).
3. Que el `alt` de cada imagen sobreviva (si no, se completa en la Media Library).
4. Que el tema no recorte el `sticky` del header (algunos temas ponen `overflow` en un contenedor padre).
5. Que `page_settings.template: elementor_canvas` se aplique.
6. Fuentes: en el arnés no hay acceso a Google Fonts, así que la tipografía real no se comparó; los saltos de línea pueden variar unos píxeles.
