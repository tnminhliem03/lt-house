import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardActionArea, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import Api, { endpoints } from '../../../Config/Api';
import { useLayoutContext } from '../../../Context/LayoutContext';
import { useProfileContext } from '../../../Context/ProfileContext';
import './Package.css';
import dayjs from 'dayjs';

function Package() {
    const { currentUserInfo } = useProfileContext();
    const { setIsLoading, Loading } = useLayoutContext();

    const [nextPage, setNextPage] = useState(null);
    const [items, setItems] = useState([]);

    const fetchItems = async (url, reset = false) => {
        setIsLoading(true);
        
        try {
            const res = await Api.get(url);

            if (res.data && Array.isArray(res.data.results)) {
                const userItems = res.data.results.filter((p) => p.resident === currentUserInfo.id);
                setItems((prevItem) => reset ? userItems : [...prevItem, ...userItems]);
                setNextPage(res.data.next);
            } else {
                console.error("Không có danh sách nào tồn tại!");
            }
        } catch (error) {
            console.error("Lỗi lấy thông tin tủ đồ: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems(endpoints.packages, true);
    }, [currentUserInfo]);

    useEffect(() => {
        if (nextPage) {
            fetchItems(nextPage);
        }
    }, [nextPage]);

    return (
        <React.Fragment key="package">
            <Container maxWidth="lg">
                <Box className="mt-3r plpr-24">
                    <Box>
                        <Typography variant="h4" component="div" className="primary-text text-center">
                            Tủ đồ điện tử
                        </Typography>

                        <Typography variant="h6" component="div" className="description-text text-center">
                            Danh sách các món hàng trong tủ đồ điện tử của bạn
                        </Typography>
                    </Box>

                    <Box className="mb-3r">
                        <Grid container spacing={6} className="mt-1r">
                            {items.sort((a,b) => new Date(b.created_date) - new Date(a.created_date)).map((item) => (
                                <Grid item xs={12} sm={6} lg={4} key={item.id}>
                                    <Card key={item.id} className="inner-height">
                                        <CardActionArea>
                                            <CardMedia component="img" alt="Items" height="300"
                                                image={item.image} />
                                            <CardContent>
                                                <Typography variant="h6" component="div" className="primary-text" gutterBottom>
                                                    {item.name}
                                                </Typography>

                                                <Typography variant="body1" component="div" className="description-text">
                                                    {item.note}
                                                </Typography>

                                                <Typography variant="body1" component="div" className="secondary-text">
                                                    Ngày giờ xác nhận: {dayjs(item.created_date).format("HH:mm DD/MM/YYYY")} 
                                                </Typography>

                                                <Typography variant="body1" component="div" className="secondary-text mb-1r">
                                                    Ngày giờ lấy hàng: {!item.active ? dayjs(item.created_date).format("HH:mm DD/MM/YYYY") : ""}
                                                </Typography>

                                                <Button variant="contained" className={`align-center card-status ${item.active ? '' : 'c-status-done'} white-text inner-width`}
                                                    disabled startIcon={item.active ? <HourglassBottomIcon /> : <CheckCircleIcon />}>
                                                        {item.active ? 'Chờ nhận' : 'Đã nhận' }
                                                </Button>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default Package;