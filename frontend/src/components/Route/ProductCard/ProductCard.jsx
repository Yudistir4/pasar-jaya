import React, { useState } from 'react';
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { backend_url } from '../../../server';
import styles from '../../../styles/styles';
import { useDispatch, useSelector } from 'react-redux';
import ProductDetailsCard from '../ProductDetailsCard/ProductDetailsCard';
import {
  addToWishlist,
  removeFromWishlist,
} from '../../../redux/actions/wishlist';
import { useEffect } from 'react';
import { addTocart } from '../../../redux/actions/cart';
import { toast } from 'react-toastify';
import Ratings from '../../Products/Ratings';

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error('Item already in cart!');
    } else {
      if (data.stock < 1) {
        toast.error('Product stock limited!');
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success('Item added to cart successfully!');
      }
    }
  };

  return (
    <div className="flex flex-col w-full bg-white rounded-lg shadow-sm p-3 relative cursor-pointer  ">
      <div className="absolute shadow-md shadow-black/30 z-10 right-5 top-5 flex items-center justify-center bg-white rounded-full h-10 w-10">
        {click ? (
          <AiFillHeart
            size={22}
            className="cursor-pointer  "
            onClick={() => removeFromWishlistHandler(data)}
            color={click ? 'red' : '#333'}
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            size={22}
            className="cursor-pointer  "
            onClick={() => addToWishlistHandler(data)}
            color={click ? 'red' : '#333'}
            title="Add to wishlist"
          />
        )}
      </div>
      {/* <div className="flex justify-end"></div> */}
      <Link
        to={`${
          isEvent === true
            ? `/product/${data._id}?isEvent=true`
            : `/product/${data._id}`
        }`}
        className="relative"
      >
        <img
          src={`${data.images && data.images[0]}`}
          alt=""
          className="w-full h-[170px] object-cover rounded-md"
        />
        <div className="flex gap-4 items-center absolute bottom-2 left-1/2 -translate-x-1/2">
          {/* <div className="flex items-center justify-center bg-white rounded-full h-10 w-10"> */}
          {/* {click ? (
                <AiFillHeart
                  size={22}
                  className="cursor-pointer  "
                  onClick={() => removeFromWishlistHandler(data)}
                  color={click ? 'red' : '#333'}
                  title="Remove from wishlist"
                />
              ) : (
                <AiOutlineHeart
                  size={22}
                  className="cursor-pointer  "
                  onClick={() => addToWishlistHandler(data)}
                  color={click ? 'red' : '#333'}
                  title="Add to wishlist"
                />
              )} */}
          {/* </div> */}
          {/* <AiOutlineEye
              size={22}
              className="cursor-pointer   "
              onClick={() => setOpen(!open)}
              color="#333"
              title="Quick view"
            /> */}
          {/* <AiOutlineShoppingCart
            size={25}
            className="cursor-pointer   "
            onClick={() => addToCartHandler(data._id)}
            color="#444"
            title="Add to cart"
          /> */}
          {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
        </div>
      </Link>
      <Link
        to={`${
          isEvent === true
            ? `/product/${data._id}?isEvent=true`
            : `/product/${data._id}`
        }`}
      >
        <h4 className="pb-3 font-[500]">
          {data.name.length > 40 ? data.name.slice(0, 40) + '...' : data.name}
        </h4>

        <div className="flex">
          <Ratings rating={data?.ratings} />
        </div>

        <div className="py-2 flex items-center justify-between">
          <div className="flex">
            <h5 className={`${styles.productDiscountPrice}`}>
              Rp
              {data.originalPrice === 0
                ? data.originalPrice
                : data.discountPrice}
            </h5>
            <h4 className={`${styles.price}`}>
              {data.originalPrice ? ' Rp' + data.originalPrice : null}
            </h4>
          </div>
          <span className="font-[400] text-[17px] text-[#68d284]">
            {data?.sold_out} Terjual
          </span>
        </div>
      </Link>
      {/* <AiOutlineShoppingCart
              size={25}
              className="cursor-pointer   "
              onClick={() => addToCartHandler(data._id)}
              color="#444"
              title="Add to cart"
            /> */}
      <button
        className=" px-4 py-2 border-2 border-black/70 rounded-full hover:bg-black/70 hover:text-white transition-all"
        onClick={() => addToCartHandler(data._id)}
      >
        Add to cart
      </button>
    </div>
  );
};

export default ProductCard;
