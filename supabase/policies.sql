alter table profiles enable row level security;
alter table transactions enable row level security;
alter table budgets enable row level security;
alter table obligations enable row level security;
alter table goals enable row level security;
alter table goal_contributions enable row level security;
alter table schedule_blocks enable row level security;
alter table routines enable row level security;
alter table invoices enable row level security;
alter table mercado_pago_accounts enable row level security;
alter table assistant_messages enable row level security;
alter table market_signals enable row level security;
alter table audit_logs enable row level security;

drop policy if exists "profiles_owner_all" on profiles;
create policy "profiles_owner_all" on profiles
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "transactions_owner_all" on transactions;
create policy "transactions_owner_all" on transactions
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "budgets_owner_all" on budgets;
create policy "budgets_owner_all" on budgets
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "obligations_owner_all" on obligations;
create policy "obligations_owner_all" on obligations
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "goals_owner_all" on goals;
create policy "goals_owner_all" on goals
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "goal_contributions_owner_all" on goal_contributions;
create policy "goal_contributions_owner_all" on goal_contributions
for all
using (
  exists (
    select 1
    from goals
    where goals.id = goal_contributions.goal_id
      and goals.user_id = auth.uid()::text
  )
)
with check (
  exists (
    select 1
    from goals
    where goals.id = goal_contributions.goal_id
      and goals.user_id = auth.uid()::text
  )
);

drop policy if exists "schedule_blocks_owner_all" on schedule_blocks;
create policy "schedule_blocks_owner_all" on schedule_blocks
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "routines_owner_all" on routines;
create policy "routines_owner_all" on routines
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "invoices_owner_all" on invoices;
create policy "invoices_owner_all" on invoices
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "mercado_pago_accounts_owner_all" on mercado_pago_accounts;
create policy "mercado_pago_accounts_owner_all" on mercado_pago_accounts
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "assistant_messages_owner_all" on assistant_messages;
create policy "assistant_messages_owner_all" on assistant_messages
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "market_signals_owner_all" on market_signals;
create policy "market_signals_owner_all" on market_signals
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "audit_logs_owner_read_insert" on audit_logs;
create policy "audit_logs_owner_read_insert" on audit_logs
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);
