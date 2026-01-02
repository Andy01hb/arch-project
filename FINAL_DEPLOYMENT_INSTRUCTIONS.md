# 🚀 GUÍA FINAL DE DESPLIEGUE - Arch Project

¡Felicidades! Los agentes de IA han completado el 90% del trabajo. Ahora solo necesitas conectar los cables finales.

## ✅ Lo Que Ya Está Hecho
- **Backend:** Configurado, seguro, con CORS arreglado y servicio de email listo.
- **Frontend:** Páginas de Catálogo, Nosotros y Descargas creadas. Imágenes configuradas.
- **Base de Datos:** Conectada y funcionando.

## 🛠️ TUS TAREAS MANUALES (OBLIGATORIAS)

Para que todo funcione, sigue estos 4 pasos exactos:

### 1. Configurar CLERK (Autenticación)
1. Ve a [Clerk Dashboard](https://dashboard.clerk.com)
2. Selecciona tu aplicación
3. Ve a **Configure** -> **Domains**
4. Agrega tu dominio de Vercel (ej: `arch-project.vercel.app`)
5. Ve a **API Keys** y copia las claves de **Production**
6. Ve a Vercel -> Settings -> Env Vars y actualiza:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### 2. Configurar STRIPE (Pagos)
1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Crea un **Webhook Endpoint**:
   - URL: `https://arch-backend-90c5.onrender.com/api/payment/webhook`
   - Eventos: `payment_intent.succeeded`
3. Copia el **Signing Secret** (empieza con `whsec_`)
4. Ve a Render -> Environment y agrega `STRIPE_WEBHOOK_SECRET`

### 3. Configurar EMAIL (Opcional pero recomendado)
Si quieres que lleguen correos reales:
1. Usa un servicio como Gmail (App Password) o Resend
2. Ve a Render -> Environment y agrega:
   - `EMAIL_HOST`: smtp.gmail.com
   - `EMAIL_USER`: tu-email@gmail.com
   - `EMAIL_PASS`: tu-app-password
   - `EMAIL_SECURE`: true

### 4. Último Redeploy
1. En **Vercel**: Ve a Deployments -> Redeploy (para que tome las nuevas variables)
2. En **Render**: Ya debería haberse actualizado, pero puedes hacer Manual Deploy si quieres asegurar.

---

## 🔍 CÓMO PROBAR TODO

1. Abre tu web en Vercel
2. Verifica que carguen los productos en el Catálogo (si no cargan, revisa la consola del navegador por errores de CORS)
3. Intenta iniciar sesión (debe salir sin "Development Mode")
4. Haz una compra de prueba (¡Usa tarjetas de prueba de Stripe!)
5. Verifica que llegues a la página de Descarga

¡Eso es todo! Tu proyecto está listo para producción. 🚀
