DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  item_id INT auto_increment NOT NULL,
  product_name VARCHAR(45) NOT NULL,
  product_sales DECIMAL(10, 2) default 0,
  department_name VARCHAR(45) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INT(10) NOT NULL,
  PRIMARY KEY(item_id)
);

SELECT * FROM products;

INSERT INTO products(product_name, department_name, price, stock_quantity)
  VALUES 
    ("tomb raider", "video games", 59.95, 100),
    ("pixel 3", "cell phones", 799.99, 50),
    ("zelda watch", "jewelry", 29.99, 60),
    ("get good at code", "books", 44.99, 75),
    ("dungeon masters guide", "books", 49.99, 25),
    ("ramen", "food and beverage", 10.35, 100),
    ("pepsi", "food and beverage", 12.95, 120),
    ("venom", "entertainment", 29.99, 30),
    ("kamikaze by eminem", "entertainment", 11.99, 15),
    ("spiderman action figure", "toys", 12.99, 10);


CREATE TABLE departments(
  department_id INT auto_increment NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  over_head DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY(department_id)
);

SELECT * FROM departments;

INSERT INTO departments (department_name, over_head)
  VALUES
    ('video games', 150),
    ('food and beverage', 200),
    ('books', 80),
    ('cell phones', 300),
    ('jewelry', 400),
    ('entertainment', 240),
    ('toys', 105);