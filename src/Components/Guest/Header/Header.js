import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import React, { cloneElement, useEffect, useState } from 'react';
import { AppBar, Avatar, Badge, Box, Button, Container, CssBaseline, Fab, Fade, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Popover, SwipeableDrawer, Toolbar, Tooltip, Typography, useScrollTrigger } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import BadgeIcon from '@mui/icons-material/Badge';
import PollIcon from '@mui/icons-material/Poll';
import PaymentsIcon from '@mui/icons-material/Payments';
import ChatIcon from '@mui/icons-material/Chat';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useLayoutContext } from '../../../Context/LayoutContext';
import { useAuthContext } from '../../../Context/AuthContext';
import Logo from '../../../Assets/Images/logo.png';
import './Header.css';
import Api, { endpoints } from '../../../Config/Api';
import dayjs from 'dayjs';



// nút scroll to top
function ScrollTop(props) {
    const { children, window } = props;

    const trigger = useScrollTrigger({
        target: window ? window() : undefined,
        disableHysteresis: true,
        threshold: 100
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            '#back-to-top-anchor',
        );

        if (anchor) {
            anchor.scrollIntoView({
                block: 'center',
                behavior: 'smooth'
            });
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <Fade in={trigger}>
            <Box onClick={handleClick} role="presentation" sx={{ position: 'fixed', bottom: 90, right: 28 }}>
                { children }
            </Box>
        </Fade>
    );
};

ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func, 
};



// Sticky Header
function ElevationScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
        target: window ? window() : undefined,
    });

    return cloneElement(children, {
        elevation: trigger ? 4 : 0,
        style: {
            backgroundColor: trigger ? '#122250' : 'black',
            transition: 'background-color 0.3s',
        },
    });
};

ElevationScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};



// Header
function Header(props) {
    const { currentUser, logout } = useAuthContext();
    const { sizes } = useLayoutContext();
    const navigate = useNavigate();

    const [openDrawer, setOpenDrawer] = useState(false);
    const [notifications, setNotifications] = useState([]);


    const headerTitle = currentUser ? [
        { id: 1, title: "Trang chủ", icons: <HomeIcon />, href: `/dashboard` },
        { id: 2, title: "Tài khoản", icons: <AccountBoxIcon />, href: `${currentUser.uid}/profile` },
        { id: 3, title: "Phản ánh", icons: <AssignmentIcon />, href: `/${currentUser.uid}/complaints` },
        { id: 4, title: "Tủ đồ", icons: <Inventory2Icon />, href: `/${currentUser.uid}/packages` },
        { id: 5, title: "Thẻ giữ xe", icons: <BadgeIcon />, href: `/${currentUser.uid}/security-cards` },
        { id: 6, title: "Khảo sát", icons: <PollIcon />, href: `/${currentUser.uid}/surveys` },
        { id: 7, title: "Hóa đơn", icons: <PaymentsIcon />, href: `/${currentUser.uid}/payments` },
        { id: 8, title: "Nhắn tin", icons: <ChatIcon />, href: `/${currentUser.uid}/chats` },
    ] : [];

    const toggleDrawer = (newOpen) => () => {
        setOpenDrawer(newOpen);
    };

    const navigateHref = (href) => {
        navigate(href);
    };

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const DrawerList = (
        <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {headerTitle.map((item) => (
                <ListItem key={item.title} disablePadding onClick={() => navigateHref(item.href)}>
                    <ListItemButton>
                        <ListItemIcon>
                            {item.icons}
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                    </ListItemButton>
                </ListItem>
            ))}

            <ListItem key="Logout" disablePadding onClick={logout}>
                <ListItemButton>
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Đăng xuất" />
                </ListItemButton>
            </ListItem>
          </List>
        </Box>
    );

    const fetchAllNotifications = async (url) => {
        let allNotifications = [];
        let nextUrl = url;
    
        try {
            while (nextUrl) {
                const res = await Api.get(nextUrl);
                const data = res.data.results;
    
                if (res.data && Array.isArray(data)) {
                    allNotifications = [...allNotifications, ...data];
                    nextUrl = res.data.next;
                } else {
                    console.error("Không có danh sách nào tồn tại!");
                    break;
                }
            }
    
            const latestNotifications = allNotifications.slice(-3);
            setNotifications(latestNotifications);
        } catch (error) {
            console.error("Lỗi lấy danh sách thông báo: ", error);
        }
    };
    
    useEffect(() => {
        fetchAllNotifications(endpoints.notifications);
    }, []);

    return (
        <React.Fragment key="header">
            <CssBaseline />
            <ElevationScroll {...props}>
                <AppBar>
                    <Container maxWidth="lg">
                        <Toolbar>
                            {/* Logo */}
                            <Box sx={{ width: { lg: '150px' } }}>
                                <Link to="/dashboard">
                                    <img alt="Logo Website" src={Logo} className="header-height" />
                                </Link>
                            </Box>

                            {/* Navbar */}
                            <Box className="ml-auto">
                                {currentUser ? (
                                    <Grid container spacing={2}>
                                        <Grid item>
                                            <IconButton size="large" aria-label="show new notifications" color="inherit" onClick={handleClick} >
                                                <Badge badgeContent={notifications.length} color="error">
                                                    <NotificationsIcon />
                                                </Badge>
                                            </IconButton>

                                            <Popover id={id} open={open} anchorEl={anchorEl} onClose={handleClose}
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right', }}
                                                transformOrigin={{ vertical: 'top', horizontal: 'right', }}>
                                                    <Box className="notif-box">
                                                        <Typography variant="h6" component="div" className="text-center">
                                                            Thông báo
                                                        </Typography>
                                                        
                                                        <List>
                                                            {notifications.sort((a,b) => new Date(b.created_date) - new Date(a.created_date)).map(notification => (
                                                                <ListItem key={notification.id}>
                                                                    <ListItemText 
                                                                        primary={<strong>{notification.name}</strong>} secondary={
                                                                            <>
                                                                                <Typography variant="body2" component="div" className="notif-content">
                                                                                    {notification.content}
                                                                                </Typography>

                                                                                <Typography variant="caption" component="div" className="description-text">
                                                                                    {dayjs(notification.created_date).format("DD/MM/YYYY [ vào ] HH:mm")}
                                                                                </Typography>
                                                                            </>
                                                                        } />
                                                                </ListItem>
                                                            ))}
                                                        </List>
                                                    </Box>
                                            </Popover>
                                        </Grid>
                                        
                                        <Grid item>
                                            <Tooltip title="Tài khoản">
                                                <IconButton onClick={toggleDrawer(true)} sx={{ p: 0 }}>
                                                    <Avatar alt="Avatar Current User" src={currentUser.photoURL} />
                                                </IconButton>
                                            </Tooltip>
                                            
                                            <SwipeableDrawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
                                                {DrawerList}
                                            </SwipeableDrawer>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Link to="/login">
                                        <Button sx={{ width: { lg: sizes.widthLg }, height: { lg: sizes.heightLg } }} className="btn-scale btn-color"
                                            variant="contained" startIcon={<LogoutIcon />}>
                                                Đăng nhập
                                        </Button>
                                    </Link>
                                )}
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
            </ElevationScroll>

            <Toolbar id="back-to-top-anchor" />

            <ScrollTop {...props}>
                <Fab size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>
        </React.Fragment>
    )
};

export default Header;