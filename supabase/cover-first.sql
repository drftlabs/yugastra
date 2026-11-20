-- "Front photo first": photos are shown in the order uploaded (front, side, back) and the front photo is the cover.
-- KAVACH and KSHANA use it. Other realms keep the existing order.
alter table products add column if not exists cover_first boolean default false;
update products set cover_first = true where collection_id in (select id from collections where slug in ('kavach','kshana'));
notify pgrst, 'reload schema';
