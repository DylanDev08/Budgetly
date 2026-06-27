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

create policy "profiles_owner_all" on profiles for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
create policy "transactions_owner_all" on transactions for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
create policy "budgets_owner_all" on budgets for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
create policy "obligations_owner_all" on obligations for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
create policy "goals_owner_all" on goals for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
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
create policy "schedule_blocks_owner_all" on schedule_blocks for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
create policy "routines_owner_all" on routines for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
create policy "invoices_owner_all" on invoices for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
create policy "mercado_pago_accounts_owner_all" on mercado_pago_accounts for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
create policy "assistant_messages_owner_all" on assistant_messages for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
create policy "market_signals_owner_all" on market_signals for all using (auth.uid()::text = user_id) with check (auth.uid()::text = user_id);
