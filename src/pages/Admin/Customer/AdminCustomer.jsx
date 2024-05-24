import React,{useState, useEffect} from 'react'
import './AdminCustomer.css'
// import ReactTable from 'react-table';
import Menu from "../Menu/AdminMenu"
import Header from '../../../common/Header/Header'
import { Icon } from '@iconify/react';
import AdminDetailCustomer from './ModalDetailCustomer/AdminDetailCustomer';
import Axios from "axios";
import AdminAddCustomer from './ModalAddCustomer/AdminAddCustomer';

function AdminCustomer(props) {
  let [khachhangs, setKhachHang] = useState([])
  const [searchkey, setSearchKey] = useState('')
  const getkhachhang = async () => {
      try {
          const res = await Axios.get('http://localhost:8000/v1/khachhang/getkhachhang')
          setKhachHang(res.data);
          khachhangs=res.data;
          console.log(khachhangs);
      }
      catch (error) {
          console.log(error.message)
      }
  }
  useEffect(() => {
    if(searchkey) handleSearch(searchkey)
    else getkhachhang();
  }, [searchkey])

const [isOpen, setIsOpen] = useState(false);
const openPopup = () => {
  setIsOpen(true);
};
const closePopup = () => {
  setIsOpen(false);
};

const [isOpen1, setIsOpen1] = useState(false);
const [khachhang, setMaKhachHang] = useState(['']);

const openPopup1 = (khachhangs) => {
  setMaKhachHang(khachhangs);
  setIsOpen1(true);
};
const closePopup1 = () => {
  setIsOpen1(false);
};
const [sortOrder, setSortOrder] = useState('ASC');
const handleClick = (type) => {
  const sortedData = [...khachhangs].sort((a, b) => {
      return a[type].localeCompare(b[type]);
  });
  if (sortOrder === 'ASC') {
    setSortOrder('DESC');
    setKhachHang(sortedData.reverse());
  } else {
    setSortOrder('ASC');
    setKhachHang(sortedData);
  }
};
const handleSearch = async(sk) => {
  if(sk!=='')
  {
    const res = await Axios.get('http://localhost:8000/v1/khachhang/searchkhachhang/'+ sk)
    setKhachHang(res.data);
  }
};
  return (
    <div className='AdminCustomer'>
      <Menu />
      <Header title="QUẢN LÝ KHÁCH HÀNG" avt='https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg' name={localStorage.getItem('user')}/>
      <div className='AdminCustomer_main'>
        <div className='AdminCustomer_searchbar'>
          <input className="search-area" type="text" placeholder='Nhập số điện thoại hoặc tên khách hàng cần tìm' onChange={(e)=> setSearchKey(e.target.value)}/>
          <button className='AdminCustomer_btn_create' onClick={openPopup}>Thêm khách hàng +</button>
        </div>
          <div >
            <table className="AdminCustomer-information">
                <tr className="AdminCustomer-information-header">
                        <th>Họ và tên <span><Icon style={{paddingLeft:'20px'}} onClick={()=> handleClick('HOTEN')} icon="ph:sort-ascending-bold" /></span></th>
                        <th>Số điện thoại <span><Icon style={{paddingLeft:'20px'}} onClick={()=> handleClick('SDT')} icon="ph:sort-ascending-bold" /></span></th>
                        <th>Email <span><Icon style={{paddingLeft:'20px'}} onClick={()=> handleClick('EMAIL')} icon="ph:sort-ascending-bold" /></span></th>
                        <th>Hóa đơn gần nhất <span><Icon style={{paddingLeft:'20px'}} onClick={()=> handleClick('LANDENGANNHAT')} icon="ph:sort-ascending-bold" /></span></th>
                        <hr/>
                </tr>
                <div className='AdminCustomer_detail_infor'>
                  {
                    khachhangs.map(khachhangs => {
                          return (
                                  <tr className='AdminCustomer-information-detail' onClick={() => openPopup1(khachhangs)}>
                                      <div className='AdminCustomer-information-detail-wrapper' >
                                          <td style={{textAlign:'start', paddingLeft:'1vw'}}>{khachhangs.HOTEN}</td>
                                          <td>{khachhangs.SDT}</td>
                                          <td>{khachhangs.EMAIL}</td>
                                          <td>{khachhangs.LANDENGANNHAT}</td>
                                      </div>
                                  </tr>
                          )
                      })
                  }
                </div>
                {isOpen &&
                  <AdminAddCustomer
                    title="Thông tin khách hàng"
                    onClose={closePopup}
                  >
                    {props.children}
                  </AdminAddCustomer>
                }
                {isOpen1 &&
                  <AdminDetailCustomer
                    title="Chỉnh sửa thông tin khách hàng"
                    onClose={closePopup1}
                    data={khachhang}
                  >
                    {props.children}
                  </AdminDetailCustomer>
                }
            </table>
          </div>
      </div>
    </div>
  )
}

export default AdminCustomer