import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, IconButton, MenuItem, Modal, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Api, { endpoints } from '../../../Config/Api';
import { useLayoutContext } from '../../../Context/LayoutContext';
import './SecurityCard.css';

function UpdateSecurityCard({ open, onClose, scData, setMessage, setOpenSnackbar, setSecurityCards }) {
    const [nameRegister, setNameRegister] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [typeVehicle, setTypeVehicle] = useState('');
    const { modalStyle } = useLayoutContext();

    const typeVehicleOptions = [
        { value: 'bike', label: 'Xe đạp' },
        { value: 'motorbike', label: 'Xe máy' },
        { value: 'car', label: 'Xe hơi' },
    ];

    const accessToken = localStorage.getItem('accessToken');

    const handleUpdateSc = async (e) => {
        e.preventDefault();

        try {
            const res = await Api.patch(endpoints['update-sc'](scData.id), {
                'name_register': nameRegister,
                'vehicle_number': vehicleNumber,
                'type_vehicle': typeVehicle,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setSecurityCards((prevScs) =>
                prevScs.map((sc) => (sc.id === res.data.id ? res.data : sc))
            );

        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu:", error);
        } finally {
            setMessage("Cập nhật thẻ giữ xe thành công!");
            setOpenSnackbar(true);
        }
    };

    useEffect(() => {
        if (open && scData) {
            setNameRegister(scData.name_register);
            setVehicleNumber(scData.vehicle_number);
            setTypeVehicle(scData.type_vehicle);
        }
    }, [open, scData]);


    return (
        <React.Fragment key="update-security-card">
            <Modal open={open} onClose={onClose}>
                <Box sx={{ ...modalStyle, width: { xs: '80%', lg: '60%' }  }}>
                    <IconButton aria-label="close" onClick={onClose} className="btn btn-close">
                        <CloseIcon/>
                    </IconButton>

                    <Box component="form" className="form-common form-100" sx={{ width: { xs: '100%', sm: '60%' } }} noValidate autoComplete="off" onSubmit={handleUpdateSc}>
                        <TextField required label="Tên người đăng ký" id="name-register" name="nameRegister"
                            onChange={(e) => setNameRegister(e.target.value)} value={nameRegister} />
                       
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField required label="Biển số xe" id="vehicle-number" name="vehicleNumber" placeholder="Biển số xe"
                                    onChange={(e) => setVehicleNumber(e.target.value)} value={vehicleNumber} />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField required select label="Loại xe" id="type-vehicle" name="typeVehicle" placeholder="Loại xe"
                                    onChange={(e) => setTypeVehicle(e.target.value)} value={typeVehicle} >
                                        {typeVehicleOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                </TextField>
                            </Grid>
                        </Grid>

                        <Button type="submit" variant="contained" className="btn-scale form-btn mb-1r btn-color">
                            Cập nhật thông tin
                        </Button>
                    </Box>
                </Box>
            </Modal>     
        </React.Fragment>
    );
};

export default UpdateSecurityCard;