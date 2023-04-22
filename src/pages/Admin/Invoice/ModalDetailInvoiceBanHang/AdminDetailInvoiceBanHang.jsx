import React, { useState, useEffect } from 'react';
import './AdminDetailInvoiceBanHang.css'
import Axios from "axios";

function AdminDetailInvoiceBanHang(props) {
let [sanphams, setSanPham] = useState([])
const getSANPHAM = async () => {
    try {
        const res = await Axios.get('http://localhost:8000/v1/sanpham/getsanphambymabanhang/'+ props.data.MAHOADON)
        setSanPham(res.data);
        sanphams=res.data;
    }
    catch (error) {
        console.log(error.message)
    }
  }
  let [hoadons, setHoaDon] = useState([''])
  const getHOADON = async () => {
      try {
          const res = await Axios.get('http://localhost:8000/v1/hoadon/gethoadon/'+ props.data.MAHOADON)
          setHoaDon(res.data);
          hoadons=res.data;
          console.log('a',hoadons[0])

      }
      catch (error) {
          console.log(error.message)
      }
  }
  useEffect(() => {
    getSANPHAM();
    getHOADON();
  }, [])
  const calculateTotal = () => {
    let total =0;
    for(let i = 0; i < sanphams.length; i++) {
      total+=sanphams[i].GIANHAN;
    }
    return total;
  };
  return (
    <div className="AdminDetailInvoiceBanHang">
      <div className="AdminDetailInvoiceBanHang_modal">
        <div className="AdminDetailInvoiceBanHang_modal-header">
          <h3>{props.title}</h3>
          <button onClick={props.onClose}>X</button>
        </div>
        <div className="AdminDetailInvoiceBanHang_Bottom">
            <div className='AdminDetailInvoiceBanHang_Detail'>
              <div className='AdminDetailInvoiceBanHang_Detail_Content_Date'>
                <p className='AdminDetailInvoiceBanHang_Detail_Content_LabelDay'>Ngày lập hóa đơn: </p>
                <p className='AdminDetailInvoiceBanHang_Detail_Content_Calendar'>{hoadons[0].NGAYTAODON}</p>
              </div>
              <div className='AdminDetailInvoiceBanHang_Detail_Content_Date'>
                <p className='AdminDetailInvoiceBanHang_Detail_Content_LabelDay'>Khách hàng: </p>
                <p className='AdminDetailInvoiceBanHang_Detail_Content_Customer'>{hoadons[0].SDT}</p>
              </div>
              {/* <p className='AdminDetailInvoiceBanHang_Detail_ProductInf_Label'>Sản phẩm:</p> */}
              <div className='AdminDetailInvoiceBanHang_Detail_Content_Date'>
                <p className='AdminDetailInvoiceBanHang_Detail_Content_LabelDay'>Mã hóa đơn: </p>
                <p className='AdminDetailInvoiceBanHang_Detail_Content_Customer'>{hoadons[0].MAHOADON}</p>
              </div>
              <div className='AdminDetailInvoiceBanHang_ProductInf'>
                <td style={{fontWeight:'500'}}>Hình ảnh</td>
                <td style={{fontWeight:'500'}}>STT</td>
                <td style={{fontWeight:'500'}}>Tên sản phẩm</td>
                <td style={{fontWeight:'500'}}>Mã đơn gửi</td>
                <td style={{fontWeight:'500'}}>Giá bán</td>
              </div>
            <div className='AdminDetailInvoiceBanHang_ProductList'>
              {
                sanphams.map((sanphams,index) => {
                    return (
                      <div className='AdminDetailInvoiceBanHang_ProductInf'>
                        {/* <td></td>                     */}
                        <td><img style={{width:'50px', height:'40px'}} src={"http://localhost:8000/"+sanphams.HINHANH}/></td>
                        <td>{index+1}</td>
                        <td>{sanphams.TENSANPHAM}</td>
                        <td>{sanphams.TRANGTHAI}</td>
                        <td>{sanphams.GIANHAN}</td>
                      </div>
                    )
                })
              }
            </div>
              <div className='AdminDetailInvoiceBanHang_ProductInf'>
                <td style={{fontWeight:'500'}}>Số lượng:</td>                    
                <td style={{fontWeight:'500'}}>{sanphams.length}</td>                    
                <td></td>
                <td style={{fontWeight:'500'}}>Tổng tiền:</td>
                <td style={{fontWeight:'500'}}>{calculateTotal()}</td>
              </div>     
            </div> 
          {/* -------------------------------------------------------------- */}
        </div>
        <div className='AdminDetailInvoiceBanHang_modal_Btn_Change'>
            <button className='AdminDetailInvoiceBanHang_modal_Btn_Change_Cancel' onClick={props.onClose}>Hủy bỏ</button>
            <button className='AdminDetailInvoiceBanHang_modal_Btn_Change_Confirm'>In barcode sản phẩm</button>
        </div>
      </div>
    </div>
  )
}

export default AdminDetailInvoiceBanHang