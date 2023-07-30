import React, { useEffect } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Lottie from "react-lottie";
import animationData from "../Assests/animations/107043-success.json";
import { server } from "../server";
import axios from "axios";
import { useSelector } from "react-redux";

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
  const { user } = useSelector((state) => state.user);

  const orderData = JSON.parse(localStorage.getItem("latestOrder"));
  const order = {
    cart: orderData?.cart,
    shippingAddress: orderData?.shippingAddress,
    user: user && user,
    totalPrice: orderData?.totalPrice,
  }

  const paymentHandler = async () => {
    if (JSON.parse(localStorage.getItem('Pembayaran')).transaction_status === "settlement") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      await axios
        .post(`${server}/order/create-order`, order, config)
        .then((res) => {
          localStorage.setItem("cartItems", JSON.stringify([]));
          localStorage.setItem("latestOrder", JSON.stringify([]));
          localStorage.setItem("Pembayaran", JSON.stringify([]));
          localStorage.setItem("tokenPayment", JSON.stringify([]));
          window.location.reload();
        });
    }
  }

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      <Lottie options={defaultOptions} width={300} height={300} />
      <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
        Your order is successful 😍
      </h5>
      <button onClick={paymentHandler} >Success</button>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccessPage;
