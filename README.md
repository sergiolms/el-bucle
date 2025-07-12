# El Bucle - Ficha de Personaje

Aplicación PWA (Progressive Web App) para gestionar fichas de personaje del librojuego "El Bucle" con estética cyberpunk.

## Características

- **PWA Instalable**: Funciona como una aplicación nativa en dispositivos móviles y escritorio
- **Offline First**: Funciona sin conexión una vez instalada
- **Persistencia Local**: Los datos se guardan automáticamente en el navegador
- **Diseño Cyberpunk**: Interfaz con estética futurista y neón
- **Responsive**: Adaptada para móviles, tablets y escritorio

## Tecnologías

- **React 18**: Librería de UI
- **Vite**: Build tool y dev server
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utility-first
- **shadcn/ui**: Componentes UI basados en Radix UI
- **vite-plugin-pwa**: Configuración PWA

## Instalación

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo
pnpm dev

# Build de producción
pnpm build

# Preview de producción
pnpm preview
```

## Estructura del Proyecto

```
el-bucle/
├── src/
│   ├── App.tsx           # Componente principal
│   ├── main.tsx          # Punto de entrada
│   ├── index.css         # Estilos globales
│   └── vite-env.d.ts     # Tipos de Vite
├── components/           # Componentes React
│   ├── character-context.tsx  # Estado global
│   ├── character-sheet.tsx    # Componente principal
│   ├── attributes-section.tsx # Sección atributos
│   ├── inventory-section.tsx  # Sección inventario
│   ├── combat-section.tsx     # Sección combate
│   ├── clues-section.tsx      # Sección pistas
│   ├── time-section.tsx       # Sección tiempo
│   ├── notes-section.tsx      # Sección notas
│   └── ui/                    # Componentes UI
├── hooks/                # Custom hooks
├── lib/                  # Utilidades
├── public/               # Assets estáticos
├── index.html           # HTML principal
├── vite.config.ts       # Configuración Vite
└── tailwind.config.ts   # Configuración Tailwind
```

## PWA

La aplicación se puede instalar como PWA en:

- **Android**: Chrome -> Menú -> "Agregar a pantalla de inicio"
- **iOS**: Safari -> Compartir -> "Agregar a pantalla de inicio"
- **Desktop**: Chrome/Edge -> Icono de instalación en la barra de direcciones

## Funcionalidades

1. **Personaje**: Gestión de atributos (Body, Mind, Gesta, Status) y control de tiempo
2. **Equipo**: Inventario de items, armas y pistas
3. **Combate**: Sistema de combate con múltiples enemigos
4. **Notas**: Sistema de investigación con notas estructuradas

Todos los datos se guardan automáticamente en localStorage.