const Shop = require('../model/shop');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const express = require('express');
const { isSeller, isAuthenticated, isAdmin } = require('../middleware/auth');
const Withdraw = require('../model/withdraw');
const sendMail = require('../utils/sendMail');
const router = express.Router();

// create withdraw request --- only for seller
router.post(
  '/create-withdraw-request',
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { amount } = req.body;
      // console.log(req.seller);
      // return next(new ErrorHandler(error.message, 500));

      const data = {
        seller: req.seller._id,
        amount,
      };

      try {
        await sendMail({
          email: req.seller.email,
          subject: 'Withdraw Request',
          message: `Hello ${req.seller.name}, Your withdraw request of ${amount}$ is processing. It will take 3days to 7days to processing! `,
        });
        res.status(201).json({
          success: true,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }

      const withdraw = await Withdraw.create(data);

      // const shop = await Shop.findById(req.seller._id);

      // shop.availableBalance = shop.availableBalance - amount;

      // await shop.save();

      res.status(201).json({
        success: true,
        withdraw,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all withdraws --- admnin

router.get(
  '/get-all-withdraw-request',
  isAuthenticated,
  isAdmin('Admin'),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const withdraws = await Withdraw.find()
        .populate('seller')
        .sort({ createdAt: -1 });

      res.status(201).json({
        success: true,
        withdraws,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update withdraw request ---- admin
router.put(
  '/update-withdraw-request/:id',
  isAuthenticated,
  isAdmin('Admin'),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { sellerId, status } = req.body;

      let withdraw = await Withdraw.findById(req.params.id);
      withdraw.status = status;
      await withdraw.save();

      if (status === 'Berhasil') {
        const seller = await Shop.findById(sellerId);
        seller.availableBalance -= withdraw.amount;
        await seller.save();

        try {
          await sendMail({
            email: seller.email,
            subject: 'Payment confirmation',
            message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount} is successfully sent`,
          });
        } catch (error) {
          console.log('Error 1: ' + error.message);

          return next(new ErrorHandler(error.message, 500));
        }
        res.status(201).json({
          success: true,
          withdraw,
        });
      } else if (status === 'Gagal') {
        const seller = await Shop.findById(sellerId);
        try {
          await sendMail({
            email: seller.email,
            subject: 'Payment confirmation',
            message: `Hello ${seller.name}, Your withdraw request of ${withdraw.amount} is failed`,
          });
        } catch (error) {
          console.log('Error 2: ' + error.message);

          return next(new ErrorHandler(error.message, 500));
        }
        res.status(201).json({
          success: true,
          withdraw,
        });
      }

      // const transection = {
      //   _id: withdraw._id,
      //   amount: withdraw.amount,
      //   updatedAt: withdraw.updatedAt,
      //   status: withdraw.status,
      // };
      // seller.transections = [...seller.transections, transection];
    } catch (error) {
      console.log('Error 3: ' + error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
