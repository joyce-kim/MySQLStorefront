DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

use bamazon;

CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(30) NOT NULL,
	department_name VARCHAR(30) NOT NULL,
	price INTEGER(11) NOT NULL,
	stock_quantity INTEGER(20),
	PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Shampoo", "Hygiene", 8, 400),
	("Body Wash", "Hygiene", 10, 240),
	("Frying Pan", "Kitchen", 40, 100),
	("Canned Tuna", "Grocery", 2, 300),
	("Instant Ramen", "Grocery", 1, 500),
	("Socks", "Clothing", 5, 100),
	("Mug", "Kitchen", 10, 50),
	("Electric Kettle", "Kitchen", 50, 100),
	("Soap", "Hygiene", 3, 240),
	("Sweater", "Clothing", 30, 150);