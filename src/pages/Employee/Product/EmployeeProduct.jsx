import React,{useState, useEffect} from 'react'
import './EmployeeProduct.css'
import Menu from "../Menu/EmployeeMenu"
import Header from '../../../common/Header/Header'
import { Icon } from '@iconify/react';
import EmployeeDetailProduct from './ModalDetailProduct/EmployeeDetailProduct';
import Axios from "axios";

function EmployeeProduct(props) {
  let [sanphams, setSanPham] = useState([])
  const getSANPHAM = async () => {
      try {
          const res = await Axios.get('http://localhost:8000/v1/sanpham/getsanpham')
          setSanPham(res.data);
          sanphams=res.data;
          console.log(sanphams);
      }
      catch (error) {
          console.log(error.message)
      }
  }
  const [searchkey, setSearchKey] = useState('')
  useEffect(() => {
    if(searchkey) handleSearch(searchkey)
    else getSANPHAM();
  }, [searchkey])

const [isOpen, setIsOpen] = useState(false);
const [sanpham, setMaSanPham] = useState(['']);

const openPopup = (sanphams) => {
  setMaSanPham(sanphams);
  setIsOpen(true);
};

const closePopup = () => {
  setIsOpen(false);
};
const [sortOrder, setSortOrder] = useState('ASC');
const handleClick = (type) => {
  const sortedData = [...sanphams].sort((a, b) => {
    if (type === 'GIANHAN') {
      return a[type] - b[type];
    } else {
      return a[type].localeCompare(b[type]);
    }
  });

  if (sortOrder === 'ASC') {
    setSortOrder('DESC');
    setSanPham(sortedData.reverse());
  } else {
    setSortOrder('ASC');
    setSanPham(sortedData);
  }
};
const handleSearch = async(sk) => {
  if(sk!=='')
  {
    const res = await Axios.get('http://localhost:8000/v1/sanpham/searchsanpham/'+ sk)
    setSanPham(res.data);
  }
};
  return (
    <div className='EmployeeProduct'>
      <Menu/>
      <Header title="QUẢN LÝ SẢN PHẨM" avt='https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg' name={localStorage.getItem('user')}/>
      <div className='EmployeeProduct_main'>
        <div className='EmployeeProduct_searchbar'>
          <input className="search-area" type="text" placeholder='Nhập thông tin sản phẩm cần tìm' onChange={(e)=> setSearchKey(e.target.value)}/>
        </div>
          <div >
            <table className="EmployeeProduct-information">
                <tr className="EmployeeProduct-information-header">
                        <th>Mã sản phẩm <span><Icon style={{paddingLeft:'20px'}} onClick={() => handleClick('MASANPHAM')} icon="ph:sort-ascending-bold" /></span></th>
                        <th>Tên sản phẩm <span><Icon style={{paddingLeft:'20px'}} onClick={() => handleClick('TENSANPHAM')} icon="ph:sort-ascending-bold" /></span></th>
                        <th>Loại <span><Icon style={{paddingLeft:'20px'}} onClick={() => handleClick('LOAI')} icon="ph:sort-ascending-bold" /></span></th>
                        <th style={{textAlign:'end',maxWidth: '10.6vw',minWidth: '10.6vw'}}>Giá bán <span><Icon style={{paddingLeft:'20px'}} onClick={() => handleClick('GIANHAN')} icon="ph:sort-ascending-bold" /></span></th>
                        <th style={{maxWidth: '16.6vw',minWidth: '16.6vw'}}>Trạng thái <span><Icon style={{paddingLeft:'20px'}} onClick={() => handleClick('TRANGTHAI')} icon="ph:sort-ascending-bold" /></span></th>
                        <th>Hình ảnh <span><Icon style={{paddingLeft:'20px'}} onClick={() => handleClick('MASANPHAM')} icon="ph:sort-ascending-bold" /></span></th>
                <hr/>
                </tr>
                <div className='EmployeeProduct_detail_infor'>
                  {
                    sanphams.map(sanphams => {
                          return (
                                  <tr className='EmployeeProduct-information-detail' onClick={() => openPopup(sanphams)}>
                                      <div className='EmployeeProduct-information-detail-wrapper'>
                                          <td >{sanphams.MASANPHAM}</td>
                                          <td >{sanphams.TENSANPHAM}</td>
                                          <td >{sanphams.LOAI}</td>
                                          <td style={{textAlign:'end',maxWidth: '8.6vw',minWidth: '8.6vw'}}>{sanphams.GIANHAN.toLocaleString('vi-VN', { maximumFractionDigits: 3 })}đ</td>
                                          <td style={{maxWidth: '15.3vw',minWidth: '15.3vw'}}><p className={sanphams.TRANGTHAI === 'Đã bán' ? 'green-text' : 'red-text'} style={{border:'1px solid', width:'11.5vw', height:'4vh', marginLeft:'3vw', display:'flex', alignItems:'center', justifyContent:'center'}}>{sanphams.TRANGTHAI}</p></td>
                                          <td><img style={{maxHeight:'40px',width:'50px', verticalAlign:'middle','objectFit':'cover'}} src={'http://localhost:8000/'+sanphams.HINHANH}/></td>
                                      </div>
                                  </tr>
                          )
                      })
                  }
                </div>
                {isOpen && sanpham.TRANGTHAI==='Đã bán' &&
                  <EmployeeDetailProduct
                    title="Chỉnh sửa sản phẩm"
                    onClose={closePopup}
                    data={sanpham}
                    db={true}
                  >
                    {props.children}
                  </EmployeeDetailProduct>
                }
                {isOpen && sanpham.TRANGTHAI==='Chưa bán' &&
                  <EmployeeDetailProduct
                    title="Chỉnh sửa sản phẩm"
                    onClose={closePopup}
                    data={sanpham}
                    db={false}
                  >
                    {props.children}
                  </EmployeeDetailProduct>
                }
            </table>
          </div>
      </div>
    </div>
  )
}

export default EmployeeProduct