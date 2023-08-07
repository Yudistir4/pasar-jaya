import React, { useEffect, useState } from 'react';
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from 'react-icons/ai';
import styles from '../../styles/styles';
import { Link } from 'react-router-dom';
import { MdBorderClear } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '../../redux/actions/order';
import { getAllProductsShop } from '../../redux/actions/product';
import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { BarChart } from '@mui/x-charts/BarChart';

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const availableBalance = seller?.availableBalance.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
  });

  const columns = [
    { field: 'id', headerName: 'ID pesanan', minWidth: 150, flex: 0.7 },

    {
      field: 'status',
      headerName: 'Status',
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, 'status') === 'Delivered'
          ? 'greenColor'
          : 'redColor';
      },
    },
    {
      field: 'itemsQty',
      headerName: 'Jumlah barang',
      type: 'number',
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: ' ',
      flex: 1,
      minWidth: 150,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: 'Rp ' + item.totalPrice,
        status: item.status,
      });
    });

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Initialize an object to store monthly totals
  const monthlyTotals = {};

  // Calculate monthly totals
  orders &&
    orders
      .filter((item) => item.status === 'Terkirim')
      .forEach((order) => {
        const createdAt = new Date(order.createdAt);
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth();

        const key = `${year}-${month}`;

        if (!monthlyTotals[key]) {
          monthlyTotals[key] = 0;
        }

        monthlyTotals[key] += order.totalPrice;
      });
  const getMonthName = (monthIndex) => {
    const monthNames = [
      'januari',
      'februari',
      'march',
      'april',
      'mei',
      'juni',
      'juli',
      'augustus',
      'september',
      'oktober',
      'november',
      'december',
    ];

    return monthNames[monthIndex];
  };
  const sortedMonths = Object.keys(monthlyTotals).sort();
  console.log({ sortedMonths });
  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Ringkasan</h3>
      <div className="w-full  ">
        {sortedMonths.length > 0 && (
          <BarChart
            style={{ padding: '10px' }}
            className="!p-5"
            m={4}
            xAxis={[
              {
                id: 'barCategories',
                data: sortedMonths.map((key) => {
                  const [year, month] = key.split('-');
                  return getMonthName(parseInt(month));
                  // <td>${monthlyTotals[key]}</td>
                }),
                scaleType: 'band',
              },
            ]}
            series={[
              {
                data: sortedMonths.map((key) => {
                  return monthlyTotals[key];
                }),
              },
            ]}
            // width={300}
            height={300}
          />
        )}
      </div>
      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              Saldo Rekening{' '}
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {availableBalance}
          </h5>
          <Link to="/dashboard-withdraw-money">
            <h5 className="pt-4 pl-[2] text-[#077f9c]">Tarik uang</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              Semua pesanan
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {orders && orders.length}
          </h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">Lihat Pesanan</h5>
          </Link>
        </div>

        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}
            >
              Semua Produk
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">
            {products && products.length}
          </h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">Lihat Produk</h5>
          </Link>
        </div>
      </div>
      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Pesanan terbaru</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
};

export default DashboardHero;
