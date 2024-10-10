import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Container, createTheme, Grid, Menu, MenuItem, Typography, useMediaQuery, ThemeProvider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import Api, { endpoints } from '../../../Config/Api';
import { useLayoutContext } from '../../../Context/LayoutContext';
import { useProfileContext } from '../../../Context/ProfileContext';
import Receipt from './Receipt';
import './Payment.css';

const theme = createTheme();

function Payment() {
    const { currentUserInfo } = useProfileContext();
    const { setIsLoading, Loading } = useLayoutContext();

    const [nextPage, setNextPage] = useState(null);
    const [payments, setPayments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const openPayMethods = Boolean(anchorEl);
    const accessToken = localStorage.getItem('accessToken');

    const handleOpenPayMethods = (event, payment) => {
        setAnchorEl(event.currentTarget);
        setSelectedPayment(payment);
    };

    const handleClosePayMethods = (event) => {
        setAnchorEl(null);
        setSelectedPayment(null);
    }

    const fetchPayments = async (url, reset = false) => {
        setIsLoading(true);
        
        try {
            const res = await Api.get(url);

            if (res.data && Array.isArray(res.data.results)) {
                const userPayments = res.data.results.filter((p) => p.resident === currentUserInfo.id);
                setPayments((prevPayment) => reset ? userPayments : [...prevPayment, ...userPayments]);
                setNextPage(res.data.next);
            } else {
                console.error("Không có danh sách nào tồn tại!");
            }
        } catch (error) {
            console.error("Lỗi lấy thông tin hóa đơn: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments(endpoints.payments, true);
    }, [currentUserInfo]);

    useEffect(() => {
        if (nextPage) {
            fetchPayments(nextPage);
        }
    }, [nextPage]);

    const handleOpenModal = (payment) => {
        setSelectedPayment(payment);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedPayment(null);
    };

    const handleMomoMethod = async () => {
        setIsLoading(true);

        try {
            const res = await Api.post(endpoints['momo-methods'](selectedPayment.id), {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const momoLink = res.data.shortLink;
            window.open(momoLink, '_blank');
        } catch (error) {
            console.log("Hiện tại hệ thống đang lỗi. Vui lòng thử lại sau!", error);
        } finally {
            setIsLoading(false);
        };
    };

    const handleVnpMethod = async () => {
        console.log("handleVnpMethod được gọi với payment:", selectedPayment.id);
        setIsLoading(true);

        try {
            const res = await Api.post(endpoints['vnp-methods'](selectedPayment.id), {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log(res.data);
            const vnpLink = res.data.payment_url;
            window.open(vnpLink, '_blank');
        } catch (error) {
            console.log("Hiện tại hệ thống đang lỗi. Vui lòng thử lại sau!", error);
        } finally {
            setIsLoading(false);
        };
    };

    return (
        <ThemeProvider theme={theme}>
            <React.Fragment key="payment">
                <Container maxWidth="lg">
                    <Box className="mt-3r mb-3r plpr-24">
                        <Box>
                            <Typography variant="h4" component="div" className="primary-text text-center">
                                Danh sách hóa đơn
                            </Typography>

                            <Typography variant="h6" component="div" className="description-text text-center">
                                Các hóa đơn của bạn tại chung cư
                            </Typography>
                        </Box>

                        <Grid container spacing={5} className="mt-1r">
                            {payments.sort((a,b) => new Date(b.created_date) - new Date(a.created_date)).map((payment) => (
                                <Grid item xs={12} lg={6} key={payment.id}>
                                    <Card className="inner-height" key={payment.id}>
                                        <CardContent>
                                            <Grid container spacing={2.5} className="align-center">
                                                <Grid item xs={12} sm={7.5}>
                                                    <Typography variant="h6" component="div" className="primary-text">
                                                        {payment.name}
                                                    </Typography>
                                                </Grid>

                                                {!isSm && (
                                                    <Grid item sm={4.5} className="text-end">
                                                        <Button variant="contained" className={`align-center card-status white-text ${payment.active ? '' : 'c-status-done'}`}
                                                            disabled startIcon={payment.active ? <HourglassBottomIcon /> : <CheckCircleIcon />}>
                                                                {payment.active ? 'Chưa thanh toán' : 'Đã thanh toán' }
                                                        </Button>
                                                    </Grid>
                                                )}

                                                <Grid item xs={12}>
                                                    <Grid container spacing={3} className="align-center">
                                                        <Grid item xs={5} sm={7.5}>
                                                            <Typography variant="body1" component="div" className="secondary-text">
                                                                Id hóa đơn: {payment.id}
                                                            </Typography>
                                                        </Grid>

                                                        <Grid item xs={7} sm={4.5} className="text-end">
                                                            {isSm ? (
                                                                <Typography variant="h5" fontWeight="600" component="div" color="error">
                                                                    {`${payment.amount.toLocaleString('vi-VN')} VND`}
                                                                </Typography>
                                                            ) : (
                                                                <Button disabled={payment.active} variant="contained" startIcon={<RemoveRedEyeIcon />} onClick={() => handleOpenModal(payment)}>
                                                                    Xem chi tiết
                                                                </Button>
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>

                                                {isSm ? (
                                                    <>
                                                        <Grid item xs={6} className="text-end">
                                                            <Button disabled={payment.active} variant="contained" startIcon={<RemoveRedEyeIcon />} onClick={() => handleOpenModal(payment)}>
                                                                Xem chi tiết
                                                            </Button>
                                                        </Grid>

                                                        <Grid item xs={6}>
                                                            <Button variant="contained" id="pay-btn" aria-haspopup="true" disabled={!payment.active}
                                                                aria-expanded={openPayMethods ? 'true' : undefined} onClick={(event) => handleOpenPayMethods(event, payment)}
                                                                aria-controls={openPayMethods ? 'pay-methods' : undefined} endIcon={<KeyboardArrowDownIcon />}>
                                                                    Thanh toán
                                                            </Button>
                                                            
                                                            <Menu id="pay-methods" anchorEl={anchorEl} open={openPayMethods} onClose={handleClosePayMethods}
                                                                MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                                                                    <MenuItem value="momo" onClick={handleMomoMethod}>Ví điện tử MOMO</MenuItem>
                                                                    <MenuItem value="vnpay" onClick={handleVnpMethod}>Ví điện tử VNPAY</MenuItem>
                                                            </Menu>
                                                        </Grid>

                                                        <Grid item xs={12}>
                                                            <Button variant="contained" className={`align-center inner-width card-status white-text ${payment.active ? '' : 'c-status-done'}`}
                                                                disabled startIcon={payment.active ? <HourglassBottomIcon /> : <CheckCircleIcon />}>
                                                                    {payment.active ? 'Chưa thanh toán' : 'Đã thanh toán' }
                                                            </Button>
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Grid item sm={7.5}>
                                                            <Typography variant="h5" fontWeight="600" component="div" color="error">
                                                                {`${payment.amount.toLocaleString('vi-VN')} VND`}
                                                            </Typography>
                                                        </Grid>

                                                        <Grid item sm={4.5} className="text-end">
                                                            <Button variant="contained" id="pay-btn" aria-haspopup="true" disabled={!payment.active}
                                                                aria-expanded={openPayMethods ? 'true' : undefined} onClick={(event) => handleOpenPayMethods(event, payment)}
                                                                aria-controls={openPayMethods ? 'pay-methods' : undefined} endIcon={<KeyboardArrowDownIcon />}>
                                                                    Thanh toán
                                                            </Button>
                                                            
                                                            <Menu id="pay-methods" anchorEl={anchorEl} open={openPayMethods} onClose={handleClosePayMethods}
                                                                MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                                                                    <MenuItem value="momo" onClick={handleMomoMethod}>Ví điện tử MOMO</MenuItem>
                                                                    <MenuItem value="vnpay" onClick={handleVnpMethod}>Ví điện tử VNPAY</MenuItem>
                                                            </Menu>
                                                        </Grid>
                                                    </>
                                                )}
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>

                <Receipt open={openModal} onClose={handleCloseModal} payment={selectedPayment} />

                <Loading />
            </React.Fragment>
        </ThemeProvider>
    );
};

export default Payment;