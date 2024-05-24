import React, { useState, useEffect } from 'react';
import './AdminAccount.css'
import Menu from "../Menu/AdminMenu"
import Header from '../../../common/Header/Header'
import { Icon } from '@iconify/react';
import AdminDetailAccount from './ModalDetailAccount/AdminDetailAccount';
import Axios from "axios";

function AdminAccount(props) {
  let [accounts, setTaiKhoan] = useState([])
  const getTK = async () => {
      try {
          const res = await Axios.get('http://localhost:8000/v1/taikhoan/gettaikhoan')
          setTaiKhoan(res.data);
          accounts=res.data;
      }
      catch (error) {
          console.log(error.message)
      }
  }
  const [searchkey, setSearchKey] = useState('')

  useEffect(() => {
    if(searchkey) handleSearch(searchkey)
    else getTK();
  }, [searchkey])

  const handleSearch = async(sk) => {
    if(sk!=='')
    {
      const res = await Axios.get('http://localhost:8000/v1/taikhoan/searchtaikhoan/'+ sk)
      setTaiKhoan(res.data);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const [inftaikhoan, setInfTaiKhoan] = useState(['']);

  const openPopup = (tk) => {
    setInfTaiKhoan(tk);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };
  const [sortOrder, setSortOrder] = useState('ASC');
  const handleClick = (type) => {
    const sortedData = [...accounts].sort((a, b) => {
      return a[type].localeCompare(b[type]);
    });
    if (sortOrder === 'ASC') {
      setSortOrder('DESC');
      setTaiKhoan(sortedData.reverse());
    } else {
      setSortOrder('ASC');
      setTaiKhoan(sortedData);
    }
  };
  return (
    <div className='AdminAccount'>
      <Menu/>
      <Header title="QUẢN LÝ TÀI KHOẢN" avt='https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg' name={localStorage.getItem('user')}/>
      <div className='AdminAccount_main'>
        <div className='AdminAccount_searchbar'>
          <input className="search-area" type="text" placeholder='Nhập tên tài khoản hoặc nhân viên cần tìm' onChange={(e)=> setSearchKey(e.target.value)}/>
        </div>
          <div >
            <table className="AdminAccount-information">
                <tr className="AdminAccount-information-header">
                        <th>Tên nhân viên <span><Icon style={{paddingLeft:'20px'}} onClick={() => handleClick('TENNV')} icon="ph:sort-ascending-bold" /></span></th>
                        <th>Tài khoản <span><Icon style={{paddingLeft:'20px'}} onClick={() => handleClick('TENTAIKHOAN')} icon="ph:sort-ascending-bold" /></span></th>
                        <th>Mật khẩu <span><Icon style={{paddingLeft:'20px'}} onClick={() => handleClick('MATKHAU')} icon="ph:sort-ascending-bold" /></span></th>
                <hr/>
                </tr>
                <div className='AdminAccount_detail_infor'>
                  {
                    accounts.map(accounts => {
                      if(accounts.PHANQUYEN=== 'employee')
                          return (
                                  <tr className='AdminAccount-information-detail' onClick={() => openPopup(accounts)}>
                                      <div className='AdminAccount-information-detail-wrapper'>
                                          <td className='stadium-name'>{accounts.TENNV}</td>
                                          <td className='team-name'>{accounts.TENTAIKHOAN}</td>
                                          <td className=''>{accounts.MATKHAU}</td>
                                      </div>
                                  </tr>
                          )
                      })
                  }
                </div>
                {isOpen &&
                  <AdminDetailAccount
                    title="Thông tin tài khoản"
                    onClose={closePopup}
                    data={inftaikhoan}
                  >
                    {props.children}
                  </AdminDetailAccount>
                }
            </table>
          </div>
      </div>
    </div>
  )
}

export default AdminAccount