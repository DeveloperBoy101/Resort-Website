// const express = require("express");
// // const cookieParser = require("cookie-parser")
// const app = express();
// const session = require("express-session");
// //
// // app.use(cookieParser("secretcode"));
// app.listen(3000, () => {
//   console.log("App is listening on port 3000");
// });

// app.use(
//   session({
//     secret: "My-super-secret",
//     resave: false,
//     saveUninitialized: true,
//   })
// );

// app.get("/test", (req, res) => {
//   res.send("Test success");
// });

// app.get("/requestcount",(req,res)=>{
//     if(req.session.count) {
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     } 
//     res.send(`You sent a request a ${req.session.count} time`)
// })
// // app.get("/getCookie", (req, res) => {
// // res.cookie("greet", "Hello");
// // res.cookie("origin", "India");
// // res.send("You are at the cookie route");
// // });
// //
// // app.get("/verify",(req,res)=>{
// // console.dir(req.cookies);
// // res.send("vERIFIED")
// // })
// //
// // app.get("/getsignedCookie",(req,res)=>{
// // res.cookie("made-in","India", {signed : true});
// // res.send("Signed cookie send");
// // })
// //
// //
// // app.get("/user",(req,res)=>{
// // console.dir(req.cookies);
// // res.send("Hello user ")
// // });
// //
// // app.get("/user/:id",(req,res)=>{
// // let { id } = req.params;
// // res.send(`Hello user with id of${id}`)
// // })
// //
// // app.get("/greet",(req,res)=>{
// // let { name= "anonymus"} = req.cookies;
// // res.send(`Hi ${name}`);
// // });
// //
// // SEND SIGNED COOKIES..
// //
// //
const express = require("express");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});

const sessionOptions = {
  secret: "Secret",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;
  req.flash("success", "User registered successfully");
  res.redirect("/hello");
});
app.get("/hello", (req, res) => {
  let message = req.flash("success");
  res.render("page.ejs", { name: req.session.name, message });
});
