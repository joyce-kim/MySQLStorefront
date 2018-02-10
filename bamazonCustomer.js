var mysql = require("mysql");
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  // afterConnection();
  getInventory();
});

// gets all inventory data from MySQL database
function getInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // console.log(res);
    promptId(res);
  });
}

function promptId(inventory) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "input",
        message: "What is the ID of the product you would like to buy?",
      }
    ])
    .then(function(val) {
      var inputId = parseInt(val.input);
      // check if id exists, if not then prompt again
      if (checkId(inputId, inventory)) {
        console.log("You have chosen " + productName(inputId, inventory));
        promptQuantity(inputId, inventory);
      } else {
        console.log("A product with that ID does not exist");
        promptId(inventory);
      }
    });
}

function promptQuantity(inputId, inventory) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "input",
        message: "How many units would you like to buy?",
      }
    ])
    .then(function(val) {
      var inputQuantity = parseInt(val.input);
      var remainingQuant = remainingQuantity(inputQuantity, inputId, inventory);

      // check if id exists, if not then prompt again
      if (checkQuantity(inputQuantity, inputId, inventory)) {  
        var updatedQuant = remainingQuant - inputQuantity;

        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: updatedQuant
              },
              {
                item_id: inputId
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Order placed successfully!");
              console.log("Your Total Comes To: $" + caluculateTotal(inputQuantity, inputId, inventory));
              connection.end();
            }
          );
      } else {
        console.log("There is not enough quantity for that order.");
        console.log("Please order " + remainingQuant + " or less");
        promptQuantity(inputId, inventory);
      }
    });
}

function checkId(inputId, inventory) {
  var idExists = false;
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === inputId) {
      idExists = true;
    };
  };
  return idExists;
}

function checkQuantity(inputQuantity, inputId, inventory) {
  var quantityExists = false;
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === inputId) {
      if (parseInt(inventory[i].stock_quantity) >= inputQuantity) {
        quantityExists = true;
      };
    };
  }
  return quantityExists;
}

function productName(inputId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === inputId) {
      return inventory[i].product_name;
    };
  };
}

function caluculateTotal(inputQuantity, inputId, inventory) {
  var totalCost;
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === inputId) {
      totalCost = parseInt(inventory[i].price * inputQuantity);
    };
  }
  return totalCost;
}

function remainingQuantity(inputQuantity, inputId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === inputId) {
      return parseInt(inventory[i].stock_quantity);
    };
  }
}