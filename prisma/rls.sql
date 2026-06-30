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
alter table subscription_plans enable row level security;
alter table user_subscriptions enable row level security;
alter table feature_flags enable row level security;
alter table payment_events enable row level security;
alter table pulse_snapshots enable row level security;
alter table decision_simulations enable row level security;
alter table uploaded_assets enable row level security;
alter table extracted_financial_data enable row level security;
alter table client_activities enable row level security;
alter table client_notes enable row level security;
alter table admin_actions enable row level security;

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

drop policy if exists "subscription_plans_read_all" on subscription_plans;
create policy "subscription_plans_read_all" on subscription_plans
for select
using (active = true);

drop policy if exists "user_subscriptions_owner_all" on user_subscriptions;
create policy "user_subscriptions_owner_all" on user_subscriptions
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "feature_flags_read_all" on feature_flags;
create policy "feature_flags_read_all" on feature_flags
for select
using (active = true);

drop policy if exists "payment_events_owner_all" on payment_events;
create policy "payment_events_owner_all" on payment_events
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "pulse_snapshots_owner_all" on pulse_snapshots;
create policy "pulse_snapshots_owner_all" on pulse_snapshots
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "decision_simulations_owner_all" on decision_simulations;
create policy "decision_simulations_owner_all" on decision_simulations
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "uploaded_assets_owner_all" on uploaded_assets;
create policy "uploaded_assets_owner_all" on uploaded_assets
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "extracted_financial_data_owner_all" on extracted_financial_data;
create policy "extracted_financial_data_owner_all" on extracted_financial_data
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "client_activities_owner_all" on client_activities;
create policy "client_activities_owner_all" on client_activities
for all
using (auth.uid()::text = user_id)
with check (auth.uid()::text = user_id);

drop policy if exists "client_notes_owner_read" on client_notes;
drop policy if exists "client_notes_admin_only" on client_notes;
create policy "client_notes_admin_only" on client_notes
for all
using (
  exists (
    select 1
    from profiles
    where profiles.user_id = auth.uid()::text
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from profiles
    where profiles.user_id = auth.uid()::text
      and profiles.role = 'admin'
  )
);

drop policy if exists "admin_actions_admin_read" on admin_actions;
create policy "admin_actions_admin_read" on admin_actions
for select
using (auth.uid()::text = admin_id);

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on table mercado_pago_accounts from anon';
    execute 'revoke all on table payment_events from anon';
    execute 'revoke all on table client_notes from anon';
    execute 'revoke all on table admin_actions from anon';
  end if;

  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on table mercado_pago_accounts from authenticated';
    execute 'revoke all on table payment_events from authenticated';
    execute 'revoke all on table client_notes from authenticated';
    execute 'revoke all on table admin_actions from authenticated';
  end if;
end $$;
