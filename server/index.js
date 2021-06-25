const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const ccavService = require("./ccavenueService");

const SAMPLE_ORDER = {
  order_id: 1288482,
  currency: "INR",
  amount: "100",
  redirect_url: encodeURIComponent(`http://localhost:5000/api/handle-response`),
  billing_name: "John Doe",
};

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());

app.get("/api", (req, res) => {
  res.status(200).send("server is live!");
});

app.get("/api/encrypt", (req, res) => {
  const { payload } = req.query;
  const data = {
    ...SAMPLE_ORDER,
    payload,
  };

  const encryptedData = ccavService.encrypt(data);
  if (encryptedData) {
    res.status(200).json({
      data: encryptedData,
      status: "SUCCESS",
    });
  } else {
    res.status(400).json({
      data: null,
      status: "FAILURE",
    });
  }
});

app.post("/api/handle-response", (req, res) => {
  const { encResp } = req.body;
  const paymentStatus = ccavService.decrypt(encResp).responceCode;

  if (paymentStatus === "Success") {
    res.redirect("/api/payment-success");
  } else {
    res.redirect("/api/payment-failure");
  }
});
app.get("/api/payment-success", (req, res) => {
  res.send("YAY!! Payment Successful...");
});

app.get("/api/payment-failure", (req, res) => {
  res.send("OOPS! Payment Failed...");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
