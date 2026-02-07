
## Plan: Paginas Legales + Correccion del Bug de Onboarding en Desktop

### 1. Correccion del Bug: Onboarding no aparece en Desktop

**Causa raiz identificada:** Hay una condicion de carrera (race condition) en `ProtectedRoute.tsx`. 

El flujo actual es:
1. El usuario se registra/inicia sesion
2. `onAuthStateChange` dispara, `loading` pasa a `false` y `user` se establece
3. El perfil se busca con `setTimeout(() => fetchProfile(...), 0)` (asincrono)
4. `ProtectedRoute` evalua la condicion: `profile && !profile.onboarding_completed`
5. Como `profile` es `null` (aun no ha cargado), la condicion es `false`
6. El usuario ve el dashboard directamente, saltandose el onboarding

**Solucion:** Modificar `ProtectedRoute` para que muestre el estado de carga mientras `profile` sea `null` y el usuario este autenticado. Asi se espera a que el perfil cargue antes de decidir la ruta.

**Archivos a modificar:**
- `src/components/auth/ProtectedRoute.tsx`: Agregar verificacion de `profile === null` cuando hay usuario autenticado, mostrando el spinner de carga hasta que el perfil se resuelva.

---

### 2. Pagina de Politica de Privacidad

Crear una pagina completa con contenido legal en espanol para bebloo, cubriendo:
- Datos que se recopilan (nombre, email, datos del bebe)
- Uso de los datos (personalizacion del servicio)
- Proteccion y almacenamiento
- Derechos del usuario (RGPD: acceso, rectificacion, supresion)
- Contacto para ejercer derechos
- Uso de cookies

**Archivos a crear:**
- `src/pages/PrivacyPolicy.tsx`

---

### 3. Pagina de Condiciones de Servicio

Crear una pagina con terminos y condiciones en espanol, cubriendo:
- Descripcion del servicio (suscripcion de equipamiento para bebes)
- Requisitos de uso y registro
- Suscripcion y pagos
- Cancelacion y devolucion
- Propiedad intelectual
- Limitacion de responsabilidad
- Ley aplicable (Espana)

**Archivos a crear:**
- `src/pages/TermsOfService.tsx`

---

### 4. Integracion de las Nuevas Paginas

| Archivo | Cambio |
|---------|--------|
| `src/App.tsx` | Agregar rutas `/privacidad` y `/condiciones` |
| `src/components/Footer.tsx` | Actualizar los enlaces del footer para apuntar a las nuevas rutas usando `Link` de react-router-dom |
| `src/pages/Auth.tsx` | Actualizar el texto legal del pie para enlazar a las nuevas paginas |

---

### Resumen de Cambios

| Paso | Archivo | Accion |
|------|---------|--------|
| 1 | `src/components/auth/ProtectedRoute.tsx` | Corregir race condition: mostrar spinner si `user` existe pero `profile` es null |
| 2 | `src/pages/PrivacyPolicy.tsx` | Crear pagina con politica de privacidad |
| 3 | `src/pages/TermsOfService.tsx` | Crear pagina con condiciones de servicio |
| 4 | `src/App.tsx` | Registrar las 2 nuevas rutas |
| 5 | `src/components/Footer.tsx` | Actualizar enlaces a `/privacidad` y `/condiciones` |
| 6 | `src/pages/Auth.tsx` | Enlazar texto legal a las nuevas paginas |

No se requieren cambios en la base de datos.
