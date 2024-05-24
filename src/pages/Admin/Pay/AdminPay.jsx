import React, { useState, useEffect } from 'react';
import "./AdminPay.css"
import { Icon } from '@iconify/react';
import Menu from "../Menu/AdminMenu"
import Header from '../../../common/Header/Header'
import cryptoRandomString from 'crypto-random-string';
import {Autocomplete}  from "@mui/material";
import TextField from "@mui/material/TextField";
import Axios from "axios";
import { Button,message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

function AdminPay(props) {
const [khachhang, setSDTKhachHang] = useState()
const [loaihoadon, setLoaiHoaDon] = useState('Bán hàng')
const [trangthaiHD, setTrangThaiHD] = useState('Đã thanh toán')
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

let [thamso, setThamSo] = useState([])
  const getThamSo = async () => {
      try {
          const res = await Axios.get('http://localhost:8000/v1/thamso/getthamso/hoahongcho1sp')
          setThamSo(res.data);
          thamso=res.data;
      }
      catch (error) {
          console.log(error.message)
      }
  }

useEffect(() => {
  getKH();
  getThamSo();
}, [])

let [sanphams, setSanPham] = useState([])

const currentDate = new Date();
const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };

const handleConfirm = async () => {
  if (document.getElementById('sdtkhachhang').value === '') {
      // alert('Vui lòng nhập thông tin khách hàng')
      message.warning('Vui lòng nhập thông tin khách hàng')
      return
  }
  if (sanphams.length === 0) {
      message.warning('Hiện chưa có sản phẩm nào')
      // alert('Hiện chưa có sản phẩm nào')
    return
  }
  const answer = window.confirm("Bạn có chắc chắn tạo hóa đơn",);
  if (answer) {
    const randommahoadon = cryptoRandomString({ length: 16 });
    Axios.post('http://localhost:8000/v1/hoadon/themhoadon', 
    {
      MAHOADON: randommahoadon,
      SDT: khachhang,
      SOLUONG: sanphams.length,
      LOAI: loaihoadon,
      TRANGTHAI: trangthaiHD,
      NGAYTAODON: currentDate.toLocaleString('en-AU', options).replaceAll('/', '-')
    })
    sanphams.map(sanphams =>{
      const gianhan= sanphams.GIANHAN;
      const hoahong= Math.round(gianhan * thamso[0].GIATRITHAMSO);
      const idproduct= sanphams.MASANPHAM;
      Axios.patch('http://localhost:8000/v1/sanpham/updatesanpham/'+idproduct, 
      {
        TRANGTHAI: 'Đã bán',
        HOAHONG: hoahong,
        TIENKHACHNHAN: gianhan-hoahong,
        MAHOADONBH: randommahoadon
      })
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
          SLSANPHAMBAN: bcn.SLSANPHAMBAN + sanphams.length,
        }
      );
      Axios.patch(
        'http://localhost:8000/v1/baocaospthang/updateBaoCaoSPThang/' + formatThang,
        {
          SLSANPHAMBAN: bct.SLSANPHAMBAN + sanphams.length,
        }
      );
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Axios.post('http://localhost:8000/v1/baocaospngay/themBaoCaoSPNgay/', {
          THOIGIAN: formatNgay,
          SLSANPHAMNHAN: '0',
          SLSANPHAMBAN: sanphams.length,
        });
        Axios.post('http://localhost:8000/v1/baocaospthang/themBaoCaoSPThang/', {
          THOIGIAN: formatThang,
          SLSANPHAMNHAN: '0',
          SLSANPHAMBAN: sanphams.length,
        });
        console.log('Chưa có báo cáo, hệ thống sẽ tạo báo cáo');
      } else {
        console.log('Lỗi khi gửi yêu cầu Axios: ', error.message);
      }
    }
    // window.alert('Hóa đơn đã được tạo thành công')
    message.success('Hóa đơn đã được tạo thành công')
    setSanPham([]);
    window.location.reload();
  }
  
};
const calculateTotal = () => {
  let total =0;
  for(let i = 0; i < sanphams.length; i++) {
    total+=sanphams[i].GIANHAN;
  }
  return total;
  
};
const [searchkey, setSearchKey] = useState()
const handleSearch = () => {
  if (document.getElementById('searchkey').length === 0) {
      // alert('Vui lòng nhập mã sản phẩm')
    message.warning('Vui lòng nhập mã sản phẩm')
    return
  }
  Axios.get('http://localhost:8000/v1/sanpham/getsanpham/'+searchkey)
  .then(function (response) {
    const sanphammoi = response.data;
    if(sanphammoi.length === 0) {
      // alert('Không có sản phẩm này')
      message.error('Không có sản phẩm này')
      return
    }
    else
    if(sanphammoi.TRANGTHAI === 'Đã bán' || sanphammoi.TRANGTHAI === 'Đã trả lại') {
      // alert('Sản phẩm đã được bán hoặc đã trả lại cho khách ký gửi')
      message.error('Sản phẩm đã được bán hoặc đã trả lại cho khách ký gửi')
      return
    }
    else{
      setSanPham([...sanphams, sanphammoi]);
      setSearchKey('');
    }
  })
  .catch(function (error) {
    console.log(error);
  });
  
};
const handleDelete = (sp) => {
  const answer=window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi hóa đơn?')
  if(!answer) return;
  const updatedSanPhams = sanphams.filter(item => item !== sp);
  setSanPham(updatedSanPhams);
};
  return (
    <div className='AdminPay'>
      <Menu/>
      <Header title="THANH TOÁN" avt='https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg' name={localStorage.getItem('user')}/>
      <div className='AdminPay_main'>
        <div className="AdminPay_Top">
          <input className='AdminPay_ProductInf_Input' id='searchkey' value={searchkey} placeholder='Nhập mã sản phẩm' onChange={(e)=> setSearchKey(e.target.value)}></input>
          <Icon className='AdminPay_ProductInf_SearchBtn' icon="ic:baseline-search" onClick={(e) => {handleSearch()}}/>
        </div>
        <div className="AdminPay_Bottom">
        <div className='AdminPay_Content'>
          <div className='AdminPay_Detail'>
            <div className='AdminPay_CustomerInf'>
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
              <div className='AdminPay_ProductInf' style={{fontWeight:600}}>
                <td></td>                    
                <td>STT</td>
                <td>Tên sản phẩm</td>
                <td>Loại</td>
                <td>Hình ảnh</td>
                <td>Giá</td>
                <td className='btn_deleteProduct'></td>
              </div>
            <div className='AdminPay_ProductList'>
              {
                sanphams.map((sp,index) => {
                    return (
                      <div className='AdminPay_ProductInf'>
                        <td></td>                    
                        <td>{index+1}</td>
                        <td>{sp.TENSANPHAM}</td>
                        <td>{sp.LOAI}</td>
                        <td style={{display:'flex', alignItems:'center', justifyContent:'center'}}><img style={{width:'50px', height:'40px',verticalAlign:'middle', 'objectFit':'cover'}} src={"http://localhost:8000/"+sp.HINHANH}/></td>
                        <td>{sp.GIANHAN.toLocaleString('vi-VN', { maximumFractionDigits: 3 })}đ</td>
                        <td style={{display:'flex', alignItems:'center', justifyContent:'center'}} className='btn_deleteProduct'><Button type="primary" icon={<DeleteOutlined />} onClick={()=> handleDelete(sp)} size='16px'/></td>
                      </div>
                    )
                })
              }
            </div>
            <hr/>
            <div className='AdminPay_ProductInf' style={{fontWeight:600}}>
              <td>Số lượng:</td>               
              <td>{sanphams.length}</td>                    
              <td></td>                    
              <td></td>
              <td>Tổng tiền: </td>
              <td>{calculateTotal().toLocaleString('vi-VN', { maximumFractionDigits: 3 })}đ</td>
            </div>
            <div className='AdminPay_btnChange'>
              <button className='AdminPay_btnConfirm' onClick={handleConfirm}>Xác nhận tạo hóa đơn</button>
            </div>
            
          </div> 
        </div>
        {/* -------------------------------------------------------------- */}
        
      </div>
      </div>
    </div>
  )
}

export default AdminPay