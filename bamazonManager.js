
// init npm
var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

// __________

// init connection, sync w/db
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'W!nt3rL1nk',
  database: 'bamazon'
});

// create server connection and load manager menu
connection.connect(function (err) {

  if (err) {
    console.error('Error connecting: ' + err.stack);
  }

  managerMenu();
});

// __________

function managerMenu() {
  connection.query('SELECT * FROM products', function (err, res) {

    if (err) throw err;

    managerOptions(res);
  });
}

// __________

function managerOptions(products) {
  inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      choices: ['Products for sale', 'Low stock', 'Restock', 'New product', 'Quit'],
      message: 'What would you like to do?'
    })
    .then(function (val) {
      switch (val.choice) {

        case 'Products for sale':
          console.table(products);
          managerMenu();
          break;

        case 'Low stock':
          lowStock();
          break;

        case 'Restock':
          restock(products);
          break;

        case 'New product':
          newProduct(products);
          break;

        default:
          console.log('Goodbye!');
          process.exit(0);
          break;
      }
    });
}

// ___________

function lowStock() {
  connection.query('SELECT * FROM products WHERE stock_quantity <= 5', function (err, res) {
    if (err) throw err;

    console.table(res);
    managerMenu();
  });
}

// ___________

function restock(stock) {
  console.table(stock);
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'choice',
        message: 'What would you like to restock? (Enter item_id)',
        validate: function (val) {
          return !isNaN(val);
        }
      }
    ])
    .then(function (val) {
      var choiceId = parseInt(val.choice);
      var product = checkStock(choiceId, stock);

      if (product) {
        howMany(product);

      } else {
        console.log('\nInvalid item_id.');
        managerMenu();
      }

    });
}

function howMany(product) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'quantity',
        message: 'How many would you like to add?',
        validate: function (val) {
          return val > 0;
        }
      }
    ])
    .then(function (val) {
      var quantity = parseInt(val.quantity);
      updateStock(product, quantity);
    });
}

function updateStock(product, quantity) {
  connection.query(
    'UPDATE products SET stock_quantity = ? WHERE item_id = ?',
    [product.stock_quantity + quantity, product.item_id],
    function (err, res) {
      console.log('\nRestock successful, ' + quantity + ' ' + product.product_name + "'s added!\n");
      managerMenu();
    }
  );
}

function newProduct(products) {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'product_name',
        message: 'What is the name of your new product?'
      },

      {
        type: 'list',
        name: 'department_name',
        choices: allDepartments(products),
        message: 'Which department should we add this product to?'
      },

      {
        type: 'input',
        name: 'price',
        message: 'What is the cost of this product?',
        validate: function (val) {
          return val > 0;
        }
      },

      {
        type: 'input',
        name: 'quantity',
        message: 'How many do we have on hand?',
        validate: function (val) {
          return !isNaN(val);
        }
      }
    ])
    .then(updateProducts);
}

// __________

function updateProducts(val) {
  connection.query(
    'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)',
    [val.product_name, val.department_name, val.price, val.quantity],
    function (err, res) {
      if (err) throw err;
      console.log(val.product_name + 'New product added!\n');
      managerMenu();
    }
  );
}

// ___________

function allDepartments(products) {
  var departments = [];
  for (var i = 0; i < products.length; i++) {
    if (departments.indexOf(products[i].department_name) === -1) {
      departments.push(products[i].department_name);
    }
  }
  return departments;
}

// ___________

function checkStock(choiceId, stock) {
  for (var i = 0; i < stock.length; i++) {
    if (stock[i].item_id === choiceId) {
      return stock[i];
    }
  }return null;
}