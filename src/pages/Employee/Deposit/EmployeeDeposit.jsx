import React, { useState, useEffect } from 'react';
import "./EmployeeDeposit.css"
import { Icon } from '@iconify/react';
import Menu from "../Menu/EmployeeMenu"
import Header from '../../../common/Header/Header'
import EmployeeDetailDeposit from './ModalDetailDeposit/EmployeeDetailDeposit';
import cryptoRandomString from 'crypto-random-string';
import {Autocomplete}  from "@mui/material";
import TextField from "@mui/material/TextField";
import Axios from "axios";
import EmployeeDepositPrintBarcode from './ModalPrintBarcode/EmployeeDepositPrintBarcode';
import EmployeeDetailInvoice from '../Invoice/ModalDetailInvoice/EmployeeDetailInvoice';
import { message } from 'antd';

function EmployeeDeposit(props) {
const [khachhang, setSDTKhachHang] = useState()
const [loaihoadon, setLoaiHoaDon] = useState('Ký gửi')
const [trangthaiHD, setTrangThaiHD] = useState('Chưa thanh toán')
let [khachhangs, setKhachHang] = useState([])
const getKH = async () => {
    try {
        const res = await Axios.get('http://localhost:8000/v1/khachhang/getkhachhang')
        setKhachHang(res.data);
        khachhangs=res.data;
    }
    catch (error) {
        console.log(error.message)
    }
}

let [sanphams, setSanPham] = useState([])
const getSANPHAM = async () => {
    try {
        const res = await Axios.get('http://localhost:8000/v1/sanpham/getsanphambymakygui/'+'001d30009ff71de813521e7b')
        setSanPham(res.data);
        sanphams=res.data;
    }
    catch (error) {
        console.log(error.message)
    }
}

useEffect(() => {
  getSANPHAM();
  getKH();
}, [])
const [sp, setsp] = useState();
const [isOpen, setIsOpen] = useState(false);
const openPopup = (sph) => {
  setIsOpen(true);
  setsp(sph)
};
const closePopup = () => {
  setIsOpen(false);
};

const [showNotSuccess, setShowNotSuccess] = useState(true);
const [showSuccess, setShowSuccess] = useState(false);

const currentDate = new Date();
const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
const [firsthd, setFirsthd] = useState()
const handleConfirm = async () => {
  if (document.getElementById('sdtkhachhang').value === '') {
      message.error('Vui lòng nhập đầy đủ thông tin khách hàng')
      return
  }
  if (sanphams.length === 0) {
    // alert('Hiện chưa có sản phẩm nào')
    message.warning('Hiện chưa có sản phẩm nào')
    return
  }
  const answer = window.confirm("Bạn có chắc chắn tạo hóa đơn",);
  const randommahoadon = cryptoRandomString({ length: 16 });
  setFirsthd(randommahoadon);
  if (answer) {
    try{
      Axios.post('http://localhost:8000/v1/hoadon/themhoadon', 
      {
        MAHOADON: randommahoadon,
        SDT: khachhang,
        SOLUONG: sanphams.length,
        LOAI: loaihoadon,
        TRANGTHAI: trangthaiHD,
        NGAYTAODON: currentDate.toLocaleString('en-AU', options).replaceAll('/', '-')
      })
    }
    catch{
        // alert('Số điện thoại trùng')
      message.warning('Số điện thoại trùng')
      return
    }
    Axios.patch('http://localhost:8000/v1/sanpham/updatesanphambymahd/'+'001d30009ff71de813521e7b', 
    {
      MAHOADONKG: randommahoadon
    })
    Axios.patch('http://localhost:8000/v1/khachhang/updatekhachhang/'+ khachhang, 
    {
      LANDENGANNHAT: currentDate.toLocaleString('en-AU', options).replaceAll('/', '-')
    })
    // ---------Xử lý sản phẩm NGÀY---------
    // ---------Xử lý sản phẩm THÁNG---------
    const formatNgay = currentDate.toLocaleString('en-AU', options).replaceAll('/', '-').substring(0,10);
    const formatThang = currentDate.toLocaleString('en-AU', options).replaceAll('/', '-').substring(3,10);
    // console.log(formatNgay)
    try {
      const response = await Axios.get('http://localhost:8000/v1/baocaospngay/getBaoCaoSPNgay/' + formatNgay);
      const bcn = response.data;
      const response1 = await Axios.get('http://localhost:8000/v1/baocaospthang/getBaoCaoSPThang/' + formatThang);
      const bct = response1.data;
      const res = await Axios.patch(
        'http://localhost:8000/v1/baocaospngay/updateBaoCaoSPNgay/' + formatNgay,
        {
          SLSANPHAMNHAN: bcn.SLSANPHAMNHAN + sanphams.length,
        }
      );
      Axios.patch(
        'http://localhost:8000/v1/baocaospthang/updateBaoCaoSPThang/' + formatThang,
        {
          SLSANPHAMNHAN: bct.SLSANPHAMNHAN + sanphams.length,
        }
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Axios.post('http://localhost:8000/v1/baocaospngay/themBaoCaoSPNgay/', {
          THOIGIAN: formatNgay,
          SLSANPHAMBAN: 0,
          SLSANPHAMNHAN: sanphams.length,
        });
        Axios.post('http://localhost:8000/v1/baocaospthang/themBaoCaoSPThang/', {
          THOIGIAN: formatThang,
          SLSANPHAMBAN: 0,
          SLSANPHAMNHAN: sanphams.length,
        });
        console.log('Chưa có báo cáo, hệ thống sẽ tạo báo cáo');
      } else {
        console.log('Lỗi khi gửi yêu cầu Axios: ', error.message);
      }
    }
    // window.alert('Hóa đơn đã được tạo thành công')
    message.success('Hóa đơn đã được tạo thành công')
    setShowNotSuccess(false);
    setShowSuccess(true);
  }
  
};

const handleComplete = () => {
  setShowNotSuccess(true);
  setShowSuccess(false);
  window.location.reload()
};
const handleCancel = () => {
  if(sanphams.length=== 0)
  message.warning('Chưa có sản phẩm nào');
  else{
    const answer = window.confirm("Bạn có chắc chắn hủy tạo hóa đơn. Tất cả sản phẩm trong đơn sẽ bị xóa.",);
    if (answer) {
      Axios.delete('http://localhost:8000/v1/sanpham/deletesanphambymahdkg/'+'001d30009ff71de813521e7b')
      setShowNotSuccess(true);
      setShowSuccess(false);
      window.location.reload()
    }
  }
};

const [isOpen1, setIsOpen1] = useState(false);
const [allsanpham, setAllSanPham] = useState([''])
const openPopup1 = async() => {
  console.log(firsthd)
  const res = await Axios.get('http://localhost:8000/v1/sanpham/getsanphambymakygui/'+ firsthd)
  setAllSanPham(res.data);
  setIsOpen1(true);
};
const closePopup1 = () => {
  setIsOpen1(false);
};

const [isOpen2, setIsOpen2] = useState(false);
const [hoadon, setMaHoaDon] = useState([''])
const openPopup2 = async() => {
  const res = await Axios.get('http://localhost:8000/v1/hoadon/gethoadon/'+ firsthd)
  setMaHoaDon(res.data);
  setIsOpen2(true); 
};
const closePopup2 = () => {
  setIsOpen2(false);
};

const calculateTotal = () => {
  let total =0;
  for(let i = 0; i < sanphams.length; i++) {
    total+=sanphams[i].GIANHAN;
  }
  return total;
};
return (
  <div className='EmployeeDeposit'>
    <Menu/>
    <Header title="KÝ GỬI" avt='https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg' name={localStorage.getItem('user')}/>
    <div className='EmployeeDeposit_main'>
      <div className="EmployeeDeposit_Bottom">
        <div className='EmployeeDeposit_Content'>
          <div className='EmployeeDeposit_Detail'>
            <div className='EmployeeDeposit_CustomerInf'>
              <p className='ProductInf_Label' style={{fontWeight:600}}>Khách hàng:</p>
              <Autocomplete
                disablePortal
                id='sdtkhachhang'
                options={khachhangs}
                style={{marginLeft:'4vw', width:'30vw'}}
                getOptionLabel={(option) => `${option.SDT} - ${option.HOTEN}`}
                renderInput={(params) => <TextField {...params} label="Khách Hàng" size="small" />}
                onSelect={(e)=> {setSDTKhachHang(e.target.value)}}
              />
            </div>
            <p className='ProductInf_Label' style={{fontWeight:600}}>Sản phẩm:</p>
              <div className='EmployeeDeposit_ProductInf' style={{fontWeight:600}}>
                <td></td>                    
                <td>STT</td>
                <td>Tên sản phẩm</td>
                <td>Loại</td>
                <td>Hình ảnh</td>
                <td>Giá</td>
                <td className='btn_deleteProduct'></td>
              </div>
            <div className='EmployeeDeposit_ProductList'>
              {
                sanphams.map((sp,index) => {
                    return (
                      <div className='EmployeeDeposit_ProductInf' onClick={(e)=>openPopup(sp)}>
                      {/* {isOpen &&
                        <EmployeeDetailDeposit
                          title="Thông tin sản phẩm"
                          onClose={closePopup}
                          data={sp}
                        >
                          {props.children}
                        </EmployeeDetailDeposit>
                      } */}
                        <td></td>                    
                        <td>{index+1}</td>
                        <td>{sp.TENSANPHAM}</td>
                        <td>{sp.LOAI}</td>
                        <td><img style={{width:'50px', height:'40px', 'objectFit':'cover'}} src={"http://localhost:8000/"+sp.HINHANH}/></td>
                        <td>{sp.GIANHAN.toLocaleString('vi-VN', { maximumFractionDigits: 3 })}đ</td>
                      </div>
                    )
                })
              }
            </div>
            <hr/>
            <div className='EmployeeDeposit_ProductInf' style={{fontWeight:600}}>
              <td>Số lượng:</td>               
              <td>{sanphams.length}</td>                    
              <td></td>                    
              <td></td>
              <td>Tổng tiền: </td>
              <td>{calculateTotal().toLocaleString('vi-VN', { maximumFractionDigits: 3 })}đ</td>
            </div>
            <div className='EmployeeDeposit_btnChange'>
              {showSuccess && (
                <>
                  <button className='EmployeeDeposit_btnPrintProduct' onClick={openPopup1}>In barcode sản phẩm</button>
                  {isOpen1 && 
                    <EmployeeDepositPrintBarcode
                      title="In Barcode Sản Phẩm"
                      onClose={closePopup1}
                      data={allsanpham}
                      db={true}
                    >
                      {props.children}
                    </EmployeeDepositPrintBarcode>
                  }
                  <button className='EmployeeDeposit_btnPrintInvoice' onClick={openPopup2}>In hóa đơn khách hàng</button>
                  {isOpen2 &&
                    <EmployeeDetailInvoice
                      title="Thêm sản phẩm"
                      onClose={closePopup2}
                      data={hoadon}
                    >
                      {props.children}
                    </EmployeeDetailInvoice>
                  }
                  <button className='EmployeeDeposit_btnComplete' onClick={handleComplete}>Hoàn tất</button>
                </>
              )}
              {showNotSuccess && (
                <>
                  <button className='EmployeeDeposit_btnCancel' onClick={handleCancel}>Hủy</button>
                  <button className='EmployeeDeposit_btnAddProduct' onClick={(e)=>openPopup('')}>Thêm sản phẩm</button>
                  {isOpen &&
                    <EmployeeDetailDeposit
                      title="Thông tin sản phẩm"
                      onClose={closePopup}
                      data={sp}
                    >
                      {props.children}
                    </EmployeeDetailDeposit>
                  }
                  <button className='EmployeeDeposit_btnConfirm' onClick={handleConfirm}>Xác nhận tạo hóa đơn</button>
                  {/* <button className='EmployeeDeposit_btnConfirm' onClick={openPopup1}>test</button>
                  {isOpen1 && 
                    <EmployeeDepositPrintBarcode
                      title="In Barcode Sản Phẩm"
                      onClose={closePopup1}
                      data={allsanpham}
                    >
                      {props.children}
                    </EmployeeDepositPrintBarcode>
                  } */}
                </>
              )}
            </div>
            
          </div> 
        </div>
        {/* -------------------------------------------------------------- */}
        
      </div>
    </div>
  </div>
)
}

export default EmployeeDeposit