

## Plan: Actualizar catálogo con imágenes reales y textos del Excel

### Resumen
Copiar las 10 imágenes de producto al proyecto, actualizar `productCatalog.ts` con descripciones enriquecidas basadas en los datos técnicos del Excel, corregir el ID de YOYO2 a YOYO3, y actualizar las marcas de Moisés/Cambiador.

### Imágenes recibidas (10 de 17)

| Imagen subida | Producto en catálogo |
|---|---|
| Baby_Björn_BlissBalance_1.png | babybjorn-bliss |
| BabyBjörn_Balance_Soft_1.png | babybjorn-balance-soft |
| BabyBjörn_Harmony_1.png | babybjorn-harmony |
| Boba_Wrap_1.png | boba-wrap |
| Bugaboo_Giraffe_tronaalta_chair_2.png | trona-bugaboo-giraffe |
| Cambiador_Miembre_1.png | cambiador |
| Ergobaby_omni_1.png | ergobaby-omni |
| Foto_Babyzen_YOYO3_1.png | babyzen-yoyo3 (renombrar de yoyo2) |
| Foto_Bugaboo_Donkey_3_1.png | bugaboo-donkey-3 |
| Foto_Bugaboo_Dragonfly_1.png | bugaboo-dragonfly |

**Faltan 7 imágenes**: Bugaboo Fox 3, Joolz Aer 2, Stokke Sleepi Mini, Moisés mimbre, Bugaboo Giraffe hamaca, Nuna LEAF Grow, Stokke Tripp Trapp. Los productos sin imagen seguirán mostrando el placeholder por categoría.

### Cambios en `src/data/productCatalog.ts`

1. **YOYO2 → YOYO3**: id `babyzen-yoyo2` → `babyzen-yoyo3`, nombre actualizado
2. **Marcas**: Moisés y Cambiador de "Bebloo" → "Artesanal"
3. **Descripciones reescritas** con datos técnicos del Excel (peso, materiales, certificaciones, dimensión clave)
4. **`shortReason`** ajustado donde proceda
5. **Campo `image`** con import desde `@/assets/products/` para los 10 productos con foto
6. **`STAGE_LABELS`**: eliminar "Etapa" → "De 0 a 4 meses", etc.

### Cambio en `src/data/recommendationEngine.ts`
- Actualizar referencia `babyzen-yoyo2` → `babyzen-yoyo3`

### Estructura de archivos
- Copiar 10 imágenes a `src/assets/products/`
- Importar en `productCatalog.ts` como ES6 modules

### Descripciones propuestas (usando datos del Excel)

| Producto | Descripción nueva |
|---|---|
| Bugaboo Fox 3 | Suspensión en 4 ruedas, capazo reversible y cesta XXL de 30 L. Chasis de aluminio con tejidos repelentes al agua. 9.9 kg. |
| Bugaboo Donkey 3 | Convertible de mono a dúo en segundos. Suspensión mejorada, capota XXL y doble cesta de 30 L. 12.5 kg. |
| Bugaboo Dragonfly | Compacto premium con materiales bio-based (21 % menos CO2). Plegado en una pieza con correa de transporte. 7.9 kg. |
| Joolz Aer 2 | Ultraligero de 6.5 kg en aluminio aeroespacial y tejido reciclado REPREVE. Capota UPF 50+. Cabe en cabina. |
| Babyzen YOYO3 | Respaldo mejorado de 47 cm y capota ampliada respecto al YOYO2. Plegado ultra-compacto para cabina. 6.2 kg. |
| Stokke Sleepi Mini | Minicuna ovalada en madera de haya FSC con ruedas giratorias. Solo 67 cm de ancho. Garantia 7 anos. |
| Moises mimbre | Artesanal en mimbre natural con asas de cuero y forro de algodon organico GOTS. Solo 2.5 kg. |
| BabyBjorn Bliss | Balanceo natural con el movimiento del bebe. Tres posiciones, plegado plano de 11 cm. Solo 2.1 kg. |
| Bugaboo Giraffe hamaca | 2 en 1: hamaca reclinable con 5 posiciones y trona con bandeja apta para lavavajillas. |
| Nuna LEAF Grow | Balanceo silencioso hasta 2 min sin pilas ni motor. Evolutiva de recien nacido a 60 kg. |
| BabyBjorn Balance Soft | Tejido jersey de algodon 100 % extra-suave. Balanceo ergonomico natural. Plegado compacto. 2.1 kg. |
| BabyBjorn Harmony | Edicion premium con malla 3D transpirable y detalles en cuero vegano. Certificada Nordic Swan. 2.2 kg. |
| Ergobaby Omni | 4 posiciones desde recien nacido sin inserto. Malla SoftFlex transpirable. Capucha solar UPF 50+. 0.79 kg. |
| Boba Wrap | Fular elastico de algodon peinado (95 %) y spandex. Talla unica, contacto piel con piel. Solo 0.54 kg. |
| Cambiador mimbre | Cesta artesanal con colchoneta impermeable incluida y compartimentos para panales. 1.8 kg. |
| Stokke Tripp Trapp | Diseno iconico desde 1972 en madera de haya FSC. Evolutiva de bebe a adulto (136 kg). Garantia 7 anos. |
| Bugaboo Giraffe trona | 4 alturas regulables con pedal. Bandeja apta lavavajillas con bordes elevados. Plegable y compacta. |

