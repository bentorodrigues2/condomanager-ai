
create table if not exists notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,

  critical_occurrences boolean not null default true,
  critical_documents boolean not null default true,
  critical_assemblies boolean not null default true,

  optional_finances boolean not null default false,
  optional_reservations boolean not null default false,
  optional_cleaning boolean not null default false,
  optional_general boolean not null default false,

  updated_at timestamp with time zone default now()
);
