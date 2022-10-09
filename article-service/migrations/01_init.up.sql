begin;

create table if not exists articles
(
    id serial primary key,
    title text not null check (title <> ''),
    article_text text not null check (description <> ''),
    price integer not null check (price >= 0),
    product_count integer not null check (product_count >= 0),
    is_nft bool not null,
    preview varchar unique,
    seller_id integer not null
);

create table if not exists product_comments
(
    id serial primary key,
    comment_text text not null check (comment_text <> ''),
    write_date timestamp not null,
    product_id serial references products,
    author_id integer not null
);

create table if not exists purchases
(
    id serial primary key,
    product_id serial references products,
    owner_id integer not null,
    buy_date timestamp not null,
    amount integer not null check (amount > 0)
);

commit;