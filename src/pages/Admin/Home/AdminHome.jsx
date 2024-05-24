import React, { useState, useEffect } from 'react';
import "./AdminHome.css"
import { Icon } from '@iconify/react';
import Menu from "../Menu/AdminMenu"
import Header from '../../../common/Header/Header'
import { Link, Navigate } from 'react-router-dom'
import { DatePicker, message } from 'antd';
import moment from 'moment';
import Axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
// function AdminHome({ isAuthenticated }) {
//   if (!isAuthenticated) {
//     return <Navigate to="/" />;
//   }
function AdminHome() {
  console.log('user',localStorage.getItem('user'))
  const today = moment().format('DD-MM-YYYY');
  const today2 = moment().format('MM-YYYY');
  const [thangsp, setThangSP] = useState(moment().format('MM-YYYY'))
  const [dayinmonth, setDayInMonth] = useState(moment(thangsp, 'MM-YYYY').daysInMonth())
  const options = {
    responsive: true,
    maintainAspectRatio: false // Tắt tự động điều chỉnh kích thước
  };

  let [khachhangs, setKhachHang] = useState([])
  let [nhanviens, setNhanViens] = useState([])
  let [sanphamngay, setSanPhamNgay] = useState([])
  const getBlock = async() => {
    const res = await Axios.get('http://localhost:8000/v1/nhanvien/getnhanvien')
    setNhanViens(res.data);
    nhanviens=res.data;

    const res1 = await Axios.get('http://localhost:8000/v1/khachhang/getkhachhang')
    setKhachHang(res1.data);
    khachhangs=res1.data;
    try{
      const res2 = await Axios.get('http://localhost:8000/v1/baocaospngay/getBaoCaoSPNgay/'+ today)
      setSanPhamNgay(res2.data);
      sanphamngay=res2.data;
    }catch(error) {
      if (error.response && error.response.status === 404) {
        Axios.post('http://localhost:8000/v1/baocaospngay/themBaoCaoSPNgay/', {
          THOIGIAN: today,
          SLSANPHAMNHAN: 0,
          SLSANPHAMBAN: 0,
        });
        console.log('Chưa có báo cáo, hệ thống sẽ tạo báo cáo');
        window.location.reload();
      } else {
        console.log('Lỗi khi gửi yêu cầu Axios: ', error.message);
      }
    }
  }
  const [data1, setData1] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Sản phẩm bán được',
        data: ['100','200','500','400','600','100','100','200','500','400','600','100'],
        borderColor: 'rgba(6, 170, 171)',
        backgroundColor: 'rgba(6, 170, 171, 0.5)',
      },
      {
        label: 'Sản phẩm nhận ký gửi',
        data: ['200','400','50','800','300','300','500','100','300','900','200','800'],
        borderColor: 'rgb(255, 119, 119)',
        backgroundColor: 'rgb(255, 119, 119, 0.5)',
      },
    ],
  });
  const getdata1 = async () => {
    const arr = Array.from({ length: parseInt(dayinmonth) }, (_, index) => index+1);
    const arr1 = Array(parseInt(dayinmonth)).fill(0);
    const arr2 = Array(parseInt(dayinmonth)).fill(0);
    try {
      const response = await Axios.get('http://localhost:8000/v1/baocaospngay/getBaoCaoSPNgaybyMMYY/' + today2);
      const bcn = response.data;
      for (let i = 0; i< bcn.length; i++) {
        let str= bcn[i].THOIGIAN.split("-")[0];
        arr1[parseInt(str)-1]=bcn[i].SLSANPHAMBAN;
        arr2[parseInt(str)-1]=bcn[i].SLSANPHAMNHAN;
      }
      const newData = {
        labels: arr,
        datasets: [
          {
            label: 'Sản phẩm bán được',
            data: arr1,
            borderColor: 'rgba(6, 170, 171)',
            backgroundColor: 'rgba(6, 170, 171, 0.5)',
          },
          {
            label: 'Sản phẩm nhận ký gửi',
            data: arr2,
            borderColor: 'rgb(255, 119, 119)',
            backgroundColor: 'rgb(255, 119, 119, 0.5)',
          },
        ],
      };
      setData1(newData);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        await Axios.post('http://localhost:8000/v1/baocaospngay/themBaoCaoSPNgay/', {
          THOIGIAN: today,
          SLSANPHAMNHAN: 0,
          SLSANPHAMBAN: 0,
        });
        console.log('Chưa có báo cáo, hệ thống sẽ tạo báo cáo');
        const newData = {
          labels: arr,
          datasets: [
            {
              label: 'Sản phẩm bán được',
              data: arr1,
              borderColor: 'rgba(6, 170, 171)',
              backgroundColor: 'rgba(6, 170, 171, 0.5)',
            },
            {
              label: 'Sản phẩm nhận ký gửi',
              data: arr2,
              borderColor: 'rgb(255, 119, 119)',
              backgroundColor: 'rgb(255, 119, 119, 0.5)',
            },
          ],
        };
        setData1(newData);
      } else {
        console.log('Lỗi khi gửi yêu cầu Axios: ', error.message);
      }
    }
  }
  const handleSPThang = async (dateString) => {
    if (dateString !== '') {
      
      try {
        const response = await Axios.get('http://localhost:8000/v1/baocaospngay/getBaoCaoSPNgaybyMMYY/' + dateString);
        const bcn = response.data;
        const arr = Array.from({ length: parseInt(dayinmonth) }, (_, index) => index+1);
        const arr1 = Array(parseInt(dayinmonth)).fill(0);
        const arr2 = Array(parseInt(dayinmonth)).fill(0);
        for (let i = 0; i< bcn.length; i++) {
          let str= bcn[i].THOIGIAN.split("-")[0];
          arr1[parseInt(str)-1]=bcn[i].SLSANPHAMBAN;
          arr2[parseInt(str)-1]=bcn[i].SLSANPHAMNHAN;
        }
        const newData = {
          labels: arr,
          datasets: [
            {
              label: 'Sản phẩm bán được',
              data: arr1,
              borderColor: 'rgba(6, 170, 171)',
              backgroundColor: 'rgba(6, 170, 171, 0.5)',
            },
            {
              label: 'Sản phẩm nhận ký gửi',
              data: arr2,
              borderColor: 'rgb(255, 119, 119)',
              backgroundColor: 'rgb(255, 119, 119, 0.5)',
            },
          ],
        };
        setData1(newData);
      } catch (error) {
        if (error.response && error.response.status === 404) {
            // alert('Chưa có dữ liệu. Vui lòng chọn ngày khác.');
          message.warning('Chưa có dữ liệu. Vui lòng chọn thời gian khác.')
          setThangSP(today)
        }
      }
    }
  };
  useEffect(() => {
    getBlock();
    if (thangsp) {
      handleSPThang(thangsp);
    } else {
        getdata1();
    }
  }, [thangsp]);
  const currentYear = new Date().getFullYear();
  const yearList = [];
  for (let i = 1900; i <= currentYear; i++) {
    yearList.push(<option key={i} value={i}>{i}</option>);
  }
  return (
    <div className='AdminHome'>
      <Menu/>
      <Header title="TRANG CHỦ" avt='https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg' name={localStorage.getItem('user')}/>
      <div className='AdminHome_main'>
        <div className='AdminHome_Overview'>
        <div className='Overview_block1'>
            <div className='Block_top'>
              <Icon icon="fluent-mdl2:product-variant" />
              <span className='Quantity'>{sanphamngay.SLSANPHAMNHAN}</span>
            </div>
            <p className='Block_bottom' style={{color:'#517dff'}}>Sản phẩm đã nhận hôm nay</p>
          </div>
          <div className='Overview_block2'>
            <div className='Block_top'>
              <Icon icon="la:file-invoice-dollar" />
              <span className='Quantity'>{sanphamngay.SLSANPHAMBAN}</span>
            </div>
            <p className='Block_bottom' style={{color:'#ff333f'}}>Sản phẩm đã bán hôm nay</p>
          </div>
          <div className='Overview_block3'>
            <div className='Block_top'>
              <Icon icon="clarity:employee-group-line" />
              <span className='Quantity'>{nhanviens.length}</span>
            </div>
            <p className='Block_bottom' style={{color:'#ff9533'}}>Nhân viên của cửa hàng</p>
          </div>
          <div className='Overview_block4'>
            <div className='Block_top'>
              <Icon icon="la:file-invoice-dollar" />
              <span className='Quantity'>8</span>
            </div>
            <p className='Block_bottom' style={{color:'#30d559'}}>Số lượng khách hôm nay</p>
          </div>
        </div>
{/* -------------------------------------------------------------- */}
        <div className="AdminHome_Bottom">
          <div className='AdminHome_Chart'>
            <div className='AdminHome_Chart_Label'>
              <div className='Chart_Name'>Biểu đồ sản phẩm ký gửi và bán ra</div>
              <div className='Chart_Date'>
                <p className='Chart_LabelDay' style={{color:'#35a2eb'}}>Tháng:</p>
                <DatePicker
                  style={{ width: '8vw', height: '3vh', marginLeft: '1vw' }}
                  format="MM-YYYY"
                  picker='month'
                  allowClear={true}
                  defaultValue={moment()}
                  value={thangsp ? moment(thangsp, 'MM-YYYY') : null}
                  onChange={(date, dateString) => {
                    setThangSP(dateString);
                    const numOfDays = moment(dateString, 'MM-YYYY').daysInMonth();
                    setDayInMonth(numOfDays);
                    // handleSPThang(dateString);
                  }}
                />
              </div>
            </div>
            {/* -------------------------------------------------------------- */}
            <Line data={data1} options={options} />
          </div>
          <div className='AdminHome_CustomerRecent'>
            <div className='CustomerRecent_Label'>Khách hàng gần đây</div>
              <div className='CustomerRecent_Info_List'>
                {
                  khachhangs.map((khachhangs,index) => {
                    if (index < 10) {
                      return (
                          <div className='CustomerRecent_Info'>
                            <img className='CustomerRecent_Avt' src='https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg' alt="image"/>
                            <div className='CustomerRecent_Name'>{khachhangs.HOTEN}</div>
                            <div className='CustomerRecent_Phone'>{khachhangs.SDT}</div>
                          </div>
                        )
                    }
                    })
                }
              </div>
            <Link to='/admin/customer'>
              <div className='CustomerRecent_ViewMore'>Xem thêm <Icon icon="ic:round-read-more" color="#878787" /></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome