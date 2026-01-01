# Resumen: Conexion a Servicios Cloud desde Terminal

## ✅ CLIs Instalados

He instalado los siguientes CLIs en tu sistema:

1. **Vercel CLI** (v50.1.3)
   - Comando: `vercel`
   - Estado: Instalado ✅
   - Autenticacion: Pendiente (requiere login)

2. **Neon CLI** (neonctl)
   - Comando: `neonctl`
   - Estado: Instalado ✅
   - Autenticacion: Pendiente (requiere API key)

3. **Render**
   - CLI Oficial: ❌ No existe
   - Alternativa: API REST (requiere API key manual)

---

## 🚀 Script Interactivo Creado

He creado un script completo que te guiara paso a paso:

**Archivo:** `setup-cloud-services.ps1`

### Que hace el script:

1. **Autenticacion en Vercel**
   - Te guia para hacer login via navegador
   - Verifica tu identidad
   - Lista tus proyectos existentes

2. **Verificacion de Proyecto en Vercel**
   - Busca si 'arch-project' ya esta desplegado
   - Opcion de desplegar si no existe

3. **Autenticacion en Neon**
   - Te pide tu API Key de Neon
   - Autentica el CLI
   - Verifica la conexion

4. **Gestion de Base de Datos Neon**
   - Lista tus proyectos en Neon
   - Opcion de crear nuevo proyecto
   - Obtiene el Connection String

5. **Aplicar Schema**
   - Opcion de aplicar `arch_project_dump.sql` automaticamente
   - Usa `psql` si esta disponible
   - Instrucciones manuales si no

6. **Configuracion de Render**
   - Instrucciones paso a paso (manual)
   - Te da el connection string para copiar
   - Te guia a donde pegarlo

7. **Verificacion Final**
   - Ejecuta el diagnostico automaticamente
   - Muestra el estado de todos los servicios

---

## 📋 Como Usar

### Opcion 1: Script Automatico (Recomendado)

```powershell
# Ejecutar el script interactivo
.\setup-cloud-services.ps1
```

El script te ira guiando paso a paso. Solo necesitas:
- Tu cuenta de Vercel (para login)
- Tu API Key de Neon (de https://console.neon.tech/app/settings/api-keys)
- Acceso a Render Dashboard (para configurar DATABASE_URL manualmente)

### Opcion 2: Comandos Manuales

Si prefieres hacerlo paso a paso manualmente:

#### 1. Autenticarse en Vercel
```powershell
vercel login
# Se abrira el navegador, inicia sesion
```

#### 2. Ver proyectos en Vercel
```powershell
vercel list
```

#### 3. Desplegar frontend (si no existe)
```powershell
cd store
vercel --prod
cd ..
```

#### 4. Autenticarse en Neon
```powershell
# Primero obtener API Key de: https://console.neon.tech/app/settings/api-keys
neonctl auth
# Pegar el API Key cuando lo pida
```

#### 5. Ver proyectos en Neon
```powershell
neonctl projects list
```

#### 6. Obtener Connection String
```powershell
# Reemplaza PROJECT_ID con tu ID real
neonctl connection-string --project-id PROJECT_ID
```

#### 7. Aplicar Schema (si tienes psql)
```powershell
# Reemplaza CONNECTION_STRING con el obtenido arriba
psql "CONNECTION_STRING" -f arch_project_dump.sql
```

#### 8. Configurar Render
- Ve a: https://dashboard.render.com
- Selecciona tu servicio backend
- Environment → Add Environment Variable
- Key: `DATABASE_URL`
- Value: [Pega el connection string de Neon]
- Save Changes

#### 9. Verificar
```powershell
.\diagnose-deployment.ps1
```

---

## 🔑 Informacion Necesaria

Para completar la configuracion, necesitaras:

### Vercel
- ✅ Ya instalado
- 🔐 Login via navegador (OAuth)
- 📧 Tu cuenta de Vercel

### Neon
- ✅ Ya instalado
- 🔑 API Key de Neon
  - Obtener en: https://console.neon.tech/app/settings/api-keys
  - Click "Generate new API key"
  - Copiar y guardar (solo se muestra una vez)

### Render
- ❌ No tiene CLI oficial
- 🌐 Configuracion manual via Dashboard
- 🔗 URL: https://dashboard.render.com
- 📝 Necesitas copiar el DATABASE_URL de Neon

---

## ⚠️ Limitaciones de Render

Render **NO tiene CLI oficial**, por lo que:

- ✅ Puedo verificar el estado (via HTTP requests)
- ✅ Puedo probar los endpoints
- ❌ No puedo configurar variables de entorno automaticamente
- ❌ No puedo hacer redeploy desde terminal

**Solucion:** El script te dara instrucciones claras de que hacer manualmente en el Dashboard de Render.

---

## 🎯 Siguiente Paso Recomendado

Ejecuta el script interactivo:

```powershell
.\setup-cloud-services.ps1
```

El script:
1. Te guiara paso a paso
2. Hara todo lo automatizable
3. Te dara instrucciones claras para lo manual
4. Verificara que todo funcione al final

---

## 📞 Comandos de Ayuda

Si necesitas ayuda con algun CLI:

```powershell
# Vercel
vercel --help
vercel list --help
vercel env --help

# Neon
neonctl --help
neonctl projects --help
neonctl connection-string --help
```

---

**Creado:** 31 de Diciembre, 2025  
**Autor:** Antigravity AI Assistant
