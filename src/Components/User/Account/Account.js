import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { db } from '../../../Config/Firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Container, Divider, Grid, IconButton, MenuItem, Snackbar, TextField, Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useAuthContext } from '../../../Context/AuthContext';
import { useLayoutContext } from '../../../Context/LayoutContext';
import { useProfileContext } from '../../../Context/ProfileContext';
import './Account.css';


function Account() {
    const { currentUser } = useAuthContext();
    const { currentUserInfo, openSnackbar, setOpenSnackbar, message, setMessage, handleUpdateProfile } = useProfileContext();
    const { setIsLoading, Loading, VisuallyHiddenInput } = useLayoutContext();

    const [birthDate, setBirthDate] = useState(null);
    const [gender, setGender] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');
    
    const formattedBirthDate = birthDate ? birthDate.format('YYYY-MM-DD') : null;
    const password = "default";

    useEffect(() => {
        if (currentUserInfo) {
            
            setFirstName(currentUserInfo.first_name);
            setLastName(currentUserInfo.last_name);
            setGender(currentUserInfo.gender);
            setEmail(currentUserInfo.email);
            setPhone(currentUserInfo.phone);
            setBirthDate(dayjs(currentUserInfo.birthday));
        }
    }, [currentUserInfo]);

    const checkFormNull = () => {
        const fields = [firstName, lastName, phone, gender, birthDate];
        return fields.every(field => field !== '' && field !== null);
    };

    const handleChangePassword = () => {
        if (newPassword === '' && reNewPassword === '') return true;
        if (newPassword !== reNewPassword) {
            setMessage('Mật khẩu không khớp. Vui lòng nhập lại!');
            setOpenSnackbar(true);
            return false;
        };
        return true;
    };

    const handleProfileFirebase = async () => {
        try {
            await updateDoc(doc(db, 'users', currentUser.uid), {
                displayName: `${firstName} ${lastName}`,
                firstName,
                lastName,
                phone,
                gender,
                birthday: formattedBirthDate,
            });

            await updateProfile(currentUser, {
                displayName: `${firstName} ${lastName}`,
            });

            const isPasswordChanged = handleChangePassword();
            if (!isPasswordChanged) return;

            if (newPassword !== '' && newPassword === reNewPassword) {
                await updatePassword(currentUser, newPassword);
            }
            console.log("Đổi mật khẩu thành công: ", newPassword);
        } catch (error) {
            console.log("Lỗi update firebase: ", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();

        const isFormValid = checkFormNull();
        if (!isFormValid) {
            setMessage("Thông tin không được rỗng!");   
            setIsLoading(false);
            setOpenSnackbar(true);
            return;
        };

        const isPasswordChanged = handleChangePassword();
        if (!isPasswordChanged) {
            setIsLoading(false);
            return;
        };

        if (newPassword !== '' && newPassword === reNewPassword) {
            formData.append('password', newPassword);
        }

        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('phone', phone);
        formData.append('gender', gender);
        formData.append('birthday', formattedBirthDate);

        await handleProfileFirebase();
        await handleUpdateProfile(formData);
    }

    const handleAvatarFirebase = async (avatar) => {
        try {
            await updateDoc(doc(db, 'users', currentUser.uid), {
                photoURL: avatar,
            });

            await updateProfile(currentUser, {
                photoURL: avatar,
            });
        } catch (error) {
            console.log("Lỗi update avatar firebase: ", error);
        };
    };

    const handleAvatar = async (e) => {
        setIsLoading(true);
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (!validImageTypes.includes(file.type)) {
            setMessage('Vui lòng chọn một tệp ảnh hợp lệ!');
            setOpenSnackbar(true);
            return;
        }

        const reader = new FileReader();
        
        reader.onloadend = async () => {
            const formData = new FormData();
            formData.append('avatar', file);
            
            await handleUpdateProfile(formData);
            setIsLoading(true);
            const avatarUrl = await localStorage.getItem('avatarUrl')
            await handleAvatarFirebase(avatarUrl);
            setIsLoading(false);
        }

        reader.readAsDataURL(file);
    }

    return (
        <React.Fragment key="account">
            <Container maxWidth="lg">
                <Box className="plpr-24 mt-3r mb-3r">
                    {/* Heading */}
                    <Box>
                        <Typography variant="h4" component="div" className="primary-text text-center">
                            Tài khoản
                        </Typography>

                        <Typography variant="h6" component="div" className="description-text text-center">
                            Thông tin tài khoản cư dân
                        </Typography>
                    </Box>

                    <Grid container spacing={{ xs: 7, lg: 4 }} className="mt-1r">
                        {/* Left Container */}
                        <Grid item xs={12} lg={8}>
                            <Box className="a-container">
                                <Grid container spacing={{ xs: 3, lg: 7 }}>
                                    <Grid item xs={4} sm={2.1} lg={2.9}>
                                        <div style={{ position: 'relative' }}>
                                            <Avatar alt="Avatar Current User" sx={{ width: { xs: 68, sm: 90, lg: 115 }, height: { xs: 68, sm: 90, lg: 115 } }} src={currentUser.photoURL} />
                                            <IconButton component="label" role={undefined} tabIndex={-1} className="avatar-picker">
                                                <PhotoCamera sx={{ fontSize: { xs: 'x-small', sm: 'small', lg: 'large' } }} />
                                                <VisuallyHiddenInput type="file" onChange={handleAvatar} />
                                            </IconButton>
                                        </div>
                                    </Grid>

                                    <Grid item xs={8} sm={9.8} lg={9.1}>
                                        {/* Các thông tin */}
                                        <Grid container spacing={1.5} direction="column">
                                            <Grid item>
                                                <Typography variant="h6" component="div" className="primary-text">
                                                    {currentUser.displayName}
                                                </Typography>
                                            </Grid>

                                            <Grid item>
                                                <Grid container spacing={{ xs: 1, sm: 10, lg: 7,  }}>
                                                    <Grid item>
                                                        <Typography variant="body1" component="div" className="description-text">
                                                            Tên đăng nhập: {currentUserInfo ? currentUserInfo.username : 'Đang tải...'}
                                                        </Typography>
                                                    </Grid>

                                                    <Grid item>
                                                        <Typography variant="body1" component="div" className="description-text">
                                                            Ngày đăng ký: {currentUserInfo ? dayjs(currentUserInfo.date_joined).format('DD-MM-YYYY') : 'Đang tải...'}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                            <Grid item>
                                                <Button variant="contained" className="btn-scale btn-color">
                                                    ĐĂNG XUẤT
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Divider className="mt-1r" />

                                <Box component="form" className="form-common a-form" noValidate onSubmit={handleUpdate}>
                                    <Grid container spacing={{ xs: 0, lg: 2 }}>
                                        <Grid item xs={12} lg={6}>
                                            <TextField required label="Họ" id="first-name" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                        </Grid>

                                        <Grid item xs={12} lg={6}>
                                            <TextField required label="Tên đệm và tên" id="last-name" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                        </Grid>
                                    </Grid>

                                    <TextField disabled required label="Email" id="email" name="email" value={email} />
                                    
                                    <Grid container spacing={{ xs: 3, lg: 5 }} sx={{ alignItems: 'flex-end' }}>
                                        <Grid item xs={12} lg={9}>
                                            <TextField disabled required label="Mật khẩu" id="password" name="password" type="password" defaultValue={password} />
                                        </Grid>

                                        <Grid item xs={12} lg={3}>
                                            <Button variant="contained" className="btn-scale btn-color" sx={{ height: '56px' }} onClick={() => setShowChangePassword(true)}>
                                                Đổi mật khẩu
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    {showChangePassword && (
                                        <Grid container spacing={{ xs: 0, lg: 5 }}>
                                            <Grid item xs={12} lg={6}>
                                                <TextField required label="Mật khẩu mới" id="new-password" name="newPassword" autoComplete="false"
                                                    type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                            </Grid>
  
                                            <Grid item xs={12} lg={6}>
                                                <TextField required label="Xác nhận lại mật khẩu mới" id="re-new-password" autoComplete="false"
                                                    name="reNewPassword" type="password" value={reNewPassword}
                                                        onChange={(e) => setReNewPassword(e.target.value)} />
                                            </Grid>
                                        </Grid>
                                    )}

                                    <TextField required label="Số điện thoại" id="phone-number" name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                
                                    <TextField required select label="Giới tính" id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                                        <MenuItem value="male">Nam</MenuItem>
                                        <MenuItem value="female">Nữ</MenuItem>
                                        <MenuItem value="other">Khác</MenuItem>
                                    </TextField>

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker label="Ngày tháng năm sinh" views={['year', 'month', 'day']} value={birthDate} name="birthDate"
                                            onChange={(newDate) => setBirthDate(newDate)} renderInput={(params) => <TextField {...params} />} />
                                    </LocalizationProvider> 

                                    <Button type="submit" variant="contained" className="btn-scale mt-2r btn-color">
                                        Cập nhật
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} lg={4}>
                            <Box className="a-container">
                                <Typography variant="h6" component="div" className="primary-text" gutterBottom>
                                    Thông tin phòng
                                </Typography>

                               {currentUserInfo && Array.isArray(currentUserInfo.rooms) && currentUserInfo.rooms.length > 0 ? (
                                    currentUserInfo.rooms.map((r) => (
                                        <div key={r.id}>
                                            <Typography variant="body1" component="div" className="description-text" gutterBottom>
                                                Tên phòng: {r.name}
                                            </Typography>

                                            <Typography variant="body1" component="div" className="description-text" gutterBottom>
                                                Mô tả phòng: {r.description}
                                            </Typography>

                                            <Typography variant="body1" component="div" className="description-text" gutterBottom>
                                                Số phòng: {r.number}
                                            </Typography>
                                            
                                            <Typography variant="body1" component="div" className="description-text">
                                                Diện tích: {r.square} m2
                                            </Typography>
                                        </div>
                                    ))
                                ) : (
                                    <Typography variant="body1" component="div" className="description-text" gutterBottom>
                                        Đang tải...
                                    </Typography>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            
            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}
                message={message} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
            <Loading />
        </React.Fragment>
    );
};

export default Account;