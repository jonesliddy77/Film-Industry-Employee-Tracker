DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NULL,
  salary DECIMAL(10,2) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(45) NULL,
  last_name VARCHAR(45) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);


INSERT INTO department (name)
VALUES ("Production"), ("Script"), ("Location"), ("Camera");

INSERT INTO role (title, salary, department_id)
VALUES ("Executive Producer", 150000, 1), ("Production Manager", 120000, 1), ("Story Producer", 100000, 2), ("Script Editor", 80000, 2), ("Location Manager", 125000, 3), ("Location Assistant", 250000, 3), ("Director of Cinematographer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jones", "Liddy", 1, NULL), ("Karen", "Lee", 3, NULL), ("Kate", "Sanderson", 6, NULL), ("Michael", "Apple", 2, 1), ("John", "Snow", 4, 2), ("Jimmy", "Johns", 7, 3), ("Madison", "Brown", 5, NULL);
