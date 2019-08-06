USE mysql;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILEGES ON storefront_db.* TO 'root'@'localhost';

-- DROP DATABASE IF EXISTS storefront_db;
CREATE database storefront_db;
USE storefront_db;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    product VARCHAR(60) NOT NULL,
    department VARCHAR(40) NULL,
    price DECIMAL(12,2) NOT NULL,
    stock INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT,
    department VARCHAR(40) NOT NULL,
    overhead DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (product, department, price, stock) VALUES ("iPhone 20XX", "Electronics", "1999.99", "250");
INSERT INTO products (product, department, price, stock) VALUES ("White Van Surveillance System", "Electronics", "149.95", "750");
INSERT INTO products (product, department, price, stock) VALUES ("80s Workout DVD", "Fitness", "19.99", "2000");
INSERT INTO products (product, department, price, stock) VALUES ("Overpriced Yoga Mat", "Fitness", "129.95", "1000");
INSERT INTO products (product, department, price, stock) VALUES ("Business CEO Lego Set", "Games & Toys", "44.49", "1500");
INSERT INTO products (product, department, price, stock) VALUES ("Grand Theft Auto XLII", "Games & Toys", "59.99", "950");
INSERT INTO products (product, department, price, stock) VALUES ("Splish-Splash Slime Kit", "Games & Toys", "29.95", "2250");
INSERT INTO products (product, department, price, stock) VALUES ("Super Smash Bros. Galaxy", "Games & Toys", "49.99", "800");
INSERT INTO products (product, department, price, stock) VALUES ("Bath Water", "Grocery", "0.99", "50000");
INSERT INTO products (product, department, price, stock) VALUES ("Bibbles & Kits Dog Food", "Grocery", "34.99", "4000");
INSERT INTO products (product, department, price, stock) VALUES ("Dude Brownie Mix", "Grocery", "5.99", "8000");
INSERT INTO products (product, department, price, stock) VALUES ("Clever Joke", "Miscellaneous", "420.69", "300");
INSERT INTO products (product, department, price, stock) VALUES ("New Life", "Miscellaneous", "10000.00", "50");
INSERT INTO products (product, department, price, stock) VALUES ("Pet Rock", "Miscellaneous", "9.99", "2500");

INSERT INTO departments (department, overhead) VALUES ("Electronics", "1000000");
INSERT INTO departments (department, overhead) VALUES ("Fitness", "1000000");
INSERT INTO departments (department, overhead) VALUES ("Games & Toys", "1000000");
INSERT INTO departments (department, overhead) VALUES ("Grocery", "1000000");
INSERT INTO departments (department, overhead) VALUES ("Miscellaneous", "1000000");

-- SELECT * FROM products;
-- SELECT * FROM departments;