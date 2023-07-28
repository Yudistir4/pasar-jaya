import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../styles/styles';
import heroImg from '../../../Assests/image/hero.jpg';

const Hero = () => {
  return (
    <div
      className={`relative min-h-[50vh]  w-full bg-no-repeat ${styles.noramlFlex}`}
      style={{
        backgroundImage: `url(${heroImg})`,
      }}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        style={{ zIndex: 1 }}
      ></div>
      <div
        className={`${styles.section} w-[90%] 800px:w-[60%]`}
        style={{ zIndex: 3 }}
      >
        <h1
          className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#eeeeee] font-[600] capitalize `}
        >
          Pasar Cidodol
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#dbdbdb]">
          Tempat berbelanja bahan pangan terbaik <br /> Menyediakan mulai dari
          sayur segar, buah segar, protein, hingga bumbu dapur <br />
        </p>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#ffffff] font-[Poppins] text-[18px]">
              Belanja !
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
