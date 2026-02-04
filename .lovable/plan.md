

# Banda Horizontal Animada de Logos (Marquee)

## Resumen
Transformar la sección de logos de marcas en un ticker/marquee horizontal que se mueve continuamente de izquierda a derecha, creando un efecto elegante e hipnótico que refuerza la presencia de las marcas premium.

---

## Diseño Visual

```text
┌─────────────────────────────────────────────────────────────────┐
│               Trabajamos con las mejores marcas                 │
├─────────────────────────────────────────────────────────────────┤
│ ←←← BUGABOO · STOKKE · CYBEX · BABYZEN · BUGABOO · STOKKE ←←← │
│     Holanda   Noruega  Alemania Francia   Holanda   Noruega     │
└─────────────────────────────────────────────────────────────────┘
       ↑ Se mueve continuamente hacia la izquierda (loop infinito)
```

### Características
- Movimiento continuo y suave hacia la izquierda
- Loop infinito (se duplican los logos para crear continuidad)
- Pausa al hacer hover (para que el usuario pueda leer)
- Fade en los bordes para un efecto más elegante
- Velocidad moderada (20-25 segundos por ciclo)

---

## Cambios a Realizar

### 1. Actualizar `tailwind.config.ts`
Añadir keyframe y animación para el marquee:
```typescript
keyframes: {
  // ... existentes
  "marquee": {
    from: { transform: "translateX(0)" },
    to: { transform: "translateX(-50%)" },
  },
},
animation: {
  // ... existentes
  "marquee": "marquee 25s linear infinite",
},
```

### 2. Actualizar `BrandLogosSection.tsx`
- Cambiar de grid a contenedor flex con overflow hidden
- Duplicar el array de marcas para crear el loop infinito
- Aplicar la animación marquee al contenedor interno
- Añadir separadores visuales entre marcas (punto medio ·)
- Añadir gradientes en los bordes para efecto fade
- Pausar animación en hover

---

## Detalles Tecnicos

### Estructura del componente
```tsx
// Duplicamos las marcas para el loop infinito
const allBrands = [...brands, ...brands];

<div className="overflow-hidden relative">
  {/* Gradientes fade en los bordes */}
  <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-secondary/30 to-transparent z-10" />
  <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-secondary/30 to-transparent z-10" />
  
  {/* Banda animada */}
  <div className="flex animate-marquee hover:pause gap-12">
    {allBrands.map((brand, index) => (
      <div key={index} className="flex-shrink-0 flex items-center gap-12">
        <div className="flex flex-col items-center">
          <span>{brand.name}</span>
          <span>{brand.origin}</span>
        </div>
        <span className="text-muted-foreground">·</span>
      </div>
    ))}
  </div>
</div>
```

### Estilos clave
- Container: `overflow-hidden relative`
- Banda: `flex animate-marquee whitespace-nowrap`
- Pause en hover: `hover:[animation-play-state:paused]`
- Fade edges: Gradientes absolutos con z-index

### Velocidad
- 25 segundos para un ciclo completo
- `linear` para movimiento constante sin aceleración

---

## Por que este diseño

1. **Dinamismo visual**: El movimiento atrae la atención sin ser intrusivo
2. **Sensacion premium**: Patron comun en webs de marcas de lujo
3. **No requiere interaccion**: Funciona automaticamente
4. **Pausa inteligente**: El hover permite leer con calma

