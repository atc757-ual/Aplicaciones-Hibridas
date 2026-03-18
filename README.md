# 📱 Aplicaciones Híbridas - Proyecto Angular + Ionic

Repositorio de prácticas de la asignatura **Aplicaciones Híbridas**, desarrollado con **Ionic + Angular**.

---

## 📂 Estructura del proyecto

```bash
Aplicaciones-Hibridas/
│
├── Actividad_1_AlexCesarTaquilaCamasca/   # Proyecto frontend Ionic + Angular
├── Actividad_2_AlexCesarTaquilaCamasca/   # Otro proyecto frontend
└── README.md
```

---

## 🚀 Tecnologías utilizadas

* ⚡ Ionic Framework
* 🅰️ Angular
* HTML, CSS, TypeScript
* Node.js / npm

---

## ⚙️ Funcionalidades principales

* 🔍 Pantallas de películas / contenido
* ➕ Buscador con `ion-searchbar`
* 📄 Listados de items con `ion-list` e `ion-item`
* 🎨 Estilos responsive para móviles
* 💡 Uso de componentes Ionic (`ion-card`, `ion-thumbnail`, etc.)

---

## 🛠️ Instalación y ejecución

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/atc757-ual/Aplicaciones-Hibridas.git
cd Aplicaciones-Hibridas
```

---

### 2️⃣ Frontend

Para cada proyecto, por ejemplo **Actividad 1**:

```bash
cd Actividad_1_AlexCesarTaquilaCamasca
npm install
ionic serve
```

✅ La app estará disponible en: http://localhost:8100

---

### 3️⃣ Recomendaciones

* No subir `node_modules` (ya está en `.gitignore`)
* Usar un navegador moderno para probar la app
* `npm install` es obligatorio antes de ejecutar

---

## 🎨 Arquitectura del proyecto

```
Frontend (Ionic + Angular)
├─ Pages / Components
├─ Services
├─ Models
├─ Assets (imágenes, iconos)
└─ Styles / SCSS
```

* **Pages** → Cada pantalla de la app
* **Services** → Manejo de datos (API o locales)
* **Models** → Tipos y estructuras de datos
* **Assets** → Imágenes y recursos
* **Styles** → SCSS global y por componente

---

## 👨‍💻 Autor

Alex Cesar Taquila Camasca

---

## 📌 Estado del proyecto

🟢 En desarrollo / prácticas académicas

---

## ⚠️ Notas importantes

* Ejecutar siempre `npm install` antes de correr la app
* No subir dependencias (`node_modules`)
* El proyecto es **solo frontend**, no incluye backend
