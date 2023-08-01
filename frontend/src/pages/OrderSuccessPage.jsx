import React, { useEffect } from 'react';
import Footer from '../components/Layout/Footer';
import Header from '../components/Layout/Header';
import Lottie from 'react-lottie';
import animationData from '../Assests/animations/107043-success.json';
import { server } from '../server';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { resetCart } from '../redux/actions/cart';

const OrderSuccessPage = () => {
  return (
    <div>
      <Header />
      <Success />
      <Footer />
    </div>
  );
};

const Success = () => {
  const dispatch = useDispatch();
  const resetCartHandler = () => {
    dispatch(resetCart());
  };
  const { user } = useSelector((state) => state.user);
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // useEffect

  useEffect(() => {
    const createOrder = async () => {
      const orderData = JSON.parse(localStorage.getItem('latestOrder'));
      const order = {
        cart: orderData?.cart,
        shippingAddress: orderData?.shippingAddress,
        user: user && user,
        totalPrice: orderData?.totalPrice,
      };
      order.paymentInfo = {
        // id: 1,
        status: 'succeeded',
        // type: 'Paypal',
      };
      if (order) {
        await axios.post(`${server}/order/create-order`, order).then((res) => {
          console.log('create-order success');
          localStorage.setItem('cartItems', JSON.stringify([]));
          localStorage.setItem('latestOrder', JSON.stringify(null));
          resetCartHandler();
        });
      }
    };
    createOrder();
  }, [resetCartHandler]);

  return (
    <div>
      <Lottie options={defaultOptions} width={300} height={300} />
      <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
        Your order is successful 😍
      </h5>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccessPage;
