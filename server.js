const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const connection = require("./database");

const app = express();
app.use(
  cors({
    origin: [""],
    methods: ["POST", "GET"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("server running");
});
app.get("/users", (req, res) => {
  const { filterLetters, filterMarks, filterSection, filterRollno } = req.query;

  let sql = "SELECT * FROM firstproject.student";

  if (filterLetters) {
    sql += ` WHERE (Firstname LIKE '%${filterLetters}%' OR Lastname LIKE '%${filterLetters}%')`;
  }

  if (filterMarks) {
    if (filterLetters) {
      sql += " AND";
    } else {
      sql += " WHERE";
    }
    sql += ` Percentage >= ${parseFloat(filterMarks)}`;
  }

  if (filterSection) {
    if (filterLetters || filterMarks) {
      sql += " AND";
    } else {
      sql += " WHERE";
    }
    sql += ` Section LIKE '%${filterSection}%'`;
  }

  if (filterRollno) {
    if (filterLetters || filterMarks || filterSection) {
      sql += " AND";
    } else {
      sql += " WHERE";
    }
    sql += ` Rollno = ${parseInt(filterRollno)}`;
  }

  connection.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/users", (req, res) => {
  const sql = "SELECT * FROM firstproject.student";
  connection.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/users", (req, res) => {
  const { Rollno, Firstname, Lastname, kaksha, Section, Percentage } = req.body;

  const sql = `
    INSERT INTO firstproject.student (Rollno, Firstname, Lastname, kaksha, Section, Percentage)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [Rollno, Firstname, Lastname, kaksha, Section, Percentage],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "Error inserting data into the database" });
      }

      console.log("Data inserted successfully");
      return res.status(200).json({ message: "Data inserted successfully" });
    }
  );
});

app.listen(3000, function () {
  console.log("mahesh");
  connection.connect(function (err) {
    if (err) throw err;
    console.log("success");
  });
});
