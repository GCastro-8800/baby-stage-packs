

# Acelerar la Animación del Marquee

## Resumen
Reducir el tiempo del ciclo de animación del marquee para que las marcas se muevan más rápido.

---

## Cambio a Realizar

### Actualizar `tailwind.config.ts`

Cambiar la duración de la animación de **25 segundos** a **15 segundos**:

```typescript
// Antes
"marquee": "marquee 25s linear infinite",

// Después  
"marquee": "marquee 15s linear infinite",
```

---

## Referencia de Velocidades

| Duración | Sensación |
|----------|-----------|
| 30s | Muy lento, casi estático |
| 25s | Lento, relajado (actual) |
| **15s** | **Moderado-rápido (propuesto)** |
| 10s | Rápido, dinámico |
| 5s | Muy rápido, puede marear |

La velocidad de 15 segundos mantiene la elegancia pero con más dinamismo.

