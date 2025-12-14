# E-commerce de Componentes Autocad - ArchStore

## 🎯 Descripción

Plataforma de comercio electrónico especializada en la venta de componentes dinámicos de Autocad (bloques, plantillas, detalles constructivos). Los usuarios pueden explorar el catálogo, añadir productos al carrito y realizar pagos seguros mediante PayPal.

## 🚀 Características

- ✅ **Catálogo de Productos**: Navegación y filtrado de componentes de Autocad
- ✅ **Carrito de Compras**: Sistema de carrito con persistencia en LocalStorage
- ✅ **Checkout con PayPal**: Integración completa con PayPal para pagos seguros
- ✅ **Panel de Administración**: CRUD de productos (agregar, editar, eliminar)
- ✅ **Diseño Moderno**: UI premium con glassmorphism y animaciones suaves
- ✅ **Responsive**: Optimizado para desktop y móvil

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: CSS Modules (Vanilla CSS)
- **Pagos**: PayPal SDK (@paypal/react-paypal-js)
- **Base de Datos**: JSON local (simulación)

## 📁 Estructura del Proyecto

```
store/
├── src/
│   ├── app/                    # Rutas de Next.js
│   │   ├── page.tsx           # Landing page
│   │   ├── products/[id]/     # Detalle de producto
│   │   ├── cart/              # Carrito de compras
│   │   ├── checkout/          # Proceso de pago
│   │   ├── admin/             # Panel de administración
│   │   └── api/products/      # API endpoints
│   ├── components/
│   │   ├── ui/                # Componentes UI reutilizables
│   │   ├── layout/            # Navbar, Footer
│   │   └── checkout/          # Componentes de pago
│   ├── context/
│   │   └── CartContext.tsx    # Estado global del carrito
│   └── lib/
│       └── products.ts        # Utilidades de productos
├── data/
│   └── products.json          # Base de datos local
└── public/                    # Assets estáticos
```

## 🏃 Cómo Ejecutar

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

### Producción

```bash
npm run build
npm start
```

## 🔑 Configuración de PayPal

Para usar PayPal en producción:

1. Crea una cuenta en [PayPal Developer](https://developer.paypal.com/)
2. Obtén tu `Client ID` desde el dashboard
3. Reemplaza `"test"` en `src/components/checkout/PayPalCheckoutButton.tsx`:

```tsx
const initialOptions = {
  clientId: "TU_CLIENT_ID_AQUI", // Reemplazar
  currency: "USD",
  intent: "capture",
};
```

## 📝 Gestión de Productos

### Acceder al Panel de Admin

Navega a `/admin` para gestionar productos.

### Estructura de un Producto

```json
{
  "id": "1",
  "name": "Bloque Dinámico: Puerta Residencial",
  "description": "Descripción del producto",
  "price": 4.99,
  "category": "Arquitectura",
  "image": "/images/preview.jpg",
  "fileUrl": "protected/file.dwg"
}
```

## 🎨 Personalización

### Colores

Edita las variables CSS en `src/app/globals.css`:

```css
:root {
  --background: #0a0a0a;
  --primary: #3b82f6;
  --accent: #10b981;
  /* ... más variables */
}
```

## 📦 Próximas Características

- [ ] Autenticación de usuarios (NextAuth.js)
- [ ] Base de datos real (PostgreSQL/MongoDB)
- [ ] Sistema de envío de emails
- [ ] Descarga segura de archivos
- [ ] Panel de ventas y analytics
- [ ] Búsqueda y filtros avanzados

## 🤝 Contribuir

Este es un proyecto de demostración. Para producción, considera:

1. Implementar autenticación real
2. Migrar a una base de datos robusta
3. Configurar almacenamiento seguro de archivos (AWS S3)
4. Implementar sistema de emails transaccionales
5. Añadir tests unitarios y de integración

## 📄 Licencia

MIT License - Proyecto de demostración educativa

---

**Desarrollado con ❤️ usando Next.js y TypeScript**
