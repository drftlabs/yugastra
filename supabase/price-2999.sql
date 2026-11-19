-- Sets every watch to ₹2,999 (MRP stays ₹5,999, so the site shows about 50% off).
update products set price = 2999;
select name, price, compare_price from products order by name;
