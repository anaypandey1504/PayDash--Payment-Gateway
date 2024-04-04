const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "anay1504",
  database: "walletdatabase",
});

connection.connect();
app.post("/submit-wallet", (req, res) => {
  const wallet_name = req.body.wallet_name;
  const wallet_username = req.body.wallet_username;

  console.log("Received Wallet data:", wallet_name, wallet_username);

  // Check if wallet details already exist in the database
  connection.query(
    "SELECT * FROM wallet WHERE wallet_name = ? AND wallet_username = ?",
    [wallet_name, wallet_username],
    (error, results, fields) => {
      if (error) {
        console.error("Error querying database:", error);
        return res.status(500).send("An error occurred while processing wallet data");
      }

      if (results.length > 0) {
        // Wallet details already exist
        console.log("Wallet data already exists:", wallet_name, wallet_username);
        return res.status(400).send("Wallet data already exists");
      } else {
        // Insert wallet details into the database
        connection.query(
          "INSERT INTO wallet(wallet_name, wallet_username) VALUES (?, ?)",
          [wallet_name, wallet_username],
          (insertError, insertResults, insertFields) => {
            if (insertError) {
              console.error("Error inserting Wallet data into database:", insertError);
              return res.status(500).send("Error inserting Wallet data into database");
            }

            console.log("Wallet data inserted successfully:", wallet_name, wallet_username);

            res.send("Wallet data inserted successfully");
          }
        );
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
