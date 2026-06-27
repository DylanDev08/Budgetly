# AGENTS.md — Budgetly

> Instrucciones para Codex (VS Code). Leer este archivo completo antes de tocar cualquier archivo del proyecto.

---

## Identidad del proyecto

**Nombre:** Budgetly  
**Repo:** https://github.com/DylanDev08/Budgetly  
**Tipo:** App web de finanzas personales  
**Mercado:** Argentina (ARS, Mercado Pago, AFIP)

---

## Regla #1 — Antes de modificar cualquier cosa

1. Listar la estructura completa de `/src` y `/prisma`
2. Leer el contenido de: `layout.tsx`, `globals.css`, `tailwind.config.ts`, `middleware.ts`, `prisma/schema.prisma`
3. Mostrar un resumen de qué existe, qué falta y qué hay que corregir
4. Solo después implementar, en fases pequeñas y controladas

**No borrar archivos existentes sin avisar primero.**  
**No reescribir todo de golpe.**  
**Explicar qué archivos se tocan en cada paso.**

---

## Stack tecnológico

```
Frontend:
- Next.js App Router
- TypeScript (strict)
- Tailwind CSS
- shadcn/ui (instalar si no está)
- Lucide React
- Recharts
- Framer Motion
- React Hook Form + Zod
- TanStack Query
- Zustand

Backend:
- Next.js Route Handlers
- Prisma ORM
- Supabase Auth + Postgres
- Supabase RLS
- Supabase Storage (futuro)
- Supabase Edge Functions (futuro)
```

---

## Diseño visual — Dark Fintech

**No usar fondos blancos. No usar gradientes exagerados. No usar apariencia genérica de IA.**

### Paleta obligatoria

```
Fondo principal:       #050A06
Fondo secundario:      #0B120D
Cards:                 #101914
Cards hover:           #142119
Bordes:                rgba(34, 197, 94, 0.18)

Verde principal:       #22C55E
Verde neón / accent:   #39FF88
Verde oscuro:          #166534

Texto principal:       #F8FAFC
Texto secundario:      #94A3B8
Texto apagado:         #64748B

Warning:               #F59E0B
Error:                 #EF4444
Success:               #22C55E
```

Configurar esta paleta en `tailwind.config.ts` bajo `colors.budgetly`.  
Aplicar `background: #050A06` como fondo global en `globals.css`.

### Estilo

- Sidebar oscura izquierda con borde verde sutil
- Cards oscuras con hover suave
- Botones verdes funcionales (no decorativos)
- Inputs oscuros con foco verde
- Métricas grandes y claras
- Gráficos en verde/blanco
- Estados visuales: correcto (`#22C55E`), advertencia (`#F59E0B`), crítico (`#EF4444`)

---

## Arquitectura de carpetas objetivo

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css

    dashboard/page.tsx
    movements/page.tsx
    budgets/page.tsx
    obligations/page.tsx
    schedule/page.tsx
    routines/page.tsx
    goals/page.tsx
    investments/page.tsx
    assistant/page.tsx
    mercado-pago/page.tsx
    invoices/page.tsx
    settings/page.tsx

    legal/
      terms/page.tsx
      privacy/page.tsx
      security/page.tsx

    auth/
      login/page.tsx
      register/page.tsx

    api/
      mercado-pago/
        connect/route.ts
        callback/route.ts
        sync/route.ts
        movements/route.ts
      invoices/route.ts
      market/signals/route.ts

  components/
    layout/
      AppShell.tsx
      Sidebar.tsx
      Header.tsx
      Footer.tsx
      MobileNav.tsx
    ui/
      Button.tsx
      Card.tsx
      Input.tsx
      Select.tsx
      Badge.tsx
      Modal.tsx
      StatCard.tsx
      PageHeader.tsx
      ConfirmDialog.tsx
      EmptyState.tsx
      LoadingState.tsx
      ErrorState.tsx

  features/
    dashboard/
      FinancialOverview.tsx
      SpendingChart.tsx
      RecentMovements.tsx
      GoalSummary.tsx
      FinancialHealth.tsx
      BudgetSummary.tsx
    movements/
      MovementForm.tsx
      MovementList.tsx
      MovementFilters.tsx
      MovementItem.tsx
    budgets/
      BudgetEditor.tsx
      BudgetCard.tsx
      BudgetAlert.tsx
    obligations/
      ObligationForm.tsx
      ObligationList.tsx
      ObligationItem.tsx
    schedule/
      WeeklyCalendar.tsx
      ScheduleForm.tsx
    routines/
      RoutineForm.tsx
      RoutineList.tsx
      RoutineItem.tsx
    goals/
      GoalForm.tsx
      GoalCard.tsx
      GoalAutomationPanel.tsx
      GoalProgress.tsx
    investments/
      InvestmentSummary.tsx
      RiskProfileCard.tsx
      InvestmentRecommendation.tsx
      InvestmentSignalCard.tsx
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
      InvoicePreview.tsx
      InvoiceItem.tsx
    settings/
      UserSettingsForm.tsx
      AppearanceSettings.tsx
      AlertModeSettings.tsx
      AccountSettings.tsx

  lib/
    prisma.ts
    supabase/
      client.ts
      server.ts
      middleware.ts
    services/
      mercadoPago.service.ts
      mercadoPagoOAuth.service.ts
      invoice.service.ts
      market.service.ts
      assistant.service.ts
      transaction.service.ts
      budget.service.ts
      goal.service.ts
    domain/
      financeCalculations.ts
      budgetEngine.ts
      roastEngine.ts
      goalEngine.ts
      invoiceEngine.ts
      investmentEngine.ts
      assistantEngine.ts
    validations/
      transaction.schema.ts
      goal.schema.ts
      obligation.schema.ts
      settings.schema.ts
      budget.schema.ts
    utils/
      money.ts
      dates.ts
      id.ts
      cn.ts

  types/
    finance.ts
    mercadoPago.ts
    database.ts

prisma/
  schema.prisma
  migrations/
```

---

## Prisma Schema — Modelos requeridos

Crear o actualizar `prisma/schema.prisma`. Todos los campos en DB usan snake_case con `@map`. Todos los modelos usan `@map("nombre_tabla")`.

### Modelos

**Profile**
- id, userId (unique), fullName, email, currency (default: ARS), alertMode (normal/serio/humoristico), riskProfile (conservador/moderado/agresivo), monthlyBudget, weeklyBudget, variableBudget, monthlySavingsGoal, theme (default: dark), createdAt, updatedAt

**Transaction**
- id, userId, externalId (nullable), kind (income/expense), name, amount, category, type (fijo/mensual/semanal/variable/unico), source (manual/mercado_pago), date, note, invoiceId
- `@@unique([userId, externalId])` — previene duplicados de Mercado Pago
- `@@index([userId, date])`, `@@index([userId, category])`

**Invoice**
- id, userId, transactionId (unique FK), invoiceNumber (unique), type (ingreso/egreso), date, amount, concept, category, source, status (default: generada), pdfUrl (nullable)
- Relación con Transaction

**Budget**
- id, userId, name, category (nullable), type, limitAmount, alertPercentage (default: 80)

**Obligation**
- id, userId, name, amount, category, frequency, dueDay, status (pendiente/pagado), autoCreateTransaction (default: false)

**Goal**
- id, userId, name, targetAmount, currentAmount (default: 0), deadline (nullable), priority (default: media), autoEnabled (default: false), autoPercentage (default: 0), status (default: activa)
- Relación con GoalContribution[]

**GoalContribution**
- id, goalId (FK), transactionId (nullable FK), amount, source

**ScheduleBlock**
- id, userId, day, startTime, endTime, activity, area (trabajo/estudio/gym/descanso/finanzas/otro)

**Routine**
- id, userId, name, frequency, done (default: false), streak (default: 0)

**MercadoPagoAccount**
- id, userId (unique), mpUserId, accountEmail, accessTokenEncrypted, refreshTokenEncrypted, expiresAt, lastSync (nullable), syncStatus (default: idle)

**AssistantMessage**
- id, userId, role (user/assistant), content
- `@@index([userId, createdAt])`

**MarketSignal**
- id, userId, asset, signalType, riskLevel, summary

---

## Variables de entorno

Verificar o actualizar `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

DATABASE_URL=
DIRECT_URL=

MERCADO_PAGO_CLIENT_ID=
MERCADO_PAGO_CLIENT_SECRET=
MERCADO_PAGO_REDIRECT_URI=
MERCADO_PAGO_WEBHOOK_SECRET=

APP_URL=http://localhost:3000
ENCRYPTION_SECRET=
```

**Nunca hardcodear valores reales. Nunca exponer SUPABASE_SERVICE_ROLE_KEY ni tokens de MP en el cliente.**

---

## Sidebar — Navegación requerida

Links funcionales con íconos Lucide React, en este orden:

| Ícono sugerido | Label | Ruta |
|---|---|---|
| LayoutDashboard | Dashboard | /dashboard |
| ArrowLeftRight | Movimientos | /movements |
| Wallet | Presupuestos | /budgets |
| ClipboardList | Obligaciones | /obligations |
| Calendar | Horarios | /schedule |
| RefreshCw | Rutinas | /routines |
| Target | Metas | /goals |
| TrendingUp | Inversión | /investments |
| Bot | Bot asistente | /assistant |
| CreditCard | Mercado Pago | /mercado-pago |
| Receipt | Facturas | /invoices |
| Settings | Ajustes | /settings |

Requisitos de la sidebar:
- Logo/nombre "Budgetly" en el header
- Estado activo visible (borde o fondo verde)
- Responsive: colapsable en mobile
- Footer interno con copyright © 2026 Budgetly

---

## Footer legal — Requerido

Footer visible en todas las páginas con:
- Links a `/legal/terms`, `/legal/privacy`, `/legal/security`
- Contacto
- Copyright © 2026 Budgetly

Crear páginas con contenido placeholder profesional en español:
- `src/app/legal/terms/page.tsx` — Términos y condiciones
- `src/app/legal/privacy/page.tsx` — Política de privacidad
- `src/app/legal/security/page.tsx` — Seguridad

---

## Reglas de seguridad obligatorias

### Frontend
- Rutas privadas protegidas con `middleware.ts`
- Redirigir a `/auth/login` si no hay sesión activa
- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` ni tokens de MP en el cliente
- Validar todos los formularios con Zod
- Mostrar `ConfirmDialog` antes de cualquier acción destructiva (eliminar)
- Botones sin acción implementada → `disabled` + tooltip explicativo

### Backend (Route Handlers)
- Obtener `userId` siempre desde Supabase Auth (`getUser()`), nunca desde el body del request
- Validar todos los payloads con Zod antes de procesar
- Tokens de Mercado Pago cifrados con `ENCRYPTION_SECRET`
- Sin hardcoding de secretos
- Logs sin tokens ni datos sensibles

### Base de datos
- RLS activado en todas las tablas de Supabase
- Policies por `auth.uid()`
- Índices por `user_id` en todas las tablas
- Unique constraint `[userId, externalId]` en `transactions` para prevenir duplicados de MP
- `SUPABASE_SERVICE_ROLE_KEY` solo en backend

### Mercado Pago
- OAuth por backend únicamente
- `access_token` y `refresh_token` cifrados antes de guardar en DB
- Refresh automático si el token expira
- Deduplicación por `externalId`
- Sincronización manual primero, automática después

### Inversión
- **Nunca ejecutar compras ni ventas automáticas**
- Solo recomendaciones educativas
- Siempre advertir si hay obligaciones pendientes o presupuesto excedido
- Pedir confirmación manual para cualquier acción relevante

---

## Lógica de negocio — Motores internos

### budgetEngine.ts
- Calcular % usado de cada presupuesto
- Emitir alertas al 80% (warning), 100% (alert), 120% (critical)
- Respetar `alertMode` del usuario: `serio`, `normal`, `humoristico`

Ejemplo de mensaje humorístico:
> "Te pasaste del presupuesto mensual. Aflojá un poco porque la billetera ya está pidiendo auxilio."

### goalEngine.ts
- Si el balance mensual es positivo, sugerir aporte a meta prioritaria
- Si `auto_enabled`, sumar `auto_percentage` del ingreso
- Mostrar progreso real vs progreso esperado
- Mensajes motivacionales al acercarse a la meta

### invoiceEngine.ts
- Generar comprobante interno automáticamente al crear un movimiento
- Formato: número único, tipo, fecha, concepto, monto, categoría, origen, estado
- No es factura legal AFIP (por ahora)
- Preparar estructura para exportar a PDF después

### assistantEngine.ts
- Responder preguntas usando datos reales del usuario: transactions, budgets, obligations, goals, schedule_blocks, routines, profile
- No inventar datos
- Reglas locales primero, IA externa preparada para después
- Responder preguntas como:
  - ¿En qué estoy gastando más?
  - ¿Puedo comprar X?
  - ¿Cuánto me falta para mi meta?
  - ¿Qué obligaciones tengo pendientes?
  - ¿Estoy en condiciones de invertir?

### investmentEngine.ts
- Analizar: balance, gastos, obligaciones, fondo de emergencia, metas activas, perfil de riesgo
- Devolver: `canInvest`, `availableToInvest`, `riskLevel`, `recommendation`, `warnings`
- Nunca ejecutar inversiones automáticas
- Conectar a `market.service.ts` (mock por ahora, API real después)

---

## Fases de implementación

Trabajar en este orden. No saltear fases. No mezclar fases.

### Fase 1 — Auditoría + Setup visual ← EMPEZAR ACÁ
1. Inspeccionar `/src` y `/prisma` completos
2. Leer archivos clave: `layout.tsx`, `globals.css`, `tailwind.config.ts`, `middleware.ts`, `prisma/schema.prisma`
3. Mostrar resumen: qué existe, qué falta, qué corregir
4. Aplicar paleta dark fintech en `globals.css` y `tailwind.config.ts`
5. Crear o corregir `AppShell`, `Sidebar`, `Header`, `Footer`
6. Crear páginas base vacías para cada ruta del módulo
7. Crear páginas legales con placeholder en español
8. Navegación funcional con estado activo visible

### Fase 2 — Prisma + Supabase
1. Actualizar `prisma/schema.prisma` con todos los modelos
2. Crear `src/lib/prisma.ts`
3. Crear `src/lib/supabase/client.ts` y `server.ts`
4. Verificar conexión a DB

### Fase 3 — Auth + Profiles
1. Supabase Auth con login y registro
2. Middleware de rutas privadas
3. Perfil por usuario con todos los settings
4. Habilitar RLS en Supabase

### Fase 4 — Movimientos + Facturas
1. CRUD completo de movimientos con Zod
2. Auto-generar `Invoice` al crear movimiento
3. Dashboard consume métricas reales desde DB

### Fase 5 — Presupuestos + Obligaciones
1. CRUD de presupuestos con alertas al 80/100/120%
2. CRUD de obligaciones
3. Marcar obligación como pagada → crear egreso + invoice automático

### Fase 6 — Horarios, Rutinas, Metas
1. CRUD de `schedule_blocks` con vista semanal
2. CRUD de `routines` con racha (streak)
3. CRUD de `goals` con `goalEngine`

### Fase 7 — Bot asistente local
1. `assistantEngine.ts` con reglas locales
2. Chat UI funcional
3. Respuestas basadas en datos reales del usuario

### Fase 8 — Mercado Pago mock
1. Pantalla de conexión con estado visual (conectado / no conectado)
2. Sync mock con datos normalizados
3. Deduplicación por `externalId`

### Fase 9 — Mercado Pago real
1. OAuth completo por backend
2. Tokens cifrados con `ENCRYPTION_SECRET`
3. Refresh token automático
4. Sync real + generación automática de invoices

### Fase 10 — Inversión educativa
1. `investmentEngine.ts` con lógica local
2. `market.service.ts` preparado para API futura (mock por ahora)
3. Solo recomendaciones educativas
4. **Nunca ejecutar inversiones automáticas**

---

## Reglas generales de trabajo

```
- No crear código muerto ni archivos innecesarios
- No dejar botones sin acción (si no existe, disabled + tooltip)
- No romper imports existentes
- No cambiar todo de golpe — trabajar por fases
- Explicar brevemente qué archivos se tocaron en cada paso
- TypeScript strict en todo el proyecto
- Validar siempre con Zod (frontend y backend)
- Usar Prisma para acceso a DB
- Usar Supabase Auth para sesión de usuario
- Mantener diseño dark y verde en toda la app
- Nunca ejecutar inversiones automáticas
- Nunca exponer tokens sensibles en el cliente
- Nunca hardcodear secretos
```

---

## Datos de referencia — Formato normalizado Mercado Pago

```ts
[
  {
    externalId: "mp-123",
    kind: "expense",
    name: "Compra kiosco",
    amount: 2500,
    category: "Comida",
    type: "variable",
    date: "2026-05-27",
    source: "mercado_pago"
  },
  {
    externalId: "mp-124",
    kind: "income",
    name: "Transferencia recibida",
    amount: 20000,
    category: "Entrada",
    type: "unico",
    date: "2026-05-27",
    source: "mercado_pago"
  }
]
```

---

## Datos de referencia — Output de investmentEngine

```ts
{
  canInvest: false,
  availableToInvest: 0,
  riskLevel: "bajo",
  recommendation: "No invertir todavía. Primero completá el fondo de emergencia y ordená los gastos variables.",
  warnings: ["Tenés obligaciones pendientes", "Estás cerca del límite mensual"]
}
```

---

*Última actualización: Junio 2026 — Budgetly v0.1*
