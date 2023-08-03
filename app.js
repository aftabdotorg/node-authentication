require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const port = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI = process.env.DBURI;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(port))
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);

// cookies
/*
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
*/
