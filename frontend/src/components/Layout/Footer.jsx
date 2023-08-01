import React from 'react';
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from 'react-icons/ai';

import logo from '../../Assests/image/logo.png';

const Footer = () => {
  return (
    <div className="bg-[#000] text-white flex flex-col items-center gap-4 justify-center p-4 ">
      <img
        src={logo}
        alt=""
        className="w-36"
        style={{ filter: 'brightness(0) invert(1)' }}
      />

      <p className="max-w-xl text-center">
        Menjadikan Pasar Bersih sehat dan bersaing secara agronomis, dan menekan
        inflasi daerah khususnya Jakarta Kota Kolaborasi
      </p>
      <div className="flex items-center  ">
        <a href="https://www.facebook.com/perumdapasarjaya/?locale=id_ID">
          <AiFillFacebook size={25} />
        </a>
        <a href="https://twitter.com/PasarJaya_JKT">
          <AiOutlineTwitter size={25} />
        </a>
        <a href="https://www.instagram.com/perumdapasarjaya">
          <AiFillInstagram size={25} />
        </a>
        <a href="https://www.youtube.com/channel/UCCOnPoX8YzkMdBfikcSSjzA">
          <AiFillYoutube size={25} />
        </a>
      </div>

      <span>© 2023 Pasa Jaya. All rights reserved.</span>
    </div>
  );
};

export default Footer;
