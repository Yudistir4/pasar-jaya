const express = require("express");
const router = express.Router();
const midtransClient = require("midtrans-client");

router.post("/process", (req, res) => {
  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-Q7FpGCUUPpJ7SLvwjB37ojav",
      clientKey: "SB-Mid-client-T3JHYEKPeiE7Cd3y"
    })

    const parameter = {
      transaction_details: {
        order_id: req.body.order_id,
        gross_amount: req.body.amount,
      }
    }

    snap.createTransaction(parameter).then((transaction) => {
      const dataPayment = {
        response: JSON.stringify(transaction)
      }
      
      const token = transaction.token

      res.status(200).json({message: "berhasil", dataPayment, token: token})
    })

  } catch (error) {
    res.status(500).json({message: error.message})
  }
})

module.exports = router;