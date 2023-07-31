import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/styles';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { server } from '../../server';
import { toast } from 'react-toastify';
import { RxCross1 } from 'react-icons/rx';

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [token, setToken] = useState('');
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleOpenPayment = () => {
    const midtransUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';

    let scriptTag = document.createElement('script');
    scriptTag.src = midtransUrl;

    const midtransClientKey = 'SB-Mid-client-cPEvXXaqSJcB69yp';
    scriptTag.setAttribute('data-client-key', midtransClientKey);
    document.body.appendChild(scriptTag);

    if (token) {
      window.snap.pay(token, {
        onSuccess: (result) => {
          localStorage.setItem('Pembayaran', JSON.stringify(result));
          setToken('');
        },
        onPending: (result) => {
          localStorage.setItem('Pembayaran', JSON.stringify(result));
          setToken('');
        },
        onError: (error) => {
          console.log(error);
          setToken('');
        },
        onClose: (result) => {
          console.log('Anda belum menyelesaikan pembayaran');
          setToken('');
        },
      });
    }
    return () => {
      document.body.removeChild(scriptTag);
    };
  };

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem('latestOrder'));
    const token = JSON.parse(localStorage.getItem('tokenPayment'));
    setOrderData(orderData);
    setToken(token);
  }, []);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            description: 'Sunflower',
            amount: {
              currency_code: 'IDR',
              value: orderData?.totalPrice,
            },
          },
        ],
        // not needed if a shipping address is actually needed
        application_context: {
          shipping_preference: 'NO_SHIPPING',
        },
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  };

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details;

      let paymentInfo = payer;

      if (paymentInfo !== undefined) {
        paypalPaymentHandler(paymentInfo);
      }
    });
  };

  console.log('payment');

  const paypalPaymentHandler = async (paymentInfo) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    order.paymentInfo = {
      id: paymentInfo.payer_id,
      status: 'succeeded',
      type: 'Paypal',
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate('/order/success');
        toast.success('Order successful!');
        localStorage.setItem('cartItems', JSON.stringify([]));
        localStorage.setItem('latestOrder', JSON.stringify([]));
        window.location.reload();
      });
  };

  const paymentData = {
    amount: Math.round(orderData?.totalPrice * 100),
  };

  // const paymentHandler = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };

  //     const { data } = await axios.post(
  //       `${server}/payment/process`,
  //       paymentData,
  //       config
  //     );

  //     const client_secret = data.client_secret;

  // if (!stripe || !elements) return;
  // const result = await stripe.confirmCardPayment(client_secret, {
  //   payment_method: {
  //     card: elements.getElement(CardNumberElement),
  //   },
  // });

  // if (result.error) {
  //   toast.error(result.error.message);
  // } else {
  //   if (result.paymentIntent.status === "succeeded") {
  //     order.paymnentInfo = {
  //       id: result.paymentIntent.id,
  //       status: result.paymentIntent.status,
  //       type: "Credit Card",
  //     };

  //     await axios
  //       .post(`${server}/order/create-order`, order, config)
  //       .then((res) => {
  //         setOpen(false);
  //         navigate("/order/success");
  //         toast.success("Order successful!");
  //         localStorage.setItem("cartItems", JSON.stringify([]));
  //         localStorage.setItem("latestOrder", JSON.stringify([]));
  //         window.location.reload();
  //       });
  //   }
  // }
  //   } catch (error) {
  //     toast.error(error);
  //   }
  // };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    order.paymentInfo = {
      type: 'Cash On Delivery',
    };

    await axios
      .post(`${server}/order/create-order`, order, config)
      .then((res) => {
        setOpen(false);
        navigate('/order/success');
        toast.success('Order successful!');
        localStorage.setItem('cartItems', JSON.stringify([]));
        localStorage.setItem('latestOrder', JSON.stringify([]));
        window.location.reload();
      });
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <PaymentInfo
            user={user}
            open={open}
            setOpen={setOpen}
            onApprove={onApprove}
            createOrder={createOrder}
            handleOpenPayment={handleOpenPayment}
            // paymentHandler={paymentHandler}
            cashOnDeliveryHandler={cashOnDeliveryHandler}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const PaymentInfo = ({ open, setOpen, handleOpenPayment }) => {
  // const [select, setSelect] = useState(1);

  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
      <br />
      {/* BCA VA payment */}
      <div>
        {/* pay with payement */}

        <div className="w-full flex border-b">
          <div
            className={`${styles.button} !bg-[#f63b60] text-white h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
            onClick={handleOpenPayment}
          >
            Bayar Sekarang
          </div>
        </div>
      </div>

      <br />
      {/* cash on delivery */}
    </div>
  );
};

const CartData = ({ orderData }) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">
          Rp {orderData?.subTotalPrice}
        </h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          {orderData?.discountPrice ? 'Rp' + orderData.discountPrice : '-'}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        Rp{orderData?.totalPrice}
      </h5>
      <br />
    </div>
  );
};

export default Payment;
