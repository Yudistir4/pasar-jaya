const mongoose = require("mongoose");

const orderPaymentSchema = new mongoose.Schema({
  order_id: {
    type: String
  },
  nama: {
    type: String
  },
  response_midtrans: {
    type: String
  }
});

module.exports = mongoose.model("orderPayment", orderPaymentSchema);