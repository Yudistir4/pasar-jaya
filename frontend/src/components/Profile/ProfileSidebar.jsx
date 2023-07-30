import axios from 'axios';
import React from 'react';
import { AiOutlineLogin, AiOutlineMessage } from 'react-icons/ai';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { RxPerson } from 'react-icons/rx';
import { TbAddressBook } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetCart } from '../../redux/actions/cart';
import { server } from '../../server';
import { resetWishlist } from '../../redux/actions/wishlist';
import Cookies from 'js-cookie';

const ProfileSidebar = ({ setActive, active }) => {
  const getCookieHandler = () => {
    const cookieValue = Cookies.get('token');
    console.log('Cookie Value:', cookieValue);
  };
  const dispatch = useDispatch();
  const resetCartHandler = () => {
    dispatch(resetCart());
  };
  const resetWishlistHandler = () => {
    dispatch(resetWishlist());
  };
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const logoutHandler = () => {
    getCookieHandler();
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        getCookieHandler();
        resetCartHandler();
        resetWishlistHandler();
        window.location.reload(true);
        // navigate('/login');
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  return (
    <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(1)}
      >
        <RxPerson size={20} color={active === 1 ? '#F8981D' : ''} />
        <span
          className={`pl-3 ${
            active === 1 ? 'text-[#F8981D]' : ''
          } 800px:block hidden`}
        >
          Data Diri
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag size={20} color={active === 2 ? '#F8981D' : ''} />
        <span
          className={`pl-3 ${
            active === 2 ? 'text-[#F8981D]' : ''
          } 800px:block hidden`}
        >
          Pesanan
        </span>
      </div>
      {/* <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund size={20} color={active === 3 ? "#F8981D" : ""} />
        <span
          className={`pl-3 ${
            active === 3 ? "text-[#F8981D]" : ""
          } 800px:block hidden`}
        >
          Pengembalian dana
        </span>
      </div> */}

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(4) || navigate('/inbox')}
      >
        <AiOutlineMessage size={20} color={active === 4 ? '#F8981D' : ''} />
        <span
          className={`pl-3 ${
            active === 4 ? 'text-[#F8981D]' : ''
          } 800px:block hidden`}
        >
          Pesan Masuk
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(5)}
      >
        <MdOutlineTrackChanges
          size={20}
          color={active === 5 ? '#F8981D' : ''}
        />
        <span
          className={`pl-3 ${
            active === 5 ? 'text-[#F8981D]' : ''
          } 800px:block hidden`}
        >
          Lacak Pesanan
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(6)}
      >
        <RiLockPasswordLine size={20} color={active === 6 ? '#F8981D' : ''} />
        <span
          className={`pl-3 ${
            active === 6 ? 'text-[#F8981D]' : ''
          } 800px:block hidden`}
        >
          Ganti Password
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(7)}
      >
        <TbAddressBook size={20} color={active === 7 ? '#F8981D' : ''} />
        <span
          className={`pl-3 ${
            active === 7 ? 'text-[#F8981D]' : ''
          } 800px:block hidden`}
        >
          Alamat
        </span>
      </div>

      {user && user?.role === 'Admin' && (
        <Link to="/admin/dashboard">
          <div
            className="flex items-center cursor-pointer w-full mb-8"
            onClick={() => setActive(8)}
          >
            <MdOutlineAdminPanelSettings
              size={20}
              color={active === 7 ? '#F8981D' : ''}
            />
            <span
              className={`pl-3 ${
                active === 8 ? 'text-[#F8981D]' : ''
              } 800px:block hidden`}
            >
              Admin Dashboard
            </span>
          </div>
        </Link>
      )}
      <div
        className="single_item flex items-center cursor-pointer w-full mb-8"
        onClick={logoutHandler}
      >
        <AiOutlineLogin size={20} color={active === 8 ? '#F8981D' : ''} />
        <span
          className={`pl-3 ${
            active === 8 ? 'text-[#F8981D]' : ''
          } 800px:block hidden`}
        >
          Keluar
        </span>
      </div>
    </div>
  );
};

export default ProfileSidebar;
