begin;

create table if not exists system_users
(
    id serial primary key,
    first_name varchar(30) not null check (first_name <> ''),
    last_name varchar(30) not null check (last_name <> ''),
    email varchar(60) not null check (email <> ''),
    phone_number varchar(13) not null check (phone_number <> ''),
    description text not null,
    birthday date not null,
    department varchar(100) not null check (department <> ''),
    avatar varchar(200)
);

commit;