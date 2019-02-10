
// dependencies
const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

// __________

// config connection to mysql database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'W!nt3rL1nk',
  database: 'bamazon'
});

// create server connection, if successful, load manager menu
connection.connect(err => {

  if (err) {
    console.error(`Error connecting: ${err.stack}`);
  }

  loadManager();
});

// __________

const loadManager = () => {
  connection.query('SELECT * FROM products', function (err, res) {

    if (err) throw err;

    managerOptions(res);
  });
}

// __________

const managerOptions = products => {
  inquirer
    .prompt({
      type: 'list',
      name: 'choice',
      choices: ['Products for sale', 'Low stock', 'Restock', 'New product', 'Quit'],
      message: 'What would you like to do?'
    })
    .then(val => {
      switch (val.choice) {

        case 'Products for sale':
          console.table(products);
          loadManager();
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
          console.log(`Goodbye!`);
          process.exit(0);
          break;
      }
    });
}

// ___________

const lowStock = () => {
  connection.query('SELECT * FROM products WHERE stock_quantity <= 5', (err, res) => {
    if (err) throw err;

    console.table(res);
    loadManager();
  });
}

// ___________

const restock = stock => {
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
    .then(val => {
      let choiceId = parseInt(val.choice);
      let product = checkStock(choiceId, stock);

      if (product) {
        howMany(product);

      } else {
        console.log(`\nInvalid item_id.`);
        loadManager();
      }

    });
}

const howMany = product => {
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
    .then(val => {
      let quantity = parseInt(val.quantity);
      updateStock(product, quantity);
    });
}

const updateStock = (product, quantity) => {
  connection.query(
    'UPDATE products SET stock_quantity = ? WHERE item_id = ?',
    [product.stock_quantity + quantity, product.item_id],
    function (err, res) {
      console.log(`\nRestock successful, ${quantity} ${product.product_name}'s added!\n`);
      loadManager();
    }
  );
}

const newProduct = (products) => {
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

const updateProducts = (val) => {
  connection.query(
    'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)',
    [val.product_name, val.department_name, val.price, val.quantity],
    (err, res) => {
      if (err) throw err;
      console.log(`${val.product_name} New product added!\n`);
      loadManager();
    }
  );
}

// ___________

const allDepartments = products => {
  let departments = [];
  for (let i = 0; i < products.length; i++) {
    if (departments.indexOf(products[i].department_name) === -1) {
      departments.push(products[i].department_name);
    }
  }
  return departments;
}

// ___________

const checkStock = (choiceId, stock) => {
  for (let i = 0; i < stock.length; i++) {
    if (stock[i].item_id === choiceId) {
      return stock[i];
    }
  }
  return null;
}