# CRUD de Autores - Parcial Ciclo 1

Aplicación web en Next.js que implementa un CRUD completo de autores con buscador dinámico y pruebas unitarias.

## Requisitos Previos

- Node.js 18+
- Docker (para ejecutar el API backend)

## Instalación y Ejecución

### 1. Preparar el Backend

```bash
# Clonar y hacer build de la imagen Docker
docker build https://github.com/isis3710-uniandes/bookstore-back.git -t bookstore

# Ejecutar el contenedor
docker run -d -p 127.0.0.1:8080:8080 bookstore

# Verificar que el API esté corriendo
curl http://127.0.0.1:8080/api/authors
```

### 2. Instalar Dependencias del Frontend

```bash
cd preparcial
npm install
```

### 3. Ejecutar la Aplicación en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Ejecutar Pruebas

```bash

    npm.cmd install

    npm.cmd install -D jest-environment-jsdom

    npm.cmd test

```

## Reporte de Cambios Técnicos

### Persistencia de Datos Entre Rutas

Se implementó un Context API (`AutoresProvider.js`) que centraliza todo el estado global de autores:

- Estado Global: Los autores se almacenan en el contexto, no en componentes individuales
- Funciones Compartidas: `agregarAutor()`, `editarAutor()`, `eliminarAutor()`
- Hook Custom: `useAutores()` permite acceder al estado desde cualquier componente
- Resultado: Al navegar entre `/authors`, `/crear` y `/editar`, los datos persisten sin necesidad de refetch

```javascript
// Estructura del Provider
<AutoresProvider>
  <nav>Navegación compartida</nav>
  {children}  // Cualquier ruta que use useAutores() tendrá acceso
</AutoresProvider>
```

### Buscador Dinámico (Case-Insensitive)

Se agregó un filtro en tiempo real sin estado adicional:

```javascript
// En lugar de un segundo estado, filtramos directamente en el render
const autoresFiltrados = autores.filter((autor) =>
  autor.name.toLowerCase().includes(filtro.toLowerCase())
);
```

Características:
- Ignora mayúsculas/minúsculas
- Se actualiza instantáneamente al escribir
- Muestra mensaje "No se encontraron autores" cuando no hay coincidencias
- Recupera la lista completa al limpiar el input

### Validación y Accesibilidad del Formulario

El componente `CrearUsuario` ahora incluye:

- Validación exhaustiva: Verifica cada campo y muestra errores específicos
- Botón condicional: Solo habilitado cuando todos los campos son válidos
- Labels asociados: Cada input tiene un `htmlFor` vinculado a su `id`
- ARIA roles: Usa `role="alert"` para mensajes de error
- Limpieza automática: Borra formulario después de crear

## Estructura del Proyecto

```
src/app/
├── AutoresProvider.js       # Context API para estado global
├── layout.js                # Layout principal con navegación
├── page.js                  # Home (redirección a /authors)
├── authors/
│   └── page.js              # Lista con filtro dinámico
├── crear/
│   ├── page.js              # Formulario de creación
│   └── page.test.js         # Tests unitarios
└── editar/[id]/
    └── page.js              # Formulario de edición
```

## Pruebas Unitarias

Se implementaron 3 tests siguiendo estándares de accesibilidad:

### A. Renderizado Inicial
- Localiza campos usando `getByLabelText()` (selector de accesibilidad)
- Verifica que el botón inicia deshabilitado

### B. Uso Incorrecto
- Simula llenar solo parcialmente el formulario
- Verifica que aparecen mensajes de error específicos
- Confirma que el botón permanece deshabilitado

### C. Uso Correcto
- Llena todos los campos correctamente
- Verifica que el botón se habilita
- Confirma que no hay mensajes de error

**Ejecución de tests**:
```bash
npm test -- crear/page.test.js
```

## Funcionalidades Completadas

- Listar autores con datos del API  
-  Crear nuevos autores  
-  Editar autores existentes  
-  Eliminar autores con confirmación  
-  Navegación entre rutas (persistencia de estado)  
-  Buscador dinámico case-insensitive  
-  Validación de formulario con botón condicional  
-  Accesibilidad (labels, ARIA, selectores semánticos)  
-  Suite de pruebas unitarias con Jest y React Testing Library

## Notas Adicionales

- El API backend debe estar corriendo en `http://127.0.0.1:8080`
- Los IDs de nuevos autores se generan automáticamente
- El filtro es case-insensitive y se actualiza en tiempo real
- Todas las pruebas usan `user-event` para simular interacciones realistas

