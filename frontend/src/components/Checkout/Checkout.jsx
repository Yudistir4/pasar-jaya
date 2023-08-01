import React, { useState } from 'react';
import styles from '../../styles/styles';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import { server } from '../../server';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
const ongkirList = {
  'Jakarta Utara': 25000,
  'Jakarta Timur': 22000,
  'Jakarta Selatan': 10000,
  'Jakarta Barat': 20000,
  'Jakarta Pusat': 21000,
};

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [ongkir, setOngkir] = useState(0);
  const [zipCode, setZipCode] = useState('');
  const [token, setToken] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);

  const navigate = useNavigate();
  // const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    if (city) {
      setOngkir(ongkirList[city]);
    }
  }, [city]);

  useEffect(() => {
    const midtransUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';
    let scriptTag = document.createElement('script');
    scriptTag.src = midtransUrl;

    const midtransClientKey = 'SB-Mid-client-cPEvXXaqSJcB69yp';
    scriptTag.setAttribute('data-client-key', midtransClientKey);
    document.body.appendChild(scriptTag);

    // return () => {
    //   document.body.removeChild(scriptTag);
    // };
  }, []);

  // useEffect(() => {
  //   const orderData = JSON.parse(localStorage.getItem('latestOrder'));
  //   console.log(orderData);
  //   setOrderData(orderData);
  // }, []);

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const discountPercentenge = couponCodeData ? discountPrice : '';

  let totalPrice = couponCodeData
    ? subTotalPrice - discountPercentenge
    : subTotalPrice;

  totalPrice += ongkir;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  console.log(totalPrice);
  const handleOpenPayment = (token) => {
    if (token) {
      window.snap.pay(token, {
        onSuccess: (result) => {
          console.log('success:', result);
          console.log('success:', result.order_id);
          navigate(
            `/order/success?order_id=${result.order_id}&transaction_status=${result.transaction_status}`
          );
        },
        onPending: (result) => {
          console.log('pending:', result);
        },
        onError: (error) => {
          console.log('error:', error);
          console.log(error);
        },
        onClose: (result) => {
          console.log('close:', result);
          console.log('Anda belum menyelesaikan pembayaran');
        },
      });
    }
  };

  const paymentSubmit = async () => {
    if (address1 === '' || zipCode === '' || city === '') {
      toast.error('Some field is empty');
      return;
    }

    const data = {
      order_id: uuidv4(),
      total: totalPrice,
    };

    const response = await axios.post(
      `${server}/payment/process-transaction`,
      data
    );

    console.log('responnya nih ', response);
    const token = response.data.token;

    handleOpenPayment(token);
    setToken(token);
    const shippingAddress = {
      address1,
      zipCode,
      city,
    };

    const orderData = {
      cart,
      totalPrice,
      subTotalPrice,
      // shipping,
      discountPrice,
      shippingAddress,
      user,
    };
    console.log({ orderData });
    localStorage.setItem('latestOrder', JSON.stringify(orderData));
    // localStorage.setItem('tokenPayment', JSON.stringify(token));
    // navigate('/payment');
  };

  // this is shipping cost variable

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error('Coupon code is not valid for this shop');
          setCouponCode('');
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          // setCouponCode('');
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exists!");
        setCouponCode('');
      }
    });
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            couponCodeData={couponCodeData}
            token={token}
            user={user}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            city={city}
            setCity={setCity}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            couponCodeData={couponCodeData}
            ongkir={ongkir}
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
            handleOpenPayment={handleOpenPayment}
            paymentSubmit={paymentSubmit}
            token={token}
          />
        </div>
      </div>

      {/* {token ? (
        <div
          className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
          onClick={paymentSubmit}
        >
          <h5 className="text-white">Menuju ke Pembayaran</h5>
        </div>
      ) : (
        <div
          className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
          onClick={processPayment}
        >
          <h5 className="text-white">Simpan Pesanan</h5>
        </div>
      )} */}
    </div>
  );
};

const ShippingInfo = ({
  couponCodeData,
  user,
  token,
  city,
  setCity,
  address1,
  setAddress1,
  setAddress2,
  zipCode,
  setZipCode,
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Pengiriman</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Nama Lengkap</label>
            <input
              type="text"
              value={user && user.name}
              required
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Alamat Email</label>
            <input
              type="email"
              value={user && user.email}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Nomor Telepon</label>
            <input
              type="text"
              required
              value={user && user.phoneNumber}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Pilih dari alamat tersimpan</label>

            <select
              disabled={!!token}
              className="w-[95%] border h-[40px] rounded-[5px]"
              onChange={(e) => {
                user?.addresses.forEach((item) => {
                  if (item.addressType === e.target.value) {
                    setCity(item.city);
                    setAddress1(item.address1);
                    setAddress2(item.address2);
                    setZipCode(item.zipCode);
                  } else if (e.target.value === '') {
                    setCity('');
                    setAddress1('');
                    setAddress2('');
                    setZipCode('');
                  }
                });
              }}
            >
              <option className="block pb-2" value="">
                Pilih Alamat
              </option>
              {user?.addresses.map((item) => (
                <option
                  key={item.addressType}
                  className="block pb-2"
                  value={item.addressType}
                >
                  {item.addressType}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Alamat</label>
            <input
              type="text"
              required
              disabled={!!token}
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Kode Pos</label>
            <input
              disabled={!!token}
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
          {/* <div className="w-[50%]">
            <label className="block pb-2">Alamat 2</label>
            <input
              type="address"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div> */}
        </div>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Kota</label>
            <select
              disabled={!!token}
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option className="block pb-2" value="">
                Pilih Kota
              </option>
              <option className="block pb-2" value="Jakarta Barat">
                Jakarta Barat
              </option>
              <option className="block pb-2" value="Jakarta Timur">
                Jakarta Timur
              </option>
              <option className="block pb-2" value="Jakarta Utara">
                Jakarta Utara
              </option>
              <option className="block pb-2" value="Jakarta Selatan">
                Jakarta Selatan
              </option>
              <option className="block pb-2" value="Jakarta Pusat">
                Jakarta Pusat
              </option>
            </select>
          </div>
        </div>
      </form>

      {/* <h5
        className="text-[18px] cursor-pointer inline-block"
        onClick={() => setUserInfo(!userInfo)}
      >
        Pilih dari Alamat Tersimpan
      </h5>
      {userInfo && (
        <div>
          {user &&
            user.addresses.map((item, index) => (
              <div key={index} className="w-full flex mt-1">
                <input
                  type="checkbox"
                  className="mr-3"
                  value={item.addressType}
                  onClick={() => {
                    setCity(item.city);
                    setAddress1(item.address1);
                    setAddress2(item.address2);
                    setZipCode(item.zipCode);
                  }}
                />
                <h2>{item.addressType}</h2>
              </div>
            ))}
        </div>
      )} */}
    </div>
  );
};

const CartData = ({
  ongkir,
  handleSubmit,
  totalPrice,
  token,
  handleOpenPayment,
  paymentSubmit,
  subTotalPrice,
  couponCode,
  setCouponCode,
  couponCodeData,
  discountPercentenge,
}) => {
  const disableVoucherInput = [!!couponCodeData, !!token].some(
    (val) => val === true
  );

  console.log({ disableVoucherInput, couponCode });
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Subtotal:</h3>
        <h5 className="text-[18px] font-[600]">Rp {subTotalPrice}</h5>
      </div>
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Ongkir</h3>
        <h5 className="text-[18px] font-[600]">Rp {ongkir}</h5>
      </div>
      <br />
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Diskon:</h3>
        <h5 className="text-[18px] font-[600]">
          - {discountPercentenge ? 'Rp' + discountPercentenge.toString() : null}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">Rp {totalPrice}</h5>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          disabled={disableVoucherInput}
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Kode Voucher"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        {!disableVoucherInput && (
          <input
            className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
            required
            value="Gunakan Voucher"
            type="submit"
          />
        )}
      </form>
      <div
        className={`${styles.button} w-full `}
        onClick={
          () => {
            if (token) {
              handleOpenPayment(token);
            } else {
              paymentSubmit();
            }
          }
          // handleOpenPayment
        }
      >
        <h5 className="text-white">Bayar Sekarang</h5>
      </div>
    </div>
  );
};

export default Checkout;
