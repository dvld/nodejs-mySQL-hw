
// init npm
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// ___________

// init connection, sync w/ db
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "W!nt3rL1nk",
  database: "bamazon"
});

// ___________

// create server connection and load data
connection.connect(function (err) {

  if (err) {
    console.error("Error connecting: " + err.stack);
  }

  loadProducts();
});

// ___________

// load table and print results
function loadProducts() {

  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    console.table(res);

    whatWouldYouLikeToBuy(res);
  });
}

// ___________

function whatWouldYouLikeToBuy(stock) {
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
    .then(function (val) {

      checkQuit(val.choice);

      var choiceId = parseInt(val.choice);
      var product = checkStock(choiceId, stock);

      if (product) {
        howManyToBuy(product);

      } else {
        console.log("\nSorry, that item ID is does not exist.");
        loadProducts();
      }
    });
}

// __________

function howManyToBuy(product) {
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
    .then(function (val) {
      checkQuit(val.quantity);

      var quantity = parseInt(val.quantity);

      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        loadProducts();

      } else {
        confirmPurchase(product, quantity);
      }
    });
}

// __________

function confirmPurchase(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    function (err, res) {
      console.log("\nPurchase Successful " + quantity + " " + product.product_name + "'s!");
      loadProducts();
    }
  );
}

// __________

function checkStock(choiceId, stock) {
  for (var i = 0; i < stock.length; i++) {
    if (stock[i].item_id === choiceId) {
      return stock[i];
    }
  }
  return null;
}

function checkQuit(choice) {
  if (choice.toLowerCase() === "q") {
    console.log("Goodbye!");
    process.exit(0);
  }
}