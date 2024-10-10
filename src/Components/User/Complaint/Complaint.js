import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Container, Grid, Snackbar, TextField, Typography } from '@mui/material';
import Api, { endpoints } from '../../../Config/Api';
import { useLayoutContext } from '../../../Context/LayoutContext';
import { useProfileContext } from '../../../Context/ProfileContext';
import './Complaint.css';

function Complaint() {
    const { currentUserInfo, openSnackbar, setOpenSnackbar, message, setMessage } = useProfileContext();
    const { setIsLoading, Loading } = useLayoutContext();

    const [nextPage, setNextPage] = useState(null);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [complaints, setComplaints] = useState([]);
    const accessToken = localStorage.getItem('accessToken');

    const fetchComplaints = async (url, reset = false) => {
        setIsLoading(true);
    
        try {
            const res = await Api.get(url);
            if (res.data && Array.isArray(res.data.results)) {
                const userComplaints = res.data.results.filter((complaint) => complaint.resident === currentUserInfo.id);
                setComplaints((prevComplaint) => reset ? userComplaints : [...prevComplaint, ...userComplaints]);
                setNextPage(res.data.next);
            } else {
                console.error("Không có danh sách nào tồn tại!");
            }
        } catch (error) {
            console.error("Lỗi lấy thông tin các phản ánh trong quá khứ: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints(endpoints.complaints, true);
    }, [currentUserInfo]);

    useEffect(() => {
        if (nextPage) {
            fetchComplaints(nextPage);
        }
    }, [nextPage]);

    const handleSendComplaint = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        
        formData.append('name', name);
        formData.append('content', content);

        try {
            const res = await Api.post(endpoints['create-complaint'], formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setComplaints((prevComplaint) => [...prevComplaint, res.data]);
            setMessage("Thêm phản ánh mới thành công!");
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu:", error);
            setMessage("Thêm phản ánh mới thất bại. Vui lòng thử lại!");
            setOpenSnackbar(true);
        } finally {
            setIsLoading(false);
            setName('');
            setContent('');
        };
    }

    return (
        <React.Fragment key="complaint">
            <Container maxWidth="lg">
                <Box className="mt-3r plpr-24">
                    <Box>
                        <Typography variant="h4" component="div" className="primary-text text-center">
                            Phản ánh của bạn
                        </Typography>

                        <Typography variant="h6" component="div" className="description-text text-center">
                            Nêu lên suy nghĩ, những điều bạn phiền lòng dạo gần đây
                        </Typography>
                    </Box>

                    <Box component="form" className="form-common form-100" sx={{ width: { xs: '100%', sm: '60%' } }} onSubmit={handleSendComplaint} noValidate autoComplete="off">
                        <div>
                            <TextField required label="Tiêu đề" id="name" name="name" placeholder="Tiêu đề phản ánh" value={name} onChange={(e) => setName(e.target.value)} />
                    
                            <TextField multiline rows={6} required label="Nội dung" id="content" name="content" placeholder="Nội dung phản ánh" value={content} onChange={(e) => setContent(e.target.value)} />
                        </div>

                        <Button type="submit" variant="contained" className="btn-scale form-btn btn-color">
                            Gửi phản ánh
                        </Button>
                    </Box>

                    <Box className="mt-5r mb-3r">
                        <Box>
                            <Typography variant="h6" component="div" className="secondary-text text-center">
                                Những phản ánh đã gửi trước đây
                            </Typography>
                        </Box>

                        <Grid container spacing={5} className="mt-1r">
                            {complaints.sort((a,b) => new Date(b.created_date) - new Date(a.created_date)).map((complaint) => (                                
                                <Grid item xs={12} lg={4} key={complaint.id}>
                                    <Card className="inner-height" key={complaint.id}>
                                        <CardContent>
                                            <Grid container spacing={2} className="align-center">
                                                <Grid item xs={12}>
                                                    <Typography variant="h6" component="div" className="primary-text">
                                                        Chủ đề: {complaint.name}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Typography variant="body1" component="div" className="secondary-text">
                                                        Nội dung: {complaint.content}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Typography variant="body1" component="div" className="description-text">
                                                        Ngày gửi phản ánh: {dayjs(complaint.created_date).format("DD-MM-YYYY")}
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

            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}
                message={message} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
            <Loading />
        </React.Fragment>
    );
};

export default Complaint;