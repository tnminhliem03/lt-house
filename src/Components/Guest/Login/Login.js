import { auth } from '../../../Config/Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Container, IconButton, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuthContext } from '../../../Context/AuthContext';
import { useLayoutContext } from '../../../Context/LayoutContext';
import './Login.css';


function Login() {
    const [showPassword, setShowPassword] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const { setIsLoading, Loading } = useLayoutContext();
    const { fetchAccessToken, fetchCurrentUserInfo, handleSignUpFirestore, handleSignUpAuth } = useAuthContext();
    
    const handleClickShowPassword = (field) => {
        setShowPassword((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const login = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const dataLogin = new FormData(e.target);
        const { username, password } = Object.fromEntries(dataLogin);

        try {
            const accessToken = await fetchAccessToken(username, password);

            const currentUserInfo = await fetchCurrentUserInfo(accessToken);
            const email = currentUserInfo.email;
            const firstName = currentUserInfo.first_name;
            const lastName = currentUserInfo.last_name;
            const avatar = currentUserInfo.avatar;
            const dateJoined = currentUserInfo.date_joined;
            const phone = currentUserInfo.phone;
            const gender = currentUserInfo.gender;
            const birthday = currentUserInfo.birthday;

            try {
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/');
            } catch {
                await handleSignUpAuth(email, password, firstName, lastName, avatar);
                const user = auth.currentUser;
                await handleSignUpFirestore(user.uid, firstName, lastName, email, username, dateJoined, phone, gender, birthday, avatar)
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/');
            };
        } catch (error) {
            console.error("Lỗi đăng nhập: ", error);
            setErrorMessage('Đăng nhập thất bại. Vui lòng thực hiện lại!');
            setOpenSnackbar(true);
        } finally {
            setIsLoading(false);
        };
    };

    return (
        <React.Fragment key="login">
            <Box className="wrapper l-wrapper full-height">
                <Container maxWidth="sm" className="full-height align-center">
                    <Box className="lc-container">
                        <Avatar className="l-icon">
                            <LockOutlinedIcon />
                        </Avatar>

                        <Typography variant="h4" component="div" className="secondary-text uppercase-text" gutterBottom>
                            Đăng nhập
                        </Typography>

                        <Box component="form" className="form-common inner-width l-form-width text-center" noValidate onSubmit={login}>
                            <div>
                                <TextField required label="Tên đăng nhập" id="username" name="username" placeholder="Tên đăng nhập"
                                    autoFocus InputProps={{ startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    )}} />
                            
                                <TextField required label="Mật khẩu" id="password" name="password"  placeholder="Mật khẩu"
                                    type={showPassword['password'] ? 'text' : 'password'} InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton edge="end" onClick={() => handleClickShowPassword('password')} onMouseDown={handleMouseDownPassword} className="btn-scale" >
                                                {showPassword['password'] ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                        ),
                                    }} />
                            </div>

                            <Button type="submit" fullWidth variant="contained" className="form-btn btn-scale btn-color">
                                Đăng nhập
                            </Button>
                        </Box>
                    </Box>
                </Container>
                <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}
                                        message={errorMessage} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
                <Loading />
            </Box>
        </React.Fragment>
    );
};

export default Login;