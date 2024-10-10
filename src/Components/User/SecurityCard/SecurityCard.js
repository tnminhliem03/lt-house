import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Container, Grid, MenuItem, Snackbar, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Api, { endpoints } from '../../../Config/Api';
import UpdateSecurityCard from './UpdateSecurityCard';
import { useProfileContext } from '../../../Context/ProfileContext';
import { useLayoutContext } from '../../../Context/LayoutContext';
import './SecurityCard.css';

function SecurityCard() {
    const { currentUserInfo, openSnackbar, setOpenSnackbar, message, setMessage } = useProfileContext();
    const { setIsLoading, Loading } = useLayoutContext();

    const typeVehicleOptions = [
        { value: 'bike', label: 'Xe đạp' },
        { value: 'motorbike', label: 'Xe máy' },
        { value: 'car', label: 'Xe hơi' },
    ];
    const [nextPage, setNextPage] = useState(null);
    const [securityCards, setSecurityCards] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedSc, setSelectedSc] = useState(null);
    const [nameRegister, setNameRegister] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [typeVehicle, setTypeVehicle] = useState('');

    const accessToken = localStorage.getItem('accessToken');

    const fetchSecurityCards = async (url, reset = false) => {
        setIsLoading(true);
    
        try {
            const res = await Api.get(url);
            if (res.data && Array.isArray(res.data.results)) {
                const userScs = res.data.results.filter((sc) => sc.resident === currentUserInfo.id);
                setSecurityCards((prevScs) => reset ? userScs : [...prevScs, ...userScs]);
                setNextPage(res.data.next);
            } else {
                console.error("Không có danh sách nào tồn tại!");
            }
        } catch (error) {
            console.error("Lỗi lấy thông tin thẻ xe: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSecurityCards(endpoints.security_cards, true);
    }, [currentUserInfo]);

    useEffect(() => {
        if (nextPage) {
            fetchSecurityCards(nextPage);
        }
    }, [nextPage]);

    const handleCreateSc = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await Api.post(endpoints['add-sc'], {
                'name_register': nameRegister,
                'vehicle_number': vehicleNumber,
                'type_vehicle': typeVehicle,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setSecurityCards((prevScs) => [...prevScs, res.data]);
            setMessage("Đăng ký thẻ giữ xe thành công!");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu:", error);
            setMessage("Đăng ký thẻ giữ xe thất bại. Vui lòng thử lại!");
            setOpenSnackbar(true);
        } finally {
            setIsLoading(false);
            setNameRegister('');
            setVehicleNumber('');
            setTypeVehicle('');
        };
    };

    const handleDeleteSc = async (id) => {
        setIsLoading(true);

        try {
            await Api.delete(endpoints['delete-sc'](id));

            setMessage("Xóa thẻ xe thành công!");
            setOpenSnackbar(true);
            setSecurityCards(securityCards.filter((sc) => sc.id !== id));
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu:", error);
            setMessage("Xóa thẻ giữ xe thất bại. Vui lòng thử lại!");
            setOpenSnackbar(true);
        } finally {
            setIsLoading(false);
        };
    };

    const handleOpenModal = (sc) => {
        setSelectedSc(sc);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedSc(null);
    };

    const getVehicleTypeLabel = (type) => {
        const option = typeVehicleOptions.find((option) => option.value === type);
        return option ? option.label : type;
    };

    return (
        <React.Fragment key="security-card">
            <Container maxWidth="lg">
                <Box className="mt-3r mb-3r plpr-24">
                    <Box>
                        <Typography variant="h4" component="div" className="primary-text text-center">
                            Đăng ký thẻ giữ xe cho người thân
                        </Typography>

                        <Typography variant="h6" component="div" className="description-text text-center">
                            Tăng cường an ninh. Kiểm soát ra vào chung cư
                        </Typography>
                    </Box>

                    <Box component="form" className="form-common form-100" sx={{ width: { xs: '100%', sm: '60%' } }} noValidate autoComplete="off" onSubmit={handleCreateSc}>
                        <TextField required label="Tên người đăng ký" id="name-register" name="nameRegister" placeholder="Tên người đăng ký" value={nameRegister}
                            onChange={(e) => setNameRegister(e.target.value)} />
                       
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField required label="Biển số xe" id="vehicle-number" name="vehicleNumber" placeholder="Biển số xe" value={vehicleNumber}
                                     onChange={(e) => setVehicleNumber(e.target.value)} />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField required select label="Loại xe" id="type-vehicle" name="typeVehicle" placeholder="Loại xe" value={typeVehicle}
                                     onChange={(e) => setTypeVehicle(e.target.value)} >
                                        {typeVehicleOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                </TextField>
                            </Grid>
                        </Grid>

                        <Button type="submit" variant="contained" className="btn-scale form-btn btn-color">
                            Gửi
                        </Button>
                    </Box>

                    <Box className="mt-5r">
                        <Box>
                            <Typography variant="h4" component="div" className="primary-text text-center">
                                Thẻ giữ xe của bạn
                            </Typography>

                            <Typography variant="h6" component="div" className="secondary-text text-center">
                                Những thẻ xe bạn đã đăng ký
                            </Typography>
                        </Box>

                        <Grid container spacing={5} className="mt-1r">
                            {securityCards.sort((a,b) => new Date(b.created_date) - new Date(a.created_date)).map((sc) => (
                                <Grid item xs={12} lg={6} key={sc.id}>
                                    <Card className="inner-height" key={sc.id}>
                                        <CardContent>
                                            <Grid container spacing={{ xs: 3.5, lg: 2 }} className="align-center">
                                                <Grid item xs={8} lg={9.5}>
                                                    <Typography variant="h6" component="div" className="primary-text">
                                                        {sc.name_register}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={4} lg={2.5} className="text-end">
                                                    <Button variant="contained" className="align-center btn-color" startIcon={<DeleteIcon />} onClick={() => handleDeleteSc(sc.id)}>
                                                        XÓA
                                                    </Button>
                                                </Grid>

                                                <Grid item xs={8} lg={9.5}>
                                                    <Typography variant="h5" fontWeight="600" component="div" color="error">
                                                        {sc.vehicle_number}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={4} lg={2.5} className="text-end">
                                                    <Button variant="contained" className="align-center btn-color" startIcon={<EditIcon />} onClick={() => handleOpenModal(sc)}>
                                                        SỬA
                                                    </Button>
                                                </Grid>

                                                <Grid item xs={8} lg={9.5}>
                                                    <Typography variant="body1" component="div">
                                                        Ngày cập nhật: {dayjs(sc.updated_date).format("DD-MM-YYYY")} 
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={4} lg={2.5} className="text-end">
                                                    <Typography variant="body1" component="div" className="secondary-text sc-card-des">
                                                        {getVehicleTypeLabel(sc.type_vehicle)}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>    
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Container>

            <UpdateSecurityCard open={openModal} onClose={handleCloseModal} scData={selectedSc} setMessage={setMessage}
                setOpenSnackbar={setOpenSnackbar} setSecurityCards={setSecurityCards} />

            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}
                message={message} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
            <Loading />
        </React.Fragment>
    );
};

export default SecurityCard;