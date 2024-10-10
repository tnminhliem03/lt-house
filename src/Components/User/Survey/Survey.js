import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import Api, { endpoints } from '../../../Config/Api';
import { useAuthContext } from '../../../Context/AuthContext';
import { useProfileContext } from '../../../Context/ProfileContext';
import { useLayoutContext } from '../../../Context/LayoutContext';
import './Survey.css';


function Survey() {
    const { currentUser } = useAuthContext();
    const { currentUserInfo } = useProfileContext();
    const { setIsLoading, Loading } = useLayoutContext();

    const [nextPage, setNextPage] = useState(null);
    const [surveys, setSurveys] = useState([]);

    const navigate = useNavigate();

    const fetchSurveys = async (url, reset = false) => {
        setIsLoading(true);
        
        try {
            const res = await Api.get(url);

            if (res.data && Array.isArray(res.data.results)) {
                setSurveys((prevSurvey) => reset ? res.data.results : [...prevSurvey, ...res.data.results]);
                setNextPage(res.data.next);
            } else {
                console.error("Không có danh sách nào tồn tại!");
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khảo sát: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSurveys(endpoints.surveys, true);
    }, [currentUserInfo]);

    useEffect(() => {
        if (nextPage) {
            fetchSurveys(nextPage);
        }
    }, [nextPage]);

    const handleClick = async (survey) => {
        navigate(`/${currentUser.uid}/surveys/${survey.id}/detail`, { state: { survey } });
    }

    return (
        <React.Fragment key="survey">
            <Container maxWidth="lg">
                <Box className="mt-3r mb-3r plpr-24">
                    <Box>
                        <Typography variant="h4" component="div" className="primary-text text-center">
                            Danh sách khảo sát
                        </Typography>

                        <Typography variant="h6" component="div" className="description-text text-center">
                            Vui lòng thực hiện các khảo sát để nâng cao chất lượng cuộc sống tại LT House!
                        </Typography>
                    </Box>

                    <Grid container spacing={5} className="mt-1r">
                        {surveys.sort((a,b) => new Date(b.created_date) - new Date(a.created_date)).map((survey) => {
                            const isSurveyAnswered = currentUserInfo?.answered?.includes(survey.id);

                            return (
                                <Grid item sm={6} key={survey.id}>
                                    <Card className="inner-height" key={survey.id}>
                                        <CardContent>
                                            <Grid container spacing={2.5} className="align-center">
                                                <Grid item xs={12} sm={7.5}>
                                                    <Typography variant="h6" component="div" className="primary-text">
                                                        {survey.name}
                                                    </Typography>
                                                </Grid>

                                                <Grid item sm={4.5} className="text-end">
                                                    <Button variant="contained" className={`align-center card-status white-text ${isSurveyAnswered && 'c-status-done'}`}
                                                        disabled startIcon={isSurveyAnswered ? <CheckCircleIcon /> : <HourglassBottomIcon />}>
                                                            {isSurveyAnswered ? 'Hoàn thành' : 'Chưa hoàn thành'}
                                                    </Button>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Grid container spacing={3} className="align-center">
                                                        <Grid item xs={5} sm={7.5}>
                                                            <Typography variant="body1" component="div" className="secondary-text">
                                                                {survey.description}
                                                            </Typography>
                                                        </Grid>

                                                        <Grid item xs={7} sm={4.5} className="text-end">     
                                                            <Button disabled={isSurveyAnswered} variant="contained" startIcon={<RateReviewOutlinedIcon />} onClick={() => handleClick(survey)}>
                                                                Thực hiện
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                    </Box>
            </Container>

            <Loading />
        </React.Fragment>
    );
};

export default Survey;