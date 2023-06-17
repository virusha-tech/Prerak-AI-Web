const express = require("express");
const rateLimit = require("express-rate-limit");
// const requestIp = require("request-ip");
// const db = require("./models");
// const Ip = db.ip;

const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200 // maximum of 200 requests per windowMs
});

let app = express.Router();

// const authJwt = require("./auth/authJwt");
// const openai = require("./middlewares/openai");
app.use("/services", require("./services"));

// // Webhooks and things
// app.use("/stripe", require("./stripe"));
// app.use("/", apiLimiter);

// app.use("/free", requestIp.mw());

// app.get("/free/guest", function(req, res) {
//   const ipAddress = req.clientIp;

//   Ip.findOne({ ipAddress }, (err, existingIp) => {
//     if (err) {
//       console.error(err);
//       res.send({ err });
//     } else if (existingIp) {
//       const { credits } = existingIp;
//       console.log("IP already exists in database");
//       res.send({ fname: "Guest", credits });
//     } else {
//       const credits = 200;
//       const newIp = new Ip({ ipAddress, credits });
//       newIp.save(err => {
//         if (err) {
//           console.error(err);
//         } else {
//           console.log("New IP saved to database");
//           res.send({ fname: "Guest", credits });
//         }
//       });
//     }
//   });
// });

// app.use("/free", require("./free"));
app.use("/ai", require("./ai/subsequentQuestion"));

// // Signup and Authentication
// app.use("/auth", require("./auth"));

// // Everything after this requires user authentication
// app.use("/", authJwt.verifyToken);

// // Already signed up user routes
// app.use("/user", require("./user"));

// app.use("/getAdminHistory", require("./getAdminHistory"));
// app.use("/getPlanForIthUser", require("./getPlanForIthUser"));
// app.use("/getMyPlans", require("./getMyPlans"));
// app.use("/getMyUsers", require("./getMyUsers"));
// app.use(
//   "/getAdminDashBoardInformation",
//   require("./getAdminDashBoardInformation")
// );

// // Using AI Platform
// app.use("/ai", require("./ai"));

module.exports = app;
