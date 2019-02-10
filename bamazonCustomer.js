
// dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

// ___________

// connect to sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "W!nt3rL1nk",
  database: "bamazon"
});

// ___________

// create server connection, if successful, load data
connection.connect(err => {

  if (err) {
    console.error(`Error connecting: ${err.stack}`);
  }

  loadProducts();
});

// ___________

// load table and print results
const loadProducts = () => {

  connection.query("SELECT * FROM products", (err, res) => {
    if (err) throw err;

    console.table(res);

    whatWouldYouLikeToBuy(res);
  });
}

// ___________

const whatWouldYouLikeToBuy = (stock) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "choice",
        message: "What item would you like to purchase? (Enter the \"ID#\") [Press Q to quit]",
        validate: function (val) {
          return !isNaN(val) || val.toLowerCase() === "q";
        }
      }
    ])
    .then(val => {

      checkQuit(val.choice);

      let choiceId = parseInt(val.choice);
      let product = checkStock(choiceId, stock);

      if (product) {
        howManyToBuy(product);

      } else {
        console.log("\nSorry, that item ID is does not exist.");
        loadProducts();
      }
    });
}

// __________

const howManyToBuy = (product) => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like to purchase? [Press Q to quit]",
        validate: function (val) {
          return val > 0 || val.toLowerCase() === "q";
        }
      }
    ])
    .then(val => {
      checkQuit(val.quantity);

      let quantity = parseInt(val.quantity);

      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        loadProducts();

      } else {
        confirmPurchase(product, quantity);
      }
    });
}

// __________

const confirmPurchase = (product, quantity) => {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    (err, res) => {
      console.log(`\nPurchase Successful ${quantity} ${product.product_name}'s!`);
      loadProducts();
    }
  );
}

// __________

const checkStock = (choiceId, stock) => {
  for (let i = 0; i < stock.length; i++) {
    if (stock[i].item_id === choiceId) {
      return stock[i];
    }
  }
  return null;
}

const checkQuit = choice => {
  if (choice.toLowerCase() === "q") {
    console.log("Goodbye!");
    process.exit(0);
  }
}