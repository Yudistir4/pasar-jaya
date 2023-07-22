const express = require("express");
const router = express.Router();
const midtransClient = require("midtrans-client");


router.post("/process-transaction", (req, res, next) => {
  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    })

    const parameter = {
      transaction_details: {
        order_id: req.body.order_id,
        gross_amount: req.body.total
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


// var OrderPayment = require("../model/orderPayment");

// let coreApi = new midtransClient.CoreApi({
//   isProduction: false,
//   serverKey: process.env.MIDTRANS_SERVER_KEY,
//   clientKey: process.env.MIDTRANS_CLIENT_KEY
// })

// router.get('/charge', function (req, res, next) {
//   OrderPayment.findAll().then(data => {
//     res.json({
//       status: true,
//       pesan: "Berhasil Tampil",
//       data: data
//     });
//   }).catch(err => {
//     res.json({
//       status: false,
//       pesan: "Gagal Tampil: " + err.message,
//       data: []
//     })
//   })
// });

// router.post('/charge', function (req, res, next) {
//   coreApi.charge(req.body).then((chargeResponse) => {
//     var dataOrder = {
//       order_id: chargeResponse.order_id,
//       nama: req.body.nama,
//       response_midtrans: JSON.stringify(chargeResponse)
//     }

//     OrderPayment.create(dataOrder).then(data => {
//       res.json({
//         status: true,
//         pesan: "Berhasil Tampil",
//         data: data
//       });
//     }).catch(err => {
//       res.json({
//         status: false,
//         pesan: "Gagal Tampil: " + err.message,
//         data: []
//       })
//     })

//   }).catch((e) => {
//     res.json({
//       status: false,
//       pesan: "Gagal Order: " + e.message,
//       data: []
//     });
//   });
// });

module.exports = router;
