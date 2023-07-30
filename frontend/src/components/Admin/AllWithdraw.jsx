import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { server } from '../../server';
import { Link } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import { BsPencil } from 'react-icons/bs';
import { RxCross1 } from 'react-icons/rx';
import styles from '../../styles/styles';
import { toast } from 'react-toastify';

const AllWithdraw = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [withdrawData, setWithdrawData] = useState();
  const [withdrawCurrentStatus, setWithdrawCurrentStatus] =
    useState('Diproses');

  const getData = async () => {
    await axios
      .get(`${server}/withdraw/get-all-withdraw-request`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data.withdraws);
        setData(res.data.withdraws);
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  const columns = [
    // { field: 'id', headerName: 'Withdraw Id', minWidth: 150, flex: 0.7 },
    {
      field: ' ',
      headerName: 'Action',
      type: 'number',
      minWidth: 130,
      flex: 0.6,
      renderCell: (params) => {
        return (
          <BsPencil
            size={20}
            className={`${
              params.row.status !== 'Diproses'
                ? 'text-gray-600  cursor-not-allowed'
                : 'text-blue-500'
            } mr-5 cursor-pointer`}
            onClick={() => {
              if (params.row.status === 'Diproses') {
                setOpen(true);
                setWithdrawData(params.row);
                setWithdrawCurrentStatus(params.row.status);
              }
            }}
          />
        );
      },
    },
    {
      field: 'name',
      headerName: 'Shop Name',
      minWidth: 180,
      // flex: 1.4,
      renderCell: (params) => {
        console.log(params);
        return (
          <Link
            to={`/shop/preview/${params.row.shopId}`}
            className="hover:text-blue-500 transition-all"
          >
            {params.value}{' '}
          </Link>
        );
      },
    },
    // {
    //   field: 'availableBalance',
    //   headerName: 'Saldo',
    //   minWidth: 100,
    //   flex: 1.4,
    // },
    {
      field: 'amount',
      headerName: 'Amount',
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: 'bankNumber',
      headerName: 'No Rek',
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: 'bankName',
      headerName: 'Bank',
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: 'cardholderName',
      headerName: 'Atas Nama',
      minWidth: 150,
      flex: 0.6,
    },
    {
      field: 'status',
      headerName: 'status',
      type: 'text',
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: 'createdAt',
      headerName: 'Request given at',
      type: 'number',
      minWidth: 130,
      flex: 0.6,
    },
  ];

  const handleSubmit = async () => {
    console.log(withdrawData);
    await axios
      .put(
        `${server}/withdraw/update-withdraw-request/${withdrawData.id}`,
        {
          sellerId: withdrawData.shopId,
          status: withdrawCurrentStatus,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success('Withdraw request updated successfully!');
        getData();
        setOpen(false);
      });
  };

  const row = [];

  data &&
    data.forEach((item) => {
      row.push({
        id: item._id,
        shopId: item.seller._id,
        name: item.seller.name,
        amount: 'Rp ' + item.amount,
        status: item.status,
        createdAt: item.createdAt.slice(0, 10),
        availableBalance: item.seller.availableBalance,
        ...item.seller.withdrawMethod,
      });
    });
  return (
    <div className="w-full flex items-center pt-5 justify-center">
      <div className="w-[95%] bg-white">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
      {open && (
        <div className="w-full fixed h-screen top-0 left-0 bg-[#00000031] z-[9999] flex items-center justify-center">
          <div className="w-[50%] min-h-[40vh] bg-white rounded shadow p-4">
            <div className="flex justify-end w-full">
              <RxCross1 size={25} onClick={() => setOpen(false)} />
            </div>
            <h1 className="text-[25px] text-center font-Poppins">
              Update Withdraw status
            </h1>
            <br />
            <select
              name=""
              id=""
              value={withdrawCurrentStatus}
              onChange={(e) => setWithdrawCurrentStatus(e.target.value)}
              className="w-[200px] h-[35px] border rounded"
              defaultValue="Diproses"
            >
              <option value="Diproses">{withdrawData.status}</option>
              <option value="Berhasil">Berhasil</option>
              <option value="Gagal">Gagal</option>
            </select>
            {withdrawCurrentStatus !== 'Diproses' && (
              <button
                type="submit"
                className={`block ${styles.button} text-white !h-[42px] mt-4 text-[18px]`}
                onClick={handleSubmit}
              >
                Update
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllWithdraw;
