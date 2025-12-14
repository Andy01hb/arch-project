# Documentación del Proyecto: Store de Componentes Autocad

## Descripción General
Esta aplicación es una tienda de comercio electrónico construida con **Next.js 16** diseñada para la venta de recursos digitales para arquitectos e ingenieros (bloques de Autocad, detalles constructivos, etc.).

## Stack Tecnológico
- **Framework**: Next.js 16 (App Router)
- **Librería UI**: React 19
- **Lenguaje**: TypeScript
- **Estilos**: CSS (Vanilla / Inline styles para componentes rápidos)
- **Persistencia de Estado**: LocalStorage (para el carrito de compras)

## Estructura del Proyecto

### Directorios Principales
- **`src/app`**: Contiene las rutas de la aplicación (App Router).
  - `page.tsx`: Página de inicio que muestra el catálogo de productos.
  - `cart/page.tsx`: Página del carrito de compras.
  - `layout.tsx`: Layout principal que envuelve la aplicación (incluye Navbar y Footer).
- **`src/components`**: Componentes reutilizables de UI.
  - `ui/`: Componentes base como botones, tarjetas de producto, etc.
- **`src/context`**: Gestión del estado global.
  - `CartContext.tsx`: Contexto de React que maneja la lógica del carrito (añadir, eliminar, persistir en LocalStorage).
- **`src/lib`**: Utilidades y lógica de negocio.
  - `products.ts`: Funciones para obtener datos de productos (simula una base de datos).
- **`data`**: Datos estáticos.
  - `products.json`: Archivo JSON que actúa como base de datos de productos.

## Flujo de Datos y Funcionalidad

### 1. Carga de Productos
- Los productos se almacenan en `data/products.json`.
- En `src/lib/products.ts`, la función `getProducts()` lee este archivo utilizando `fs` (File System) de Node.js.
- La página principal (`src/app/page.tsx`) es un **Server Component** que obtiene los datos directamente en el servidor antes de renderizar el HTML, lo que mejora el SEO y el rendimiento inicial.

### 2. Carrito de Compras
- El estado del carrito se maneja en el cliente usando `CartContext`.
- **Persistencia**: Al cargar la aplicación, el contexto lee `localStorage` para recuperar items guardados. Cada vez que el carrito cambia, se actualiza `localStorage`.
- **Funciones**:
  - `addToCart`: Añade un producto o incrementa su cantidad.
  - `removeFromCart`: Elimina un producto.
  - `clearCart`: Vacía el carrito.
  - `cartTotal` y `cartCount`: Valores derivados para mostrar el total y la cantidad de items.

### 3. Interfaz de Usuario
- El diseño utiliza un tema oscuro con gradientes modernos.
- Se utilizan componentes modulares como `ProductCard` para mostrar cada ítem del catálogo.
- `AddToCartButton` es un componente de cliente (Client Component) que interactúa con el `CartContext`.

## Comandos Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en `http://localhost:3000`.
- `npm run build`: Construye la aplicación para producción.
- `npm start`: Inicia el servidor de producción.
