import React, { useState, useEffect } from 'react';
import "./AdminChart.css";
import { Icon } from '@iconify/react';
import moment from 'moment';
import Menu from "../Menu/AdminMenu";
import Header from '../../../common/Header/Header';
import { DatePicker, message } from 'antd';
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
  BarElement,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
);

function AdminChart() {
  const today = moment().format('DD-MM-YYYY');
  const today1 = moment().format('YYYY');
  const today2 = moment().format('MM-YYYY');
  const [ngay, setNgay] = useState(moment().format('DD-MM-YYYY'))
  const [namdt, setNamDT] = useState(moment().format('YYYY'))
  const [thangsp, setThangSP] = useState(moment().format('MM-YYYY'))
  const [dayinmonth, setDayInMonth] = useState(moment(thangsp, 'MM-YYYY').daysInMonth())
  // console.log('n',dayinmonth)
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

  const [data2, setData2] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Sales',
        backgroundColor: 'rgb(90, 106, 207)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      }
    ]
  });

  const getdata2 = async () => {
    try {
      const response = await Axios.get('http://localhost:8000/v1/baocaodtthang/getBaoCaoDTThangbyyear/' + today1);
      const bcn = response.data;
      const myArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i< bcn.length; i++) {
        let str= bcn[i].THOIGIAN.split("-")[0];
        myArray[parseInt(str)-1]=bcn[i].DOANHTHU;
      }
      const newData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'Sales',
            backgroundColor: 'rgb(90, 106, 207)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 1,
            data: myArray,
          }
        ]
      };
      setData2(newData);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        await Axios.post('http://localhost:8000/v1/baocaodtthang/themBaoCaoDTThang/', {
          THOIGIAN: today2,
          DOANHTHU: 0,
          SANPHAM: [],
        });
        console.log('Chưa có báo cáo, hệ thống sẽ tạo báo cáo');
        const newData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: 'Sales',
              backgroundColor: 'rgb(90, 106, 207)',
              borderColor: 'rgba(0,0,0,1)',
              borderWidth: 1,
              data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            }
          ]
        };
        setData2(newData);
      } else {
        console.log('Lỗi khi gửi yêu cầu Axios: ', error.message);
      }
    }
  }

  const [data3, setData3] = useState({
    labels: ['Nhận', 'Bán'],
    datasets: [{
      label: 'Sản phẩm',
      data: [0, 0],
      backgroundColor: [
        'rgb(249, 175, 94,0.54)',
        'rgb(90, 106, 207)'
      ],
      hoverOffset: 4
    }]
  });

  const getdata3 = async () => {
    try {
      const response = await Axios.get('http://localhost:8000/v1/baocaospngay/getBaoCaoSPNgay/' + today);
      const bcn = response.data;
      const newData = {
        labels: ['Nhận', 'Bán'],
        datasets: [{
          label: 'Sản phẩm',
          data: [bcn.SLSANPHAMNHAN, bcn.SLSANPHAMBAN],
          backgroundColor: [
            'rgb(249, 175, 94,0.54)',
            'rgb(90, 106, 207)'
          ],
          hoverOffset: 4
        }]
      };
      setData3(newData);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        await Axios.post('http://localhost:8000/v1/baocaospngay/themBaoCaoSPNgay/', {
          THOIGIAN: today,
          SLSANPHAMBAN: 0,
          SLSANPHAMNHAN: 0,
        });
        console.log('Chưa có báo cáo, hệ thống sẽ tạo báo cáo');
        const newData = {
          labels: ['Nhận', 'Bán'],
          datasets: [{
            label: 'Sản phẩm',
            data: [0, 0],
            backgroundColor: [
              'rgb(249, 175, 94,0.54)',
              'rgb(90, 106, 207)'
            ],
            hoverOffset: 4
          }]
        };
        setData3(newData);
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
        
      }
    }
  };

  const handleSPNgay = async (dateString) => {
    if (dateString !== '') {
      try {
        const response = await Axios.get('http://localhost:8000/v1/baocaospngay/getBaoCaoSPNgay/' + dateString);
          const bcn = response.data;
          const newData = {
              labels: ['Nhận', 'Bán'],
              datasets: [{
                  label: 'Sản phẩm',
                  data: [bcn.SLSANPHAMNHAN, bcn.SLSANPHAMBAN],
                  backgroundColor: [
                      'rgb(249, 175, 94,0.54)',
                      'rgb(90, 106, 207)'
                  ],
                  hoverOffset: 4
              }]
          };
          if(bcn.SLSANPHAMNHAN===0 && bcn.SLSANPHAMBAN===0) {
            // alert('Chưa có dữ liệu. Vui lòng chọn ngày khác.');
            message.warning('Chưa có dữ liệu. Vui lòng chọn ngày khác.')
            setNgay(today)
          }
          setData3(newData);
      } catch (error) {
          if (error.response && error.response.status === 404) {
            // alert('Chưa có dữ liệu. Vui lòng chọn ngày khác.');
            message.warning('Chưa có dữ liệu. Vui lòng chọn ngày khác.')
            setNgay(today)
          }
      }
    }
  };
  
  const handleDTThang = async (dateString) => {
    if (dateString !== '') {
      try {
        // console.log('chi');
        const response = await Axios.get('http://localhost:8000/v1/baocaodtthang/getBaoCaoDTThangbyyear/' + dateString);
        const bcn = response.data;
        const myArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i< bcn.length; i++) {
          let str= bcn[i].THOIGIAN.split("-")[0];
          myArray[parseInt(str)-1]=bcn[i].DOANHTHU;
        }
        const newData = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: 'Sales',
              backgroundColor: 'rgb(90, 106, 207)',
              borderColor: 'rgba(0,0,0,1)',
              borderWidth: 1,
              data: myArray,
            }
          ]
        };
        if(myArray === [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) {
          // alert('Chưa có dữ liệu. Vui lòng chọn năm khác.');
          message.warning('Chưa có dữ liệu. Vui lòng chọn năm khác.')
          // window.location.reload();
        }
        setData2(newData);
        } catch (error) {
          if (error.response && error.response.status === 404) {
          message.warning('Chưa có dữ liệu. Vui lòng chọn năm khác.')
          // window.location.reload();
          }
      }
    }
  };
  
  useEffect(() => {
    if (ngay) {
        handleSPNgay(ngay);
    } else {
        getdata3();
    }

    if (namdt) {
      handleDTThang(namdt);
    } else {
        getdata2();
    }

    if (thangsp) {
      handleSPThang(thangsp);
    } else {
        getdata1();
    }
  }, [ngay, namdt, thangsp]);

  const options = {
    responsive: true,
    maintainAspectRatio: false // Tắt tự động điều chỉnh kích thước
  };
  return (
    <div className='AdminChart'>
      <Menu/>
      <Header title="BIỂU ĐỒ" avt='https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg' name={localStorage.getItem('user')}/>
      <div className='AdminChart_main'>
        <div className='AdminChart_Top'>
          <div className='AdminChart_Chart'>
            <div className='AdminChart_Chart_Label'>
              <div className='Chart_Name'>Biểu đồ sản phẩm nhận vào và bán ra</div>
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
              <Line data={data1} options={options} />
          </div>
        </div>
{/* -------------------------------------------------------------- */}
        <div className="AdminChart_Bottom">
        <div className='AdminChart_Chart'>
            {/* <div className='Chart_Name'>Biểu đồ doanh thu theo tháng</div> */}
            <div className='AdminChart_Chart_Label'>
              <div className='Chart_Name'>Biểu đồ doanh thu theo tháng</div>
              <div className='Chart_Date'>
                <p className='Chart_LabelDay' style={{color:'#35a2eb'}}>Năm:</p>
                <DatePicker
                  style={{ width: '8vw', height: '3vh', marginLeft: '1vw' }}
                  format="YYYY"
                  picker='year'
                  allowClear={true}
                  defaultValue={moment()}
                  value={namdt ? moment(namdt, 'YYYY') : null}
                  onChange={(date, dateString) => {
                    setNamDT(dateString);
                    // handleDTThang(dateString);
                  }}
                />
              </div>
            </div>
            <Bar data={data2} options={options} />
          </div>
          <div className='AdminChart_ProductPercents'>
            <div className='AdminChart_ProductPercents_title'>
              <div className='ProductPercents_Label'>Số sản phẩm ngày: </div>
              <DatePicker
                style={{ width: '8vw', height: '3vh', marginLeft: '1vw' }}
                format="DD-MM-YYYY"
                allowClear={true}
                defaultValue={moment()}
                value={ngay ? moment(ngay, 'DD-MM-YYYY') : null}
                onChange={(date, dateString) => {
                  setNgay(dateString);
                  // handleSPNgay(dateString);
                }}
              />
            </div>
            <Doughnut data={data3} options={options} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminChart