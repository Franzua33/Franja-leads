# Franja Leads — Extractor de Negocios B2B

Plataforma web construida con **React**, **TypeScript**, **Vite**, **Tailwind CSS**, **Supabase Auth** y diseñada para integrarse con **n8n** y **Mercado Pago**.

---

## ⚠️ ¿Por qué no se puede abrir `index.html` directamente con doble clic?

Si haces doble clic sobre el archivo `index.html` (abriendo una ruta como `file:///C:/.../index.html`), el navegador mostrará una **pantalla en blanco**. Esto ocurre por dos razones fundamentales de arquitectura web moderna:

1. **Es una aplicación React con TypeScript (`.tsx`):** `index.html` contiene `<script type="module" src="/src/main.tsx"></script>`. Los navegadores solo entienden JavaScript estándar, no código TypeScript ni sintaxis JSX directamente. Vite se encarga de compilar y transformar ese código en tiempo real.
2. **Restricción de seguridad CORS del navegador:** Los navegadores web bloquean la carga de módulos JavaScript (`type="module"`) bajo el protocolo local `file://`. Se requiere un servidor local (`http://localhost:...`).

---

## 🚀 Pasos para ejecutar la aplicación en tu computadora

### 1. Requisitos Previos
Debes tener instalado **Node.js** (versión 18, 20 o superior).
- Si no lo tienes, descárgalo e instálalo desde [nodejs.org](https://nodejs.org/).
- Puedes comprobar si está instalado abriendo tu terminal (PowerShell, CMD o Terminal de macOS/Linux) y escribiendo:
  ```bash
  node -v
  npm -v
  ```

---

### 2. Abrir la terminal en la carpeta del proyecto
Abre la terminal en la carpeta raíz donde clonaste el proyecto.

---

### 3. Instalar las dependencias
Ejecuta el siguiente comando para descargar e instalar todas las librerías necesarias:
```bash
npm install
```

> **Nota:** Si tu versión de npm muestra un error de conflicto de dependencias (`ERESOLVE could not resolve peer dependency`), ejecuta:
> ```bash
> npm install --legacy-peer-deps
> ```
*(Esto creará la carpeta `node_modules` con React, Supabase, Tailwind, iconos Lucide, etc.)*

---

### 4. Configurar las variables de entorno
Crea tu archivo `.env` a partir de la plantilla:

- **En Windows (PowerShell):**
  ```powershell
  Copy-Item .env.example .env
  ```
- **En Windows (CMD):**
  ```cmd
  copy .env.example .env
  ```
- **En Mac o Linux:**
  ```bash
  cp .env.example .env
  ```

*(Puedes abrir el archivo `.env` con cualquier editor de texto para configurar tu URL de Supabase y los webhooks de n8n cuando los tengas listos).*

---

### 5. Iniciar el servidor local de desarrollo
Ejecuta:
```bash
npm run dev
```

Verás una salida similar a esta:
```bash
  VITE v8.3.0  ready in 250 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
```

---

### 6. Abrir la aplicación en Chrome
Abre tu navegador Google Chrome y escribe en la barra de direcciones:
```
http://localhost:3000
```

¡Listo! Verás la aplicación de **Franja Leads** funcionando con todas sus funciones interactivas, cambio de idioma, selector de países, vistas de historial y modal de planes.

---

## 📦 Compilar para producción (Opcional)

Si deseas generar los archivos estáticos optimizados (`HTML`, `JS`, `CSS` compilados):
```bash
npm run build
```
Los archivos finales se generarán en la carpeta `/dist`.
Para previsualizarlos localmente con un servidor web:
```bash
npm run preview
```
