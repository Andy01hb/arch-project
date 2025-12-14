# Guía de Configuración de Seguridad

Para que las funcionalidades de seguridad e infraestructura funcionen, debes configurar las siguientes variables de entorno.

## 1. Clerk (Autenticación)

1.  Ve a [Clerk Dashboard](https://dashboard.clerk.com/).
2.  Crea una nueva aplicación.
3.  Copia las claves API y pégalas en `store/.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## 2. UploadThing (Imágenes Públicas)

1.  Ve a [UploadThing Dashboard](https://uploadthing.com/).
2.  Crea una nueva app.
3.  Copia las claves y pégalas en `store/.env.local`:

```env
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...
```

## 3. AWS S3 (Archivos Privados)

1.  Ve a AWS Console -> IAM -> Users.
2.  Crea un usuario con acceso programático y permisos S3 (AmazonS3FullAccess o más restrictivo).
3.  Copia las credenciales y pégalas en `backend/.env`:

```env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_BUCKET_NAME=nombre-de-tu-bucket-privado
```

## 4. Verificación

Una vez configuradas las variables:
1.  Reinicia ambos servidores (`npm run dev`).
2.  Intenta acceder a `/admin` -> Debería pedir login.
3.  Intenta subir una imagen en Admin -> Debería funcionar.
4.  Intenta descargar un archivo (simulado) -> Debería generar un link de S3.
