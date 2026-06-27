Actuá como un Senior Full Stack Developer + Software Architect + UX/UI Designer especializado en apps financieras personales, SaaS, dashboards, Supabase, Next.js, APIs externas, seguridad y arquitectura modular.

Quiero desarrollar una app web de finanzas personales llamada provisionalmente:

Budgetly

La app debe estar pensada como una plataforma personal de control financiero, organización diaria, conexión con Mercado Pago, métricas, metas, bot asistente y análisis educativo de inversión.

No quiero que generes un proyecto desordenado ni un único archivo gigante. Quiero una arquitectura modular, escalable y mantenible.

## Stack tecnológico obligatorio/recomendado

Usar este stack:

Frontend:

* Next.js con App Router
* TypeScript
* Tailwind CSS
* shadcn/ui o componentes UI propios bien reutilizables
* Lucide React para íconos
* Recharts para gráficos
* Framer Motion para microinteracciones suaves
* React Hook Form para formularios
* Zod para validación
* TanStack Query para requests, cache y sincronización
* Zustand o Context + useReducer para estado local/controlado

Backend:

* Next.js Route Handlers para endpoints internos
* Supabase como base de datos principal
* Supabase Auth para usuarios
* Supabase Postgres como DB
* Supabase Realtime si se necesita sincronización en vivo
* Supabase Storage si después se guardan PDFs/facturas/exportaciones
* Supabase Edge Functions si conviene mover lógica sensible fuera del frontend

Base de datos:

* Supabase PostgreSQL
* Row Level Security activado
* Políticas por usuario
* Cada usuario solo puede ver sus propios datos

Integraciones:

* Mercado Pago API
* OAuth de Mercado Pago para conectar la cuenta del usuario
* Backend propio para manejar access token, refresh token y sincronización
* API de mercado/inversión futura para obtener señales educativas
* Bot asistente inicialmente basado en reglas locales, preparado para IA más adelante

No exponer tokens, claves privadas ni credenciales en el frontend.

## Paleta de colores y estilo visual

La app debe tener una identidad clara:

Paleta principal:

* Fondo principal: blanco / gris muy claro
* Color principal: verde financiero
* Verde principal: #16A34A
* Verde oscuro: #166534
* Verde suave: #DCFCE7
* Texto principal: #0F172A
* Texto secundario: #64748B
* Bordes: #E2E8F0
* Alertas: amarillo/amber
* Crítico: rojo
* Correcto: verde

Estilo:

* SaaS moderno
* Minimalista
* Limpio
* Profesional
* Dashboard financiero
* Cards grandes
* Sidebar izquierda
* Mucho espacio visual
* Responsive mobile/desktop
* No usar estética genérica de IA
* No usar gradientes exagerados
* Interfaz blanca con acentos verdes
* Botones claros y consistentes
* Hover states suaves
* Estados visuales: correcto, advertencia, crítico

Inspiración visual:

* Dashboard tipo Notion + fintech moderna
* Cards redondeadas
* Sidebar clara o blanca con acentos verdes
* Métricas fáciles de leer
* Layout ordenado y profesional

## Objetivo funcional de la app

La app debe permitirme controlar:

* Ingresos fijos
* Ingresos variables
* Gastos mensuales fijos
* Gastos variables
* Gastos semanales
* Gastos por categoría
* Horarios semanales
* Rutinas
* Obligaciones de pago
* Metas financieras
* Compras objetivo, por ejemplo: notebook, monitor, curso, fondo de emergencia
* Movimientos importados desde Mercado Pago
* Facturas/comprobantes internos generados por cada entrada o salida de dinero
* Métricas de rendimiento financiero
* Recomendaciones educativas para inversión
* Bot asistente financiero

La app debe avisarme si gasto más de lo debido. Debe existir un modo configurable de alerta:

* Modo serio
* Modo normal
* Modo humorístico/directo

Ejemplo de alerta humorística:
“Te pasaste del presupuesto mensual. Aflojá un poco porque la billetera ya está pidiendo auxilio.”

## Arquitectura de carpetas esperada

Crear una estructura modular similar a esta:

src/
app/
layout.tsx
page.tsx
globals.css

```
dashboard/
  page.tsx

movements/
  page.tsx

budgets/
  page.tsx

obligations/
  page.tsx

schedule/
  page.tsx

goals/
  page.tsx

investments/
  page.tsx

assistant/
  page.tsx

mercado-pago/
  page.tsx

invoices/
  page.tsx

settings/
  page.tsx

auth/
  login/
    page.tsx
  register/
    page.tsx

api/
  mercado-pago/
    connect/
      route.ts
    callback/
      route.ts
    movements/
      route.ts
    sync/
      route.ts

  invoices/
    route.ts

  market/
    signals/
      route.ts
```

components/
layout/
AppShell.tsx
Sidebar.tsx
Header.tsx
Footer.tsx
MobileNav.tsx

```
ui/
  Button.tsx
  Card.tsx
  Input.tsx
  Select.tsx
  Badge.tsx
  Progress.tsx
  Modal.tsx
  EmptyState.tsx
  StatCard.tsx
  PageHeader.tsx
```

features/
dashboard/
FinancialOverview.tsx
SpendingChart.tsx
CategoryBreakdown.tsx
RecentMovements.tsx
GoalSummary.tsx
FinancialHealthCard.tsx

```
movements/
  MovementForm.tsx
  MovementList.tsx
  MovementItem.tsx
  MovementFilters.tsx

budgets/
  BudgetEditor.tsx
  BudgetCard.tsx
  BudgetAlert.tsx

obligations/
  ObligationForm.tsx
  ObligationList.tsx
  ObligationItem.tsx

schedule/
  ScheduleForm.tsx
  WeeklyCalendar.tsx
  RoutineForm.tsx
  RoutineList.tsx

goals/
  GoalForm.tsx
  GoalCard.tsx
  GoalProgress.tsx
  GoalAutomationPanel.tsx

investments/
  RiskProfileCard.tsx
  InvestmentSignalCard.tsx
  InvestmentRecommendation.tsx

assistant/
  AssistantChat.tsx
  AssistantMessage.tsx
  AssistantSuggestions.tsx

mercadoPago/
  MercadoPagoConnectionCard.tsx
  MercadoPagoSyncPanel.tsx
  ImportedMovementsList.tsx

invoices/
  InvoiceList.tsx
  InvoiceItem.tsx
  InvoicePreview.tsx

settings/
  UserSettingsForm.tsx
  AppearanceSettings.tsx
  AlertModeSettings.tsx
  AccountSettings.tsx
```

lib/
supabase/
client.ts
server.ts
middleware.ts

```
services/
  mercadoPago.service.ts
  invoice.service.ts
  market.service.ts
  assistant.service.ts

domain/
  financeCalculations.ts
  budgetEngine.ts
  goalEngine.ts
  roastEngine.ts
  invoiceEngine.ts
  investmentEngine.ts
  assistantEngine.ts

utils/
  money.ts
  dates.ts
  id.ts
  classNames.ts
```

types/
finance.ts
database.ts
mercadoPago.ts

middleware.ts

## Sidebar y navegación

Crear una sidebar izquierda con estas secciones:

* Dashboard
* Movimientos
* Presupuestos
* Obligaciones
* Horarios
* Rutinas
* Metas
* Inversión
* Bot asistente
* Mercado Pago
* Facturas / Comprobantes
* Ajustes

La sidebar debe tener:

* Logo/nombre de la app
* Links o botones de navegación
* Estado activo visible
* Íconos
* Footer con copyright
* Contacto
* Diseño responsive
* Versión mobile

## Ajustes de usuario

Cada usuario debe tener una sección de Ajustes donde pueda configurar:

* Nombre
* Email
* Moneda principal
* Modo de alerta: serio, normal, humorístico
* Presupuesto mensual general
* Límite semanal
* Límite de gastos variables
* Meta de ahorro mensual
* Perfil de riesgo: conservador, moderado, agresivo
* Tema visual: claro inicialmente, oscuro más adelante
* Estado de conexión con Mercado Pago

Estos ajustes deben guardarse por usuario en Supabase.

## Modelo de datos

Diseñar tablas en Supabase para:

profiles:

* id
* user_id
* full_name
* email
* currency
* alert_mode
* risk_profile
* monthly_budget
* weekly_budget
* variable_budget
* monthly_savings_goal
* created_at
* updated_at

transactions:

* id
* user_id
* external_id
* kind: income | expense
* name
* amount
* category
* type: fijo | mensual | semanal | variable | unico
* source: manual | mercado_pago
* date
* note
* invoice_id
* created_at
* updated_at

budgets:

* id
* user_id
* name
* category
* type
* limit_amount
* alert_percentage
* created_at
* updated_at

obligations:

* id
* user_id
* name
* amount
* category
* frequency
* due_day
* status: pendiente | pagado
* auto_create_transaction
* created_at
* updated_at

schedule_blocks:

* id
* user_id
* day
* start_time
* end_time
* activity
* area
* created_at
* updated_at

routines:

* id
* user_id
* name
* frequency
* done
* streak
* created_at
* updated_at

goals:

* id
* user_id
* name
* target_amount
* current_amount
* deadline
* priority
* auto_enabled
* auto_percentage
* status
* created_at
* updated_at

invoices:

* id
* user_id
* transaction_id
* invoice_number
* type: ingreso | egreso
* date
* amount
* concept
* category
* source
* status
* pdf_url
* created_at
* updated_at

mercado_pago_accounts:

* id
* user_id
* mp_user_id
* account_email
* access_token_encrypted
* refresh_token_encrypted
* expires_at
* last_sync
* sync_status
* created_at
* updated_at

assistant_messages:

* id
* user_id
* role: user | assistant
* content
* created_at

market_signals:

* id
* user_id
* asset
* signal_type
* risk_level
* summary
* created_at

Activar Row Level Security en todas las tablas.
Crear policies para que cada usuario solo pueda leer, crear, editar y borrar sus propios datos.

## Dashboard

El dashboard debe mostrar:

* Total de ingresos del mes
* Total de gastos del mes
* Balance actual
* Gastos de la semana
* Presupuesto usado
* Estado financiero: bien, advertencia, crítico
* Categoría donde más gasto
* Gráfico de gastos por categoría
* Gráfico de ingresos vs egresos
* Últimos movimientos
* Próximas obligaciones
* Progreso de metas
* Últimos comprobantes generados
* Estado de Mercado Pago: conectado/no conectado

Los dashboards deben ser interactivos:

* Filtros por fecha
* Filtros por categoría
* Cards clickeables
* Métricas actualizadas
* Empty states claros
* Loading states
* Error states

## Movimientos

Crear CRUD de movimientos:

* Crear ingreso manual
* Crear gasto manual
* Editar movimiento
* Eliminar movimiento
* Filtrar movimientos
* Buscar por nombre
* Filtrar por fecha
* Filtrar por categoría
* Filtrar por origen
* Filtrar por tipo

Cada vez que se crea un movimiento, generar automáticamente un comprobante interno.

Si el movimiento viene de Mercado Pago, evitar duplicados usando external_id.

## Facturas / comprobantes internos

Cada ingreso o egreso debe generar automáticamente un comprobante interno.

No debe ser una factura legal AFIP al principio. Debe ser comprobante interno.

Debe tener:

* Número de comprobante
* Tipo: ingreso / egreso
* Fecha
* Concepto
* Categoría
* Monto
* Origen
* Estado
* Relación con transaction_id

Más adelante preparar la app para exportar comprobantes a PDF.

## Mercado Pago

Implementar sección Mercado Pago.

Frontend:

* Mostrar estado de conexión
* Botón Conectar Mercado Pago
* Botón Sincronizar movimientos
* Mostrar última sincronización
* Mostrar errores
* Mostrar movimientos importados
* Evitar duplicados

Backend:

* Implementar flujo OAuth de Mercado Pago
* No exponer access token en frontend
* Guardar tokens de forma segura
* Consultar movimientos desde backend
* Normalizar datos
* Enviar movimientos normalizados al frontend
* Guardar movimientos en Supabase
* Crear comprobantes internos automáticamente

Rutas esperadas:

* GET /api/mercado-pago/connect
* GET /api/mercado-pago/callback
* GET /api/mercado-pago/movements
* POST /api/mercado-pago/sync

Formato normalizado esperado:

[
{
"externalId": "mp-123",
"kind": "expense",
"name": "Compra kiosco",
"amount": 2500,
"category": "Comida",
"type": "variable",
"date": "2026-05-27",
"source": "mercado_pago"
},
{
"externalId": "mp-124",
"kind": "income",
"name": "Transferencia recibida",
"amount": 20000,
"category": "Entrada",
"type": "unico",
"date": "2026-05-27",
"source": "mercado_pago"
}
]

## Presupuestos

Crear sección de presupuestos donde pueda configurar:

* Presupuesto mensual total
* Límite semanal
* Límite por categoría
* Límite de gastos variables
* Límite de ocio
* Límite de comida
* Límite de transporte

Alertas:

* Si uso más del 80%, advertencia
* Si uso más del 100%, alerta fuerte
* Si uso más del 120%, estado crítico

Las alertas deben respetar el modo de alerta del usuario.

## Obligaciones

Crear CRUD de obligaciones:

* Servicios
* Suscripciones
* Cuotas
* Deudas
* Pagos recurrentes

Cada obligación debe tener:

* Nombre
* Monto
* Categoría
* Frecuencia
* Día de vencimiento
* Estado pendiente/pagado
* Opción para generar movimiento al marcar como pagado

Si marco una obligación como pagada:

* Crear egreso
* Generar comprobante
* Actualizar estado

## Horarios y rutinas

Crear sección de organización:

Horarios:

* Día de la semana
* Hora inicio
* Hora fin
* Actividad
* Área: trabajo, estudio, gym, descanso, finanzas, otro

Rutinas:

* Nombre
* Frecuencia
* Estado hecho/no hecho
* Racha opcional

Visual:

* Agenda semanal
* Cards por día
* Rutinas con checkbox
* Estadísticas de cumplimiento

## Metas financieras

Crear metas como:

* Comprar notebook
* Comprar monitor
* Fondo de emergencia
* Curso
* Inversión inicial

Cada meta debe tener:

* Nombre
* Monto objetivo
* Monto actual
* Fecha límite opcional
* Prioridad
* Estado
* Aporte automático configurable

Motor de metas:

* Si el balance mensual es positivo, sugerir aporte a meta prioritaria
* Si el usuario activa auto_aporte, sumar porcentaje configurable
* Si el usuario se acerca a la meta, mostrar mensaje motivacional
* Si el usuario se aleja, mostrar alerta
* No restar dinero de la meta de forma confusa
* Mostrar progreso real y progreso esperado

## Bot asistente

Crear sección de bot asistente.

Inicialmente debe funcionar con reglas locales, no hace falta IA externa todavía.

El bot debe poder responder:

* ¿En qué estoy gastando más?
* ¿Estoy gastando mucho?
* ¿Puedo comprar X cosa?
* ¿Cuánto me falta para mi meta?
* ¿Qué gasto debería recortar?
* ¿Estoy en condiciones de invertir?
* ¿Qué obligaciones tengo pendientes?
* ¿Cómo viene mi semana?

El bot no debe inventar datos.
Debe responder usando:

* transactions
* budgets
* obligations
* goals
* schedule_blocks
* routines
* profile/settings

Crear assistantEngine.ts para centralizar la lógica.

## Inversión y análisis de mercado

Crear módulo de inversión educativa.

No ejecutar inversiones automáticamente.
No hacer compras ni ventas automáticas.

El módulo debe analizar:

* Balance actual
* Gastos mensuales
* Obligaciones pendientes
* Fondo de emergencia
* Metas activas
* Dinero disponible
* Perfil de riesgo
* Señales de mercado

Debe devolver:

* canInvest
* availableToInvest
* riskLevel
* recommendation
* warnings

Ejemplo:

{
canInvest: false,
availableToInvest: 0,
riskLevel: "bajo",
recommendation: "No invertir todavía. Primero completá fondo de emergencia y ordená gastos variables.",
warnings: ["Tenés obligaciones pendientes", "Estás cerca del límite mensual"]
}

Preparar marketService.ts para conectar una API futura de mercado.
Por ahora puede usar mocks y reglas locales.

## Seguridad

Requisitos obligatorios:

* No exponer tokens en frontend
* Usar variables de entorno
* Validar inputs con Zod
* Validar requests del backend
* Usar Row Level Security de Supabase
* Evitar duplicados de Mercado Pago
* Manejar errores de API
* No mostrar información de un usuario a otro
* No ejecutar inversiones automáticamente
* Pedir confirmación antes de acciones destructivas
* Separar lógica de UI
* No hardcodear secretos
* Crear .env.example

## Archivos de entorno

Crear .env.example con:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MERCADO_PAGO_CLIENT_ID=
MERCADO_PAGO_CLIENT_SECRET=
MERCADO_PAGO_REDIRECT_URI=
MERCADO_PAGO_WEBHOOK_SECRET=
APP_URL=

No usar claves reales.

## Primera tarea

Antes de codear todo, inspeccioná el proyecto actual.

Si no existe proyecto, crealo desde cero con Next.js + TypeScript + Tailwind.

Primero entregá o implementá esta fase:

Fase 1:

* Setup Next.js
* Tailwind
* Supabase client/server
* AppShell
* Sidebar
* Header
* Footer
* Páginas base vacías
* Paleta blanco + verde
* Navegación funcional
* Diseño responsive
* Componentes UI base

No avanzar a Mercado Pago real todavía.
No avanzar a Prisma.
No meter lógica financiera compleja todavía.

Después de Fase 1, seguir con:

Fase 2:

* Supabase Auth
* Profiles
* Settings por usuario
* RLS

Fase 3:

* Movimientos CRUD
* Comprobantes internos automáticos

Fase 4:

* Dashboard y métricas

Fase 5:

* Presupuestos y alertas

Fase 6:

* Obligaciones

Fase 7:

* Horarios y rutinas

Fase 8:

* Metas financieras

Fase 9:

* Bot asistente local

Fase 10:

* Mercado Pago mock

Fase 11:

* OAuth Mercado Pago real

Fase 12:

* Inversión educativa y market service mock

Reglas de trabajo:

* No crear archivos innecesarios.
* No borrar código existente sin revisar.
* No romper estilos existentes.
* No exponer secretos.
* Explicar brevemente qué archivos se tocaron.
* Mantener commits/estructura limpia.
* Priorizar modularidad, mantenibilidad y seguridad.
