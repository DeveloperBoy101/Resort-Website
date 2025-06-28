
if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}
console.log(process.env) ;

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js"); // ✅ Added users route
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./Models/user.js");
const app = express();
const port = 8080;
const mongo_Url = "mongodb://127.0.0.1:27017/WanderLust";

// MongoDB Connection
async function main() {
  try {
    await mongoose.connect(mongo_Url);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}
mongoose.connection.on("error", (err) => console.error("MongoDB Error:", err));
main();

// Middleware Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); // ✅ Ensure public folder exists
app.engine("ejs", ejsMate);

const sessionOptions = {
  secret: "Mysecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash Messages Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Routes
app.use("/", users);  // ✅ Users route added
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// 404 Error Handling
app.all("*", (req, res, next) => next(new ExpressError(404, "Page Not Found")));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).render("error.ejs", { err });
});

app.listen(port, () => console.log(`Server is running on localhost:${port}`));
