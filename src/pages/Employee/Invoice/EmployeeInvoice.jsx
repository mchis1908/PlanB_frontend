import React,{useState, useEffect} from 'react'
import './EmployeeInvoice.css'
import Menu from "../Menu/EmployeeMenu"
import Header from '../../../common/Header/Header'
import { Icon } from '@iconify/react';
import EmployeeDetailInvoice from './ModalDetailInvoice/EmployeeDetailInvoice';
import EmployeeDetailInvoiceBanHang from './ModalDetailInvoiceBanHang/EmployeeDetailInvoiceBanHang';
import Axios from "axios";
import Barcode from '../../../common/Barcode/Barcode';

function EmployeeInvoice(props) {
  let [hoadons, setHoaDon] = useState([])
  const [searchkey, setSearchKey] = useState('')
  const getHoaDon = async () => {
      try {
          const res = await Axios.get('http://localhost:8000/v1/hoadon/gethoadon')
          setHoaDon(res.data);
          hoadons=res.data;
          console.log(hoadons);
      }
      catch (error) {
          console.log(error.message)
      }
  }
  useEffect(() => {
    if(searchkey) handleSearch(searchkey)
    else getHoaDon();
  }, [searchkey])
const [isOpen, setIsOpen] = useState(false);
const [hoadon, setMaHoaDon] = useState(['']);

const openPopup = (mahoadon) => {
  setMaHoaDon(mahoadon);
  setIsOpen(true);
};

const closePopup = () => {
  setIsOpen(false);
};
const [sortOrder, setSortOrder] = useState('ASC');
const handleClick = (type) => {
  const sortedData = [...hoadons].sort((a, b) => {
    if (type === 'SOLUONG') {
      return a[type] - b[type];
    } else if (type === 'SDT') {
      return a.SDT.split('-')[1].localeCompare(b.SDT.split('-')[1]);
    } else {
      return a[type].localeCompare(b[type]);
    }
  });

  if (sortOrder === 'ASC') {
    setSortOrder('DESC');
    setHoaDon(sortedData.reverse());
  } else {
    setSortOrder('ASC');
    setHoaDon(sortedData);
  }
};
const handleSearch = async(sk) => {
  if(sk!=='')
  {
      const res = await Axios.get('http://localhost:8000/v1/hoadon/searchhoadon/'+ sk)
      setHoaDon(res.data);
  }
};
  return (
    <div className='EmployeeInvoice'>
      <Menu/>
      <Header title="QUẢN LÝ HÓA ĐƠN" avt='https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg' name={localStorage.getItem('user')}/>
      <div className='EmployeeInvoice_main'>
        <div className='EmployeeInvoice_searchbar'>
          <input className="search-area" type="text" placeholder='Nhập khách hàng hoặc mã hóa đơn cần tìm' onChange={(e)=> setSearchKey(e.target.value)}/>
          {/* <span className='bg-search-btn'><button className='search-btn'><Icon icon="ic:baseline-search" /></button></span> */}
        </div>
          <div >
            <table className="EmployeeInvoice-information">
                <tr className="EmployeeInvoice-information-header">
                        <th>Mã hóa đơn <span><Icon style={{paddingLeft:'10px'}} onClick={() => handleClick('MAHOADON')} icon="ph:sort-ascending-bold" /></span></th>
                        <th>Khách hàng <span><Icon style={{paddingLeft:'10px'}} onClick={() => handleClick('SDT')} icon="ph:sort-ascending-bold" /></span></th>
                        <th>Số lượng sản phẩm<span><Icon style={{paddingLeft:'10px'}} onClick={() => handleClick('SOLUONG')} icon="ph:sort-ascending-bold" /></span></th>
                        <th>Ngày tạo đơn <span><Icon style={{paddingLeft:'10px'}} onClick={() => handleClick('NGAYTAODON')} icon="ph:sort-ascending-bold" /></span></th>
                        <th>Loại hóa đơn <span><Icon style={{paddingLeft:'10px'}} onClick={() => handleClick('LOAI')} icon="ph:sort-ascending-bold" /></span></th>
                        <th>Trạng thái <span><Icon style={{paddingLeft:'10px'}} onClick={() => handleClick('TRANGTHAI')} icon="ph:sort-ascending-bold" /></span></th>
                <hr/>
                </tr>
                <div className='EmployeeInvoice_detail_infor'>
                  {
                    hoadons.map(hoadons => {
                      const arr = hoadons.SDT.split('-');
                      const result = arr[1];
                          return (
                                  <tr className='EmployeeInvoice-information-detail' onClick={() => openPopup(hoadons)}>
                                      <div className='EmployeeInvoice-information-detail-wrapper'>
                                      <td>{hoadons.MAHOADON}</td>
                                          {/* <td><Barcode style={{width:'5vw'}} value={hoadons.MAHOADON} /></td> */}
                                          <td style={{textAlign:'start', paddingLeft:'20px'}}>{result}</td>
                                          <td style={{minWidth: '10.6vw',maxWidth: '10.6vw'}}>{hoadons.SOLUONG}</td>
                                          <td>{hoadons.NGAYTAODON}</td>
                                          <td><p className={hoadons.LOAI === 'Bán hàng' ? 'orange-text' : 'pink-text'} style={{border:'1px solid', width:'6vw', height:'4vh', marginLeft:'3vw', display:'flex', alignItems:'center', justifyContent:'center'}}>{hoadons.LOAI}</p></td>
                                          <td><p className={hoadons.TRANGTHAI === 'Đã thanh toán' ? 'green-text' : 'red-text'} style={{border:'1px solid', width:'9vw', height:'4vh', marginLeft:'1.5vw', display:'flex', alignItems:'center', justifyContent:'center'}}>{hoadons.TRANGTHAI}</p></td>
                                      </div>
                                  </tr>
                          )
                      })
                  }
                </div>
                {isOpen && hoadon.LOAI==='Ký gửi' &&
                  <EmployeeDetailInvoice
                    title="CHI TIẾT HÓA ĐƠN KÝ GỬI"
                    onClose={closePopup}
                    data={hoadon}
                    db={false}
                  >
                    {props.children}
                  </EmployeeDetailInvoice>
                }
                {isOpen && hoadon.LOAI==='Bán hàng' &&
                  <EmployeeDetailInvoiceBanHang
                    title="CHI TIẾT HÓA ĐƠN BÁN HÀNG"
                    onClose={closePopup}
                    data={hoadon}
                  >
                    {props.children}
                  </EmployeeDetailInvoiceBanHang>
                }   
            </table>
          </div>
      </div>
    </div>
  )
}

export default EmployeeInvoice