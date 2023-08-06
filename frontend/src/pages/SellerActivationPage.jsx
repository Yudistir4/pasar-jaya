import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { server } from '../server';

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  console.log('aktivasi token', activation_token);
  console.log({ error });
  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        await axios
          .post(`${server}/shop/seller-activation`, {
            activation_token,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log('errornya nih', err);
            setError(true);
          });
      };
      sendRequest();
    }
  }, [activation_token]);

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {error ? (
        <div className="textx-center flex flex-col justify-center items-center gap-4">
          <p>Your token is expired!</p>
          <Link to={`/`} className="text-blue-500">
            Back to home page
          </Link>
        </div>
      ) : (
        <div className="textx-center flex flex-col justify-center items-center gap-4">
          <p>Your account has been created suceessfully!</p>
          <Link to={`/shop-login`} className="text-blue-500">
            Back to shop login page
          </Link>
        </div>
      )}
    </div>
  );
};

export default SellerActivationPage;
