begin;

create table if not exists products
(
    id serial primary key,
    title text not null check (title <> ''),
    description text not null check (description <> ''),
    price integer not null check (price >= 0),
    product_count integer not null check (product_count >= 0),
    preview varchar unique,
    owner_id integer not null
);

create table if not exists product_comments
(
    id serial primary key,
    comment_text text not null check (comment_text <> ''),
    write_date timestamp with time zone not null,
    product_id serial references products,
    author_id integer not null
);

commit;