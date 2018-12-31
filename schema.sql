drop database if exists bamazon;
create database bamazon;

use bamazon;

create table products(
  item_id int auto_increment not null,
  product_name varchar(45) not null,
  department_name varchar(45) not null,
  price decimal(10, 2) not null,
  stock_quantity int(10) not null,
  primary key(item_id)
);

select * from products;

insert into products(product_name, department_name, price, stock_quantity)
values ("tomb raider", "video games", 59.95, 100),
("pixel 3", "cell phones", 799.99, 50),
("zelda watch", "jewelry", 29.99, 60),
("get good at code", "books", 44.99, 75),
("dungeon masters guide", "books", 49.99, 25),
("ramen", "food and beverage", 10.35, 100),
("pepsi", "food and beverage", 12.95, 120),
("venom", "entertainment", 29.99, 30),
("kamikaze by eminem", "entertainment", 11.99, 15),
("spiderman action figure", "toys", 12.99, 10);
