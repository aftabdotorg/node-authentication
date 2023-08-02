const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://tester:test123@node-exp-auth.nifyro6.mongodb.net/node-auth";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", (req, res) => res.render("smoothies"));
app.use(authRoutes);

// cookies

app.get("/set-cookies", (req, res) => {
  // res.setHeader("Set-Cookie", "newUser=true"); // ! without cookie parser
  res.cookie("newUser", false); // ! using cookie-parser
  // res.cookie("isEmployee", true, { maxAge: 1000 * 60 * 60 * 24, secure: true });
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });

  res.send("You got the cookies");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);

  res.json(cookies); 
});
