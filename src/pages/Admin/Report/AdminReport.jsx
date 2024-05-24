import React, { useEffect, useState } from 'react'
import Menu from "../Menu/AdminMenu"
import Header from '../../../common/Header/Header'
import './AdminReport.css'
import { Button, DatePicker,message } from 'antd'
import moment from 'moment';
import Axios from "axios";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CommonUtils from './utils/CommonUtils'

function AdminReport() {
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [thang, setThang] = useState(moment().format('MM-YYYY'))
    let [hoadons, setHoaDon] = useState([]);
    let [sum, setSum] = useState(0);
    let [giaban, setGiaBan] = useState(0);
    let [sanphams, setSanPham] = useState([]);
    const getSanPham = async () => {
        if(hoadons.length===0) return
        try {
            const requests = hoadons.map((hoadon) => {
                return Axios.get(`http://localhost:8000/v1/sanpham/getsanphambymabanhang/${hoadon.MAHOADON}`);
            });
            const responses = await Promise.all(requests);
            const allSanPham = responses.map((res) => res.data).flat();
            setSanPham(allSanPham);
        } catch (error) {
          console.log(error.message);
        }
    };
    useEffect(() => {
        if(thang)
        {
            const fetchData = async () => {
                try {
                    const res = await Axios.get(`http://localhost:8000/v1/hoadon/gethoadonbanhangbytg/${thang}`);
                    setHoaDon(res.data);
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        // alert('Chưa có dữ liệu của tháng này')
                        message.warning('Chưa có dữ liệu của tháng này')
                        setSanPham([])
                    }
                }
            };
            fetchData();
        }
    }, [thang]);
      
    useEffect(() => {
        getSanPham();
    }, [hoadons]);

    useEffect(() => {
        setGiaBan(sanphams.reduce((total, sp) => total + sp.GIANHAN, 0));
        setSum(sanphams.reduce((total, sp) => total + sp.HOAHONG, 0));
    }, [sanphams]);
    //   ------------------------------------------TAB2--------------------------
    const [thang1, setThang1] = useState(moment().format('MM-YYYY'))
    let [luong, setLuong] = useState([]);
    let [nhanviens, setNhanVien] = useState([]);
    let [tongluong, settongluong] = useState(0);
    const getNhanVien = async () => {
        if(luong.length===0) return
        try {
            const requests = luong.map((luong) => {
                return Axios.get(`http://localhost:8000/v1/nhanvien/getnhanvienbysdt/${luong.sdt}`);
            });
            const responses = await Promise.all(requests);
            const allNhanVien = responses.map((res) => res.data).flat();
            setNhanVien(allNhanVien);
            console.log(allNhanVien);
        } catch (error) {
          console.log(error.message);
        }
    };
    useEffect(() => {
        if(thang1)
        {
            const fetchData = async () => {
                try {
                    const res = await Axios.get(`http://localhost:8000/v1/luong/getLuongbyTG/${thang1}`);
                    setLuong(res.data[0].LAMVIEC);
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        // alert('Chưa có dữ liệu của tháng này')
                        message.warning('Chưa có dữ liệu của tháng này')
                        setSanPham([])
                    }
                }
            };
            fetchData();
        }
    }, [thang1]);

    useEffect(() => {
        getNhanVien();
    }, [luong]);
    useEffect(() => {
        settongluong(sanphams.reduce((total, sp) => total + sp.GIANHAN, 0));
    }, [sanphams]);
    //   ------------------------------------------TAB3-------------------------
    let [hoadon1, setHoaDon1] = useState([]);

    const getHoaDon1 = async () => {
    try {
        const res = await Axios.get('http://localhost:8000/v1/hoadon/gethoadonkyguibytt');
        const updatedHoaDon = res.data.map((item) => {
        const date = moment(item.NGAYTAODON, 'DD-MM-YYYY, hh:mm:ss a').format('DDMMYYYY');
        const today = moment();
        const compareDate = moment(date, 'DDMMYYYY');
        if (compareDate.diff(today, 'days') <= -60) {
            return item;
        } else {
            return null;
        }
        }).filter(item => item !== null);
        setHoaDon1(updatedHoaDon);
    } catch (error) {
        console.log(error.message);
    }
    };
    useEffect(() => {
        getHoaDon1();
    }, []);

    // Export Doanh Thu
    let arrayDoanhThuExported = []
    let doanhthuE1 = 0
    let doanhthuE2 = 0
    sanphams.forEach((sp,index) => {
        doanhthuE1+=sp.GIANHAN
        doanhthuE2+=sp.HOAHONG
        let doanhthureport = {}
        doanhthureport["STT"] = index+1
        doanhthureport["Mã sản phẩm"] = sp.MASANPHAM
        doanhthureport["Mã hóa đơn"] = sp.MAHOADONKG
        doanhthureport["Giá nhận"] = sp.GIANHAN
        doanhthureport["Hoa hồng"] = sp.HOAHONG

        arrayDoanhThuExported.push(doanhthureport)
    })
    let x = {}
    x["Giá nhận"]=doanhthuE1
    x["Hoa hồng"]=doanhthuE2
    x["STT"]="Tổng:"
    arrayDoanhThuExported.push(x)
    const handleOnClickExport = async() =>{
        await CommonUtils.exportExcel(arrayDoanhThuExported,"Doanh Thu","Doanh Thu Tháng "+ thang)
    }

    // Export Doanh Thu
    let arrayBangLuongExport = []
    let tongluongE = 0
    luong.forEach((lv,index) => {
        const luongnhan = lv.gio * (nhanviens[index] && nhanviens[index].LUONGTHEOGIO || 0)+ (nhanviens[index] && nhanviens[index].LUONGCOBAN || 0);
        tongluongE+=luongnhan;
        let luongreport = {}
        luongreport["STT"] = index+1
        luongreport["Tên nhân viên"] = nhanviens[index] && nhanviens[index].HOTEN
        luongreport["Số giờ làm việc"] = lv.gio
        luongreport["Lương theo giờ"] = nhanviens[index] && nhanviens[index].LUONGTHEOGIO
        luongreport["Lương cơ bản"] = nhanviens[index] && nhanviens[index].LUONGCOBAN
        luongreport["Tổng lương"] = luongnhan

        arrayBangLuongExport.push(luongreport)
    })
    let y = {}
    y["Tổng lương"]=tongluongE
    y["STT"]="Tổng:"
    arrayBangLuongExport.push(y)

    const handleOnClickExport1 = async() =>{
        await CommonUtils.exportExcel(arrayBangLuongExport,"Bảng Lương","Bảng Lương Tháng "+ thang)
    }

    // Export Hóa đơn
    let arrayHoaDonExport = []
    hoadon1.forEach((hd,index) => {
        const arr = hd.SDT.split('-');
        const result = arr[1];
        let luongreport = {}
        luongreport["STT"] = index+1
        luongreport["Mã sản phẩm"] = hd.MAHOADON
        luongreport["Mã sản phẩm"] = hd.SOLUONG
        luongreport["Mã hóa đơn"] = result
        luongreport["Giá nhận"] = hd.NGAYTAODON

        arrayHoaDonExport.push(luongreport)
    })
    
    const handleOnClickExport2 = async() =>{
        await CommonUtils.exportExcel(arrayHoaDonExport,"Hóa đơn quá 60 ngày","Hóa đơn chưa nhận tiền trong vòng 60 ngày kể từ "+moment().format('DD-MM-YYYY'))
    }
    return (
      <div className='AdminReport'>
        <Menu/>
        <Header title="BÁO CÁO" avt='https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg' name={localStorage.getItem('user')}/>
        <div className='AdminReport_main'>
            <div className='AdminReport_information'>
                <Box sx={{ width: '84vw', typography: 'body1', margin:'4vh 2vw 2vh 2vw', background:'#fff' }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="Doanh Thu Sản Phẩm" value="1" />
                            <Tab label="Bảng Lương" value="2" />
                            <Tab label="Hóa Đơn Chưa Nhận Tiền" value="3" />
                        </TabList>
                        </Box>
                        <TabPanel value="1">
                            <div style={{display:'flex', flexDirection:'row',alignItems: 'center' }}>
                                <h4>Chọn tháng:</h4>
                                <DatePicker
                                    style={{ width: '10vw', marginLeft: '1vw'}}
                                    format="MM-YYYY"
                                    picker='month'
                                    allowClear={true}
                                    defaultValue={moment()}
                                    value={thang ? moment(thang, 'MM-YYYY') : null}
                                    onChange={(date, dateString) => {
                                        setThang(dateString);
                                    }}
                                    inputReadOnly={true}
                                />
                            </div>
                            <div style={{maxHeight:'58vh', overflow:'auto'}}>
                                <table>
                                    <tr style={{display:'flex', flexDirection:'row' }}>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px'}}>STT</th>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px'}}>Mã Sản Phẩm</th>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px'}}>Mã Hóa Đơn Ký Gửi</th>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px'}}>Giá Bán</th>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px'}}>Doanh Thu</th>
                                    </tr>
                                    <div>
                                    {
                                        sanphams.map((sanphams,index) => {
                                        return (
                                            <tr style={{display:'flex', flexDirection:'row' }}>
                                                <td style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'center'}}>{index+1}</td>
                                                <td style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'center'}}>{sanphams.MASANPHAM}</td>
                                                <td style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'center'}}>{sanphams.MAHOADONKG}</td>
                                                <td style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'right'}}>{sanphams.GIANHAN.toLocaleString('vi-VN', { maximumFractionDigits: 3 })}đ</td>
                                                <td style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'right'}}>{sanphams.HOAHONG.toLocaleString('vi-VN', { maximumFractionDigits: 3 })}đ</td>
                                            </tr>
                                        )})
                                    }
                                    </div>
                                    <tr style={{display:'flex', flexDirection:'row' }}>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'center'}}>Tổng:</th>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'center'}}></th>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'center'}}></th>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'right'}}>{giaban.toLocaleString('vi-VN', { maximumFractionDigits: 3 })}đ</th>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'right'}}>{sum.toLocaleString('vi-VN', { maximumFractionDigits: 3 })}đ</th>
                                    </tr>
                                </table>
                            </div>
                            <Button style={{background: '#18884F', color: '#FFFFFF', marginTop:'20px'}} onClick={handleOnClickExport}>
                                Xuất báo cáo
                            </Button>
                        </TabPanel>
                        <TabPanel value="2">
                            <div style={{display:'flex', flexDirection:'row',alignItems: 'center' }}>
                                <h4>Chọn tháng:</h4>
                                <DatePicker
                                    style={{ width: '10vw', marginLeft: '1vw'}}
                                    format="MM-YYYY"
                                    picker='month'
                                    allowClear={true}
                                    defaultValue={moment()}
                                    value={thang1 ? moment(thang1, 'MM-YYYY') : null}
                                    onChange={(date, dateString) => {
                                        setThang1(dateString);
                                    }}
                                    inputReadOnly={true}
                                />
                            </div>
                            <div style={{maxHeight:'58vh', overflow:'auto'}}>
                                <table>
                                    <tr style={{display:'flex', flexDirection:'row' }}>
                                        <th style={{border:'solid 1px #000', width:'8vw', fontSize:'14px'}}>STT</th>
                                        <th style={{border:'solid 1px #000', width:'18vw', fontSize:'14px'}}>Tên nhân viên</th>
                                        <th style={{border:'solid 1px #000', width:'13vw', fontSize:'14px'}}>Số giờ làm việc</th>
                                        <th style={{border:'solid 1px #000', width:'13vw', fontSize:'14px'}}>Lương theo giờ</th>
                                        <th style={{border:'solid 1px #000', width:'13vw', fontSize:'14px'}}>Lương cơ bản</th>
                                        <th style={{border:'solid 1px #000', width:'13vw', fontSize:'14px'}}>Tổng lương</th>
                                    </tr>
                                    <div>
                                    {
                                        luong.map((lv,index) =>{
                                            const luongnhan = lv.gio * (nhanviens[index] && nhanviens[index].LUONGTHEOGIO || 0)+ (nhanviens[index] && nhanviens[index].LUONGCOBAN || 0);
                                            return (
                                                <tr style={{display:'flex', flexDirection:'row' }}>
                                                    <td style={{border:'solid 1px #000', width:'8vw', fontSize:'14px', textAlign:'center'}}>{index+1}</td>
                                                    <td style={{border:'solid 1px #000', width:'18vw', fontSize:'14px', textAlign:'center'}}>{nhanviens[index] && nhanviens[index].HOTEN}</td>
                                                    <td style={{border:'solid 1px #000', width:'13vw', fontSize:'14px', textAlign:'right'}}>{lv.gio}</td>
                                                    <td style={{border:'solid 1px #000', width:'13vw', fontSize:'14px', textAlign:'right'}}>{nhanviens[index] && nhanviens[index].LUONGTHEOGIO.toLocaleString('vi-VN', { maximumFractionDigits: 3 })}đ</td>
                                                    <td style={{border:'solid 1px #000', width:'13vw', fontSize:'14px', textAlign:'right'}}>{nhanviens[index] && nhanviens[index].LUONGCOBAN.toLocaleString('vi-VN', { maximumFractionDigits: 3 })}đ</td>
                                                    <td style={{border:'solid 1px #000', width:'13vw', fontSize:'14px', textAlign:'right'}}>{luongnhan.toLocaleString('vi-VN', { maximumFractionDigits: 3 })}đ</td>
                                                </tr>
                                            )})
                                    }
                                    </div>
                                    <tr style={{display:'flex', flexDirection:'row' }}>
                                        <th style={{border:'solid 1px #000', width:'8vw', fontSize:'14px', textAlign:'center'}}>Tổng:</th>
                                        <th style={{border:'solid 1px #000', width:'18vw', fontSize:'14px', textAlign:'center'}}></th>
                                        <th style={{border:'solid 1px #000', width:'13vw', fontSize:'14px', textAlign:'center'}}></th>
                                        <th style={{border:'solid 1px #000', width:'13vw', fontSize:'14px', textAlign:'center'}}></th>
                                        <th style={{border:'solid 1px #000', width:'13vw', fontSize:'14px', textAlign:'center'}}></th>
                                        <th style={{border:'solid 1px #000', width:'13vw', fontSize:'14px', textAlign:'right'}}>{
                                            luong.reduce((acc, lv, index) => {
                                                const luongnhan = lv.gio * (nhanviens[index] && nhanviens[index].LUONGTHEOGIO)+ (nhanviens[index] && nhanviens[index].LUONGCOBAN || 0);
                                                return (acc + luongnhan);
                                            }, 0).toLocaleString('vi-VN')
                                        }đ</th>
                                    </tr>
                                </table>
                            </div>
                            <Button style={{background: '#18884F', color: '#FFFFFF', marginTop:'20px'}} onClick={handleOnClickExport1}>
                                Xuất báo cáo
                            </Button>
                        </TabPanel>
                        <TabPanel value="3">
                            <h4>Hóa đơn chưa nhận tiền trong vòng 60 ngày:</h4>
                            <div style={{maxHeight:'58vh', overflow:'auto'}}>
                                <table>
                                    <tr style={{display:'flex', flexDirection:'row' }}>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px'}}>STT</th>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px'}}>Mã Hóa Đơn</th>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px'}}>Số Lượng Sản Phẩm</th>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px'}}>Khách Hàng</th>
                                        <th style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px'}}>Ngày Ký Gửi</th>
                                    </tr>
                                    <div>
                                    {
                                        hoadon1.map((hd,index) => {
                                            const arr = hd.SDT.split('-');
                                            const result = arr[1];
                                            return (
                                                <tr style={{display:'flex', flexDirection:'row' }}>
                                                    <td style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'center'}}>{index+1}</td>
                                                    <td style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'center'}}>{hd.MAHOADON}</td>
                                                    <td style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'center'}}>{hd.SOLUONG}</td>
                                                    <td style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'center'}}>{result}</td>
                                                    <td style={{border:'solid 1px #000', width:'15.8vw', fontSize:'14px', textAlign:'center'}}>{hd.NGAYTAODON}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </div>
                                </table>
                            </div>
                            <Button style={{background: '#18884F', color: '#FFFFFF', marginTop:'20px'}} onClick={handleOnClickExport2}>
                                Xuất báo cáo
                            </Button>
                        </TabPanel>
                    </TabContext>
                </Box>
                
            </div>
        </div>
      </div>
    )
  }
  
  export default AdminReport