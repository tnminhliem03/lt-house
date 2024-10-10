import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Box, createTheme, Grid, IconButton, Modal, ThemeProvider, Typography, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DrawOutlinedIcon from '@mui/icons-material/DrawOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Api, { endpoints } from '../../../Config/Api';
import { useLayoutContext } from '../../../Context/LayoutContext';
import { useProfileContext } from '../../../Context/ProfileContext';
import { useAuthContext } from '../../../Context/AuthContext';
import './Payment.css';

const theme = createTheme();

function Receipt({ open, onClose, payment }) {
    const { currentUser } = useAuthContext();
    const { currentUserInfo } = useProfileContext();
    const { modalStyle } = useLayoutContext();

    const iconStyle = { width: { xs: 25, sm: 45, lg: 60 }, height: { xs: 25, sm: 45, lg: 60 } };
    
    const [receipt, setReceipt] = useState([]);
    const [name, setName] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [orderId, setOrderId] = useState('');
    const [amount, setAmount] = useState('');
    const [payMethod, setPayMethod] = useState('');

    const isLg = useMediaQuery(theme.breakpoints.down('lg'));


    const payMethodOptions = [
        { value: 'momo', label: 'Ví điện tử MOMO' },
        { value: 'vnpay', label: 'Ví điện tử VNPAY' }
    ];

    const selectedPayMethod = payMethodOptions.find((option) => option.value === payMethod)?.label || 'Unknown Method';

    useEffect(() => {
        const fetchReceipt = async (payment) => {        
            try {
                const res = await Api.get(endpoints.receipts);
    
                if (res.data && Array.isArray(res.data)) {
                    const paymentReceipt = res.data.filter((r) => r.payment === payment.id);
                    setReceipt(paymentReceipt);
                } else {
                    console.error("Không lấy được!");
                }
            } catch (error) {
                console.error("Lỗi lấy thông tin hóa đơn: ", error);
            };
        };

        if (open && payment) {
            fetchReceipt(payment);
        }
    }, [open, payment]);

    useEffect(() => {
        if (receipt.length > 0) {
            const firstReceipt = receipt[0];
            setName(firstReceipt.name);
            setCreatedDate(firstReceipt.created_date);
            setAmount(firstReceipt.amount);
            setPayMethod(firstReceipt.pay_method);
            setOrderId(firstReceipt.order_id);
        }
        console.log(receipt);
    }, [receipt]);

    return (
        <ThemeProvider theme={theme}>
            <React.Fragment key="receipt">
                <Modal open={open} onClose={onClose}>
                    <Box sx={{ ...modalStyle, width: '65%'  }}>
                        <IconButton aria-label="close" onClick={onClose} className="btn btn-close">
                            <CloseIcon/>
                        </IconButton>

                        <Box>
                            <Typography variant="h5" component="div" className="primary-text text-center mb-3r uppercase-text">
                                Bảng kê chi tiết {name}
                            </Typography>  

                            <Grid container spacing={4}>
                                <Grid item xs={12} lg={6}>
                                    <Grid container spacing={0} className="mb-3r">
                                        <Grid item xs={4.5} sm={2.5} lg={4}>
                                            <Typography variant="body1" component="div" className="description-text">
                                                Tên khách hàng:
                                            </Typography>  
                                        </Grid>
                                        
                                        <Grid item xs={7.5} lg={8}>
                                            <Typography variant="body1" component="div" className="description-text">
                                                {currentUser.displayName}
                                            </Typography>  
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={0} className="mb-3r">
                                        <Grid item xs={4.5} sm={2.5} lg={4}>
                                            <Typography variant="body1" component="div" className="description-text">
                                                Số điện thoại:
                                            </Typography>  
                                        </Grid>
                                        
                                        <Grid item xs={7.5} lg={8}>
                                            <Typography variant="body1" component="div" className="description-text">
                                                {currentUserInfo.phone} 
                                            </Typography>  
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={0} className="mb-3r">
                                        <Grid item xs={4.5} sm={2.5} lg={4}>
                                            <Typography variant="body1" component="div" className="description-text">
                                                Email:
                                            </Typography>  
                                        </Grid>
                                        
                                        <Grid item xs={7.5} lg={8}>
                                            <Typography variant="body1" component="div" className="description-text">
                                                {currentUserInfo.email}
                                            </Typography>  
                                        </Grid>
                                    </Grid>

                                    {/* <Grid container spacing={0} className="mb-3r">
                                        <Grid item xs={4}>
                                            <Typography variant="body1" component="div" className="description-text">
                                            Số phòng: 
                                            </Typography>  
                                        </Grid>
                                        
                                        <Grid item xs={8}>
                                            <Typography variant="body1" component="div" className="description-text">
                                                {currentUserInfo.rooms.map((r) => r.number).join(', ')}
                                            </Typography>  
                                            </Grid>
                                            </Grid> */}

                                    <Grid container spacing={0} className="mb-3r">
                                        <Grid item xs={12} lg={4} >
                                            <Typography variant="body1" component="div" className="description-text" gutterBottom>
                                                Mã thanh toán:
                                            </Typography>  
                                        </Grid>
                                        
                                        <Grid item xs={12} lg={8}>
                                            <Typography variant="body1" component="div" className="description-text">
                                                {orderId}
                                            </Typography>  
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item lg={6}>
                                    <Grid container spacing={3} direction="column">
                                        <Grid item>
                                            <Box className="r-box">
                                                {!isLg && (
                                                    <AccountCircleOutlinedIcon sx={iconStyle} className="mr-15r" />
                                                )}

                                                <Box>
                                                    <Typography variant="body1" component="div" className="white-text">
                                                        Mã khách hàng
                                                    </Typography>  

                                                    <Typography variant="h6" component="div" className="white-text">
                                                        {currentUser.uid}
                                                    </Typography>  
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item>
                                            <Box className="r-box">
                                                {isLg ? null :(
                                                    <DrawOutlinedIcon sx={iconStyle} className="mr-15r" />
                                                )}

                                                <Box>
                                                    <Typography variant="body1" component="div" className="white-text">
                                                        Số tiền thanh toán
                                                    </Typography>  

                                                    <Typography variant="h6" component="div" className="white-text">
                                                        {`${amount.toLocaleString('vi-VN')} đồng`}
                                                    </Typography>  
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item>
                                            <Box className="r-box">
                                                {!isLg && (
                                                    <CalendarMonthOutlinedIcon sx={iconStyle} className="mr-15r" />
                                                )}

                                                <Box>
                                                    <Typography variant="body1" component="div" className="white-text">
                                                        Thời gian thanh toán
                                                    </Typography>  

                                                    <Typography variant="h6" component="div" className="white-text">
                                                        {dayjs(createdDate).format('DD-MM-YYYY [lúc] HH [giờ] mm [phút]')}
                                                    </Typography>  
                                                </Box>
                                            </Box>
                                        </Grid>

                                        <Grid item>
                                            <Box className="r-box">
                                                {!isLg && (
                                                    <PaymentOutlinedIcon sx={iconStyle} className="mr-15r" />
                                                )}

                                                <Box>
                                                    <Typography variant="body1" component="div" className="white-text">
                                                        Phương thức thanh toán
                                                    </Typography>  

                                                    <Typography variant="h6" component="div" className="white-text">
                                                        {selectedPayMethod}
                                                    </Typography>  
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid> 
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Modal>     
            </React.Fragment>
        </ThemeProvider>
    );
};

export default Receipt;