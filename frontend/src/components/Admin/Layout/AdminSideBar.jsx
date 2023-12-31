import React from 'react';
import { FiLogOut, FiShoppingBag } from 'react-icons/fi';
import { GrWorkshop } from 'react-icons/gr';
import { RxDashboard } from 'react-icons/rx';
import { CiMoneyBill, CiSettings } from 'react-icons/ci';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { BsHandbag } from 'react-icons/bs';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { AiOutlineSetting } from 'react-icons/ai';
import axios from 'axios';
import { server } from '../../../server';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { resetCart } from '../../../redux/actions/cart';
import { resetWishlist } from '../../../redux/actions/wishlist';

const AdminSideBar = ({ active }) => {
  // const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const resetCartHandler = () => {
    dispatch(resetCart());
  };
  const resetWishlistHandler = () => {
    dispatch(resetWishlist());
  };
  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        resetCartHandler();
        resetWishlistHandler();
        window.location.reload(true);
        navigate('/login');
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  return (
    <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      {/* single item */}
      <div className="w-full flex items-center p-4">
        <Link to="/admin/dashboard" className="w-full flex items-center">
          <RxDashboard
            size={30}
            color={`${active === 1 ? 'crimson' : '#555'}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 1 ? 'text-[crimson]' : 'text-[#555]'
            }`}
          >
            Dasboard
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin-orders" className="w-full flex items-center">
          <FiShoppingBag
            size={30}
            color={`${active === 2 ? 'crimson' : '#555'}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 2 ? 'text-[crimson]' : 'text-[#555]'
            }`}
          >
            Semua Pesanan
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin-sellers" className="w-full flex items-center">
          <GrWorkshop
            size={30}
            color={`${active === 3 ? 'crimson' : '#555'}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 3 ? 'text-[crimson]' : 'text-[#555]'
            }`}
          >
            Semua Pedagang
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin-users" className="w-full flex items-center">
          <HiOutlineUserGroup
            size={30}
            color={`${active === 4 ? 'crimson' : '#555'}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 4 ? 'text-[crimson]' : 'text-[#555]'
            }`}
          >
            Semua Pengguna
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <Link to="/admin-products" className="w-full flex items-center">
          <BsHandbag size={30} color={`${active === 5 ? 'crimson' : '#555'}`} />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 5 ? 'text-[crimson]' : 'text-[#555]'
            }`}
          >
            Semua Produk
          </h5>
        </Link>
      </div>

      {/* <div className="w-full flex items-center p-4">
        <Link to="/admin-events" className="w-full flex items-center">
          <MdOutlineLocalOffer
            size={30}
            color={`${active === 6 ? 'crimson' : '#555'}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 6 ? 'text-[crimson]' : 'text-[#555]'
            }`}
          >
            Semua Promo
          </h5>
        </Link>
      </div> */}

      <div className="w-full flex items-center p-4">
        <Link to="/admin-withdraw-request" className="w-full flex items-center">
          <CiMoneyBill
            size={30}
            color={`${active === 7 ? 'crimson' : '#555'}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 7 ? 'text-[crimson]' : 'text-[#555]'
            }`}
          >
            Permintaan Penarikan uang
          </h5>
        </Link>
      </div>

      <div className="w-full flex items-center p-4">
        <div
          onClick={logoutHandler}
          className="w-full flex items-center cursor-pointer"
        >
          <FiLogOut size={30} color={`${active === 8 ? 'crimson' : '#555'}`} />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 8 ? 'text-[crimson]' : 'text-[#555]'
            }`}
          >
            Logout
          </h5>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;
