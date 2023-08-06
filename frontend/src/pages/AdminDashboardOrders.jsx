import React, { useEffect, useState } from 'react';
import AdminHeader from '../components/Layout/AdminHeader';
import AdminSideBar from '../components/Admin/Layout/AdminSideBar';
import { DataGrid } from '@material-ui/data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfAdmin } from '../redux/actions/order';
import { Tab, Tabs } from '@material-ui/core';

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [status, setStatus] = useState('Pending');
  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, []);

  const columns = [
    { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },
    {
      field: 'namaProduk',
      headerName: 'Nama Produk',
      type: 'string',
      minWidth: 130,
      flex: 0.8,
    },
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
      field: 'kurir',
      headerName: 'Kurir',
      type: 'string',
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: 'itemsQty',
      headerName: 'Items Qty',
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
      field: 'createdAt',
      headerName: 'Order Date',
      type: 'number',
      minWidth: 130,
      flex: 0.8,
    },
  ];

  const row = [];
  adminOrders &&
    adminOrders
      .filter((item) => item.status === status)
      .forEach((item) => {
        row.push({
          id: item._id,
          namaProduk: item.cart[0].name,
          itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
          total: ' Rp' + item?.totalPrice,
          status: item?.status,
          createdAt: item?.createdAt.slice(0, 10),
          kurir: item.kurir,
        });
      });
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={2} />
          </div>

          <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center">
            <div className="w-[97%] flex justify-center flex-col">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Pending" onClick={() => setStatus('Pending')} />
                <Tab
                  label="Pengemasan"
                  onClick={() => setStatus('Pengemasan')}
                />
                <Tab
                  label="Pengiriman"
                  onClick={() => setStatus('Pengiriman')}
                />
                <Tab label="Terkirim" onClick={() => setStatus('Terkirim')} />
                <Tab
                  label="Dibatalkan"
                  onClick={() => setStatus('Dibatalkan')}
                />
              </Tabs>
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={4}
                disableSelectionOnClick
                autoHeight
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardOrders;
