

## Mejorar el flujo de seleccion de plan: contacto directo + detalle de equipamiento

### Resumen

Cuando un usuario selecciona un plan, en lugar de ir directamente al formulario de email, se le mostrara una nueva pagina dedicada al plan elegido. Esta pagina tendra:

1. El detalle completo del plan con las marcas y modelos concretos del equipamiento
2. Opciones claras de contacto: WhatsApp y Calendly para hablar con alguien antes de decidir
3. El formulario de captura de email (el actual) como opcion alternativa

### Flujo propuesto

```text
Landing (seccion precios)
  |
  v
Click "Seleccionar Comfort"
  |
  v
Nueva pagina /plan/comfort
  |
  +-- Detalle del equipamiento (marcas/modelos con fotos)
  +-- Boton WhatsApp ("Habla con nosotros")
  +-- Boton Calendly ("Reserva una llamada")
  +-- Formulario email ("Avisame cuando llegueis a mi zona")
```

### Que vera el usuario en la pagina de detalle del plan

**Cabecera**: Nombre del plan, precio, descripcion y garantia.

**Seccion "Tu equipamiento"**: Una cuadricula con cada categoria de producto mostrando:
- Nombre de la categoria (ej: "Carrito completo")
- 2-3 opciones de marca/modelo (ej: Bugaboo Fox 5, Cybex Priam, Stokke Xplory)
- Nota: "El equipo de Bebloo te ayudara a elegir la mejor opcion para ti"

**Seccion "Siguientes pasos"**: Tres tarjetas de accion:
1. WhatsApp: enlace directo a chat con mensaje prellenado ("Hola, me interesa el plan X...")
2. Calendly: enlace embebido o boton que abre Calendly en nueva pestana
3. Email: formulario simplificado para dejar email (reutilizando la logica actual de leads)

### Detalle tecnico

**Archivos nuevos:**

- `src/pages/PlanDetail.tsx` - Pagina de detalle del plan con tres secciones: info del plan, equipamiento con marcas/modelos, y acciones de contacto (WhatsApp, Calendly, email)
- `src/data/planEquipment.ts` - Datos estaticos con las marcas y modelos disponibles por categoria y plan. Estructura:

```text
{
  category: "Carrito completo",
  options: [
    { brand: "Bugaboo", model: "Fox 5", image: "/placeholder.svg" },
    { brand: "Cybex", model: "Priam", image: "/placeholder.svg" },
  ]
}
```

**Archivos modificados:**

- `src/App.tsx` - Anadir ruta `/plan/:planId` que renderiza PlanDetail
- `src/components/PricingSection.tsx` - Cambiar el onClick de los botones para navegar a `/plan/comfort` (etc.) en vez de abrir el modal de email directamente
- `src/components/FloatingCTA.tsx` - Actualizar el precio mostrado de 89 a 59 euros (precio actual del plan Start)

**Sin cambios en:**
- `src/components/EmailCaptureModal.tsx` - Se mantiene como componente reutilizable, se usara dentro de PlanDetail
- Base de datos - La tabla `leads` ya soporta todo lo necesario

### Sobre WhatsApp y Calendly

Necesitare que me proporciones:
- Tu enlace de Calendly (ej: `https://calendly.com/tu-usuario/consulta-bebloo`)
- Tu numero de WhatsApp con codigo de pais (ej: `34612345678`)

Los integrare como enlaces directos (no requieren SDK ni API keys):
- WhatsApp: `https://wa.me/NUMERO?text=Hola,%20me%20interesa%20BEBLOO%20PLAN`
- Calendly: enlace directo que abre en nueva pestana

### Imagenes del equipamiento

Inicialmente usare imagenes placeholder. Podras subir las fotos reales de cada marca/modelo mas adelante y se actualizaran facilmente en el archivo de datos.

### Tracking/Analytics

Se anadiran nuevos eventos al sistema de analiticas existente:
- `plan_detail_view` - cuando alguien entra a la pagina de detalle
- `contact_click` - con tipo "whatsapp" o "calendly"

