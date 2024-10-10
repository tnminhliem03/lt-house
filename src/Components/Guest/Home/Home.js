import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Typewriter from 'typewriter-effect';
import CountUp from 'react-countup';
import { useEffect } from 'react';
import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid, TextField, Typography } from '@mui/material';
import FamilyHouseIcon from '../../../Assets/Images/family-house_15179655.png';
import VillaHouseIcon from '../../../Assets/Images/modern-house.png';
import ApartmentIcon from '../../../Assets/Images/city-building.png';
import OfficeHouseIcon from '../../../Assets/Images/office-house.png';
import CondoHouseIcon from '../../../Assets/Images/villa-house.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GppGoodSharpIcon from '@mui/icons-material/GppGoodSharp';
import CallIcon from '@mui/icons-material/Call';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import TextsmsIcon from '@mui/icons-material/Textsms';
import EmailIcon from '@mui/icons-material/Email';
import Api, { endpoints } from '../../../Config/Api';
import { useLayoutContext } from '../../../Context/LayoutContext';
import './Home.css';

function Home() {
    const { sizes, sliderStyle, setIsLoading } = useLayoutContext();

    const [expanded, setExpanded] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [nextPage, setNextPage] = useState(null);

    const introduce = [
        { id: 1, value: "Hạnh phúc là vun tròn tổ ấm trên khắp Việt Nam." },
        { id: 2, value: "Hạnh phúc là có người đồng hành gửi trao tin cậy." },
        { id: 3, value: "Hạnh phúc là tận hưởng cuộc sống trong lòng tiện ích." },
        { id: 4, value: "Hạnh phúc là tìm thấy một nơi yêu thương đi về." },
        { id: 5, value: "Hạnh phúc là chọn sống xứng tầm khẳng định vị thế." }
    ];

    const countUp = [
        { id: 1, start: 30, end: 155, value: "Căn hộ cao cấp" },
        { id: 2, start: 1500, end: 2000, value: "Khách hàng đánh giá tốt" },
        { id: 3, start: 0, end: 10, value: "Kinh nghiệm" },
    ]

    const productTotal = [
        { id: 1, img: FamilyHouseIcon, name: "Căn hộ gia đình", total: "122 Căn" },
        { id: 2, img: VillaHouseIcon, name: "Căn hộ cao cấp", total: "155 Căn" },
        { id: 3, img: ApartmentIcon, name: "Chung cư", total: "300 Căn" },
        { id: 4, img: OfficeHouseIcon, name: "Văn phòng", total: "30 Căn" },
        { id: 5, img: CondoHouseIcon, name: "Studio", total: "20 Căn" }
    ];

    const accordionValue = [
        { id: 1, title: "Cộng đồng và kết nối", detail: "Tại LT House, bạn sẽ gặp gỡ hàng xóm thân thiện, tạo dựng mối quan hệ bền chặt và cùng chia sẻ những khoảnh khắc đáng nhớ." },
        { id: 2, title: "Tiện nghi hiện đại", detail: "Với đầy đủ tiện ích như hồ bơi, phòng gym và khu vui chơi, LT House mang đến một không gian sống thoải mái và thuận tiện cho cả gia đình." },
        { id: 3, title: "Không gian xanh lý tưởng", detail: "Hưởng thụ cuộc sống gần gũi với thiên nhiên, LT House được thiết kế với nhiều khoảng xanh, mang lại sự bình yên và thư giãn cho cư dân." },
    ];

    const contacts = [
        { id: 1, icon: <PhoneAndroidIcon className="h-btn" />, stream: "Điện thoại", value: "099 999 9999" },
        { id: 2, icon: <CallIcon className="h-btn" />, stream: "Tổng đài", value: "088 889 8888" },
        { id: 3, icon: <TextsmsIcon className="h-btn" />, stream: "Nhắn tin", value: "099 999 9999" },
        { id: 4, icon: <EmailIcon className="h-btn" />, stream: "Email", value: "sales@lapart.vn" }
    ];

    const handleAccordionChange = (panelId) => (event, isExpanded) => {
        setExpanded(isExpanded ? panelId : false);
    };

    const fetchRooms = async (url, reset = false) => {
        setIsLoading(true);
        
        try {
            const res = await Api.get(url);

            if (res.data && Array.isArray(res.data.results)) {
                const roomEmpty = res.data.results.filter((r) => r.is_empty === true);
                setRooms((prevRooms) => reset ? roomEmpty : [...prevRooms, ...roomEmpty]);
                setNextPage(res.data.next);
            } else {
                console.error("Không có danh sách nào tồn tại!");
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách phòng: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms(endpoints.rooms, true);
    }, [setIsLoading]);

    useEffect(() => {
        if (nextPage) {
            fetchRooms(nextPage);
        }
    }, [nextPage]);

    const settings = {
        infinite: true,
        autoplay: true,
        autoplaySpeed: 7000,
        slidesToShow: 1,
        swipeToSlide: true,
        slidesToScroll: 1,
    };
    
    const banners = [
        { id: 1, img: 'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg?cs=srgb&dl=pexels-pixabay-259950.jpg&fm=jpg', title: 'Banner 1' },
        { id: 2, img: 'https://images.pexels.com/photos/87223/pexels-photo-87223.jpeg', title: 'Banner 2' },
        { id: 3, img: 'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg?cs=srgb&dl=pexels-jovydas-2462015.jpg&fm=jpg', title: 'Banner 3' },
    ];

    const imageHome = [
        { id: 1, img: "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2022/10/condo-vs-apartment.jpeg.jpg" },
        { id: 2, img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/The_Lauren_condo_Bethesda_MD_2021-12-12_10-11-55_1.jpg/800px-The_Lauren_condo_Bethesda_MD_2021-12-12_10-11-55_1.jpg" },
        { id: 3, img: "https://archipro.com.au/assets/article/building/Form-Apartments-Port-Coogee-by-Stiebel-Eltron--v2.jpg?raw=1" }
    ]
    

    return (
        <React.Fragment key="home">
            <Box>
                <Slider {...settings} className="h-hero-container mb-5r">
                    {banners.map((banner) => (
                        <Box key={banner.id} sx={{ position: 'relative' }}>
                            <img src={banner.img} alt={banner.title} className="h-hero-image" />

                            <Box className="h-hero-box">
                                <Container maxWidth="lg">
                                    <Box className="plpr-24">
                                        <Grid container spacing={1} className="ptpb-4 justify-between align-center">
                                            <Grid item lg={8}>
                                                <Box className="mb-2r">
                                                    <Typography variant="h2" component="div" fontWeight="500" lineHeight="5rem" className="primary-text">
                                                        LT House
                                                    </Typography>

                                                    <Typography variant="h2" component="div" fontWeight="500" lineHeight="5rem">
                                                        Nơi Hạnh Phúc <br /> Ngập Tràn
                                                    </Typography>
                                                </Box>

                                                <Typography variant="body1" component="div" className="primary-text">
                                                    <Typewriter options={{ strings: introduce.map((text) => text.value), autoStart: true, loop: true,
                                                                    delay: 70, deleteSpeed: 30 }} />
                                                </Typography>
                                            </Grid>

                                            <Grid item lg={4}>
                                                <Grid container spacing={10} direction="column">
                                                    {countUp.map((c) => (
                                                        <Grid item className="right stat" key={c.id}>
                                                            <Grid container spacing={0.5}>
                                                                <Grid item className="right">
                                                                    <CountUp start={c.start} end={c.end} duration={4} />
                                                                </Grid>

                                                                <Grid item>
                                                                    <Typography variant="body1" component="div" gutterBottom className="plus">
                                                                        +
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>

                                                            <Typography variant="body1" component="div" className="primary-text">
                                                                {c.value}
                                                            </Typography>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Container>
                            </Box>
                        </Box>
                    ))}
                </Slider>
            </Box>
            
            <Container maxWidth="lg">
                {/* Products */}
                <Box className="mb-5r">
                    <Box className="plpr-24 mb-3r">
                        <Typography variant="h4" component="div" className="primary-text text-center">
                            Hệ Sinh Thái
                        </Typography>

                        <Typography variant="h6" component="div" className="secondary-text text-center">
                            Đa Dạng Chốn Hạnh Phúc
                        </Typography>
                    </Box>
                        

                    <Grid container spacing={2} className="h-product-card">
                        {productTotal.map((product) => (
                            <Grid item lg={2.4} key={product.id}>
                                <Box className="text-center h-product btn-scale">
                                    <img src={product.img} alt={product.name} style={{ width: sizes.avatarWidthLg,
                                                                                        height: sizes.avatarHeightLg, }} />
                                    <Box>
                                        <Typography variant="body1" component="div" className="primary-text">
                                            {product.name}
                                        </Typography>

                                        <Typography variant="body2" component="div" className="secondary-text">
                                            {product.total}
                                        </Typography>
                                    </Box>
                                </Box> 
                            </Grid>
                        ))}              
                    </Grid>
                </Box>

                {/* Rent */}
                <Box className="mb-5r plpr-24">
                    <Box className="mb-3r">
                        <Box className="mb-1r">
                            <Typography variant="h5" component="div" gutterBottom className="secondary-text">
                                Căn Hộ
                            </Typography>

                            <Typography variant="h4" component="div" className="primary-text">
                                Lựa chọn hàng đầu
                            </Typography>
                        </Box>

                        <Slider {...sliderStyle}>
                            {rooms.map((room) => (
                                <Card className="h-card" key={room.id}>
                                    <CardMedia component="img" className="h-card-img" image={room.image} alt={`House ${room.id}`} />
                                    <CardContent className="h-card-content">
                                        <Grid container spacing={0}>
                                            <Grid item>
                                                <Typography gutterBottom variant="body2" component="div" className="secondary-text">
                                                    {room.square} m
                                                </Typography>
                                            </Grid>

                                            <Grid item>
                                                <Typography gutterBottom variant="body2" component="div" className="secondary-text h-des">
                                                    2
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Typography gutterBottom variant="h5" component="div" className="primary-text">
                                            {room.name}
                                        </Typography>

                                        <Typography variant="body2" className="description-text">
                                            {room.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Slider>
                    </Box>
                </Box>

                {/* Value */}
                <Box className="mb-5r plpr-24">
                    <Grid container spacing={10} className="v-container">
                        {/* Left */}
                        <Grid item lg={5.7}>
                            <Box className="h-image-container">
                                <img src={imageHome[0].img} alt="TemplateImage" />
                            </Box>
                        </Grid>

                        {/* Right */}
                        <Grid item lg={6.3}>
                            <Box className="mb-1r">
                                <Typography variant="h5" component="div" gutterBottom className="secondary-text">
                                    Nơi Khởi Nguồn Cho Cuộc Sống Ý Nghĩa!
                                </Typography>

                                <Typography variant="h4" component="div" gutterBottom className="primary-text">
                                    Giá trị sống
                                </Typography>

                                <Typography variant="body2" component="div" className="description-text">
                                    Tại đây, bạn sẽ tìm thấy một cộng đồng gắn kết, tiện nghi hiện đại và không gian xanh lý tưởng. Hãy đến và trải nghiệm
                                    giá trị sống tuyệt vời mà LT House mang lại cho bạn và gia đình!
                                </Typography>
                            </Box>

                            <Grid container spacing={3} direction="column">
                                {accordionValue.map(( { id, title, detail }) => (
                                    <Grid item key={id}>
                                        <Accordion expanded={expanded === `panel${id}`} onChange={handleAccordionChange(`panel${id}`)} className={expanded === `panel${id}` ? 'h-accordion-expanded' : ''}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${id}-content`} id={`panel${id}-header`} className="value-header">
                                                <Box className="align-center inner-width">
                                                    <GppGoodSharpIcon className="h-btn" />

                                                    <Typography variant="h6" component="div" className="primary-text margin-center">
                                                        {title}
                                                    </Typography>
                                                </Box>
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                <Typography variant="body2" component="div" className="secondary-text">
                                                    {detail}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>

                {/* Contact */}
                <Box className="mb-5r plpr-24">
                    <Grid container spacing={10} className="c-container">
                        <Grid item lg={5.7}>
                            <Box className="mb-1r">
                                <Typography variant="h5" component="div" gutterBottom className="secondary-text">
                                    Thông Tin Liên Hệ
                                </Typography>

                                <Typography variant="h4" component="div" gutterBottom className="primary-text">
                                    Dễ dàng liên hệ với chúng tôi
                                </Typography>

                                <Typography variant="body2" component="div" className="description-text">
                                    Chúng tôi luôn sẵn sàng hỗ trợ và cung cấp dịch vụ tốt nhất cho bạn.
                                    <br />
                                    Một nơi ở lý tưởng sẽ mang lại cho bạn cuộc sống tốt đẹp hơn. Hãy kết nối ngay hôm nay!
                                </Typography>
                            </Box>

                            <Grid container spacing={4}>
                                {contacts.map((contact) => (
                                    <Grid item lg={6}>
                                        <Card className="hc-card">
                                            <CardContent>
                                                <Grid container spacing={3}>
                                                    <Grid item>
                                                        {contact.icon}
                                                    </Grid>

                                                    <Grid item>
                                                        <Typography variant="h6" component="div" className="primary-text">
                                                            {contact.stream}
                                                        </Typography>

                                                        <Typography variant="body2" component="div" className="secondary-text">
                                                            {contact.value}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>

                                            <CardActions>
                                                <Button variant="contained" className="inner-width c-btn btn-scale">
                                                    Liên hệ ngay
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        <Grid item lg={6.3}>
                            <Box className="h-image-container right">
                                <img src={imageHome[1].img} alt="TemplateImage" />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                {/* Info */}
                <Box className="mb-5r plpr-24">
                    <Grid container spacing={10} className="i-container">
                        {/* Left */}
                        <Grid item lg={5.7}>
                            <Box className="h-image-container">
                                <img src={imageHome[2].img} alt="TemplateImage" />
                            </Box>
                        </Grid>

                        {/* Right */}
                        <Grid item lg={6.3}>
                            <Box className="mb-1r">
                                <Typography variant="h5" component="div" gutterBottom className="secondary-text">
                                    Hỗ Trợ Khách Hàng 
                                </Typography>

                                <Typography variant="h4" component="div" gutterBottom className="primary-text">
                                    Nhận Tư Vấn Ngay
                                </Typography>

                                <Typography variant="body2" component="div" className="description-text">
                                Hãy để lại thông tin của bạn để nhận bảng giá và tư vấn nhanh chóng từ LT House. Chúng tôi sẵn sàng giúp bạn tìm được không gian sống mơ ước!
                                </Typography>
                            </Box>

                            <Box component="form" className="form-common h-form" noValidate autoComplete="off">
                                <div>
                                    <TextField required label="Họ và tên" id="name" name="firstName" placeholder="Họ và tên" />
                                
                                    <TextField required label="Số điện thoại" id="phone-number" name="phoneNumber" placeholder="Số điện thoại" />
                               
                                    <TextField required label="Email" id="email" name="email" placeholder="Email" />
                                </div>

                                <Button type="submit" variant="contained" className="btn-scale mt-2r btn-color">
                                    Gửi
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default Home;