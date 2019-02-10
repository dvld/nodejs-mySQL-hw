
// dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

// connect to mysql database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'W!nt3rL1nk',
  database: 'bamazon'
});

// create server connection, if successful, load data
connection.connect(err => {
  if (err) {
    console.error(`Error connecting: ${err.stack}`);
  }
  console.log(`mySql database connected...`);
  loadSupervisor();
});

// load products 
const loadSupervisor = () => {

  connection.query('SELECT * FROM products', (err, res) => {

    if (err) throw err;

    console.table(res);

    supervisorOptions();
  });
}

const supervisorOptions = () => {

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
          'View sales by department',
          'Create new department',
          'Quit'
        ]
      }
    ])
    .then(val => {

      switch (val.choice) {

        case 'View sales by department':
          viewSales();
          break;

        case 'Create new department':
          newDepartment();
          break;

        default:
          console.log(`Goodbye!`);
          process.exit(0);
          break;
      }
    });
}

const viewSales = () => {
  connection.query(
    ' SELECT ' +
    ' d.department_id, ' +
    ' d.department_name, ' +
    ' d.over_head, ' +
    ' SUM(IFNULL(p.product_sales, 0)) as product_sales, ' +
    ' SUM(IFNULL(p.product_sales, 0)) - d.over_head as total_profit ' +
    ' FROM products p ' +
    ' RIGHT JOIN departments d ON p.department_name = d.department_name ' +
    ' GROUP BY ' +
    ' d.department_id, ' +
    ' d.department_name, ' +
    ' d.over_head ',
    (err, res) => {
      console.table(res);
      supervisorOptions();
    }
  );
}

const newDepartment = () => {

  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Please enter the name of the new department?'
      },

      {
        type: 'input',
        name: 'overhead',
        message: 'What is the overhead cost of this department?',
        validate: function (val) {
          return val > 0;
        }
      }
    ])
    .then(val => {
      connection.query(
        'INSERT INTO departments (department_name, over_head) VALUES (?, ?)',
        [val.name, val.overhead],
        err => {
          if (err) throw err;
          console.log(`Added new department!`);
          loadSupervisor();
        }
      );
    });
}