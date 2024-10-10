import { Model, Survey } from 'survey-react-ui';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Box, Container, Snackbar, Typography } from '@mui/material';
import { useProfileContext } from '../../../Context/ProfileContext';
import { useLayoutContext } from '../../../Context/LayoutContext';
import Api, { endpoints } from '../../../Config/Api';
import surveyTheme from './survey_theme.json';
import './Survey.css';


function SurveyDetail() {
    const location = useLocation();
    const { survey } = location.state || {};
    const { currentUserInfo, openSnackbar, setOpenSnackbar, message, setMessage } = useProfileContext();
    const { setIsLoading, Loading } = useLayoutContext();

    const [questions, setQuestions] = useState([]);
    const [choices, setChoices] = useState([]);

    const accessToken = localStorage.getItem('accessToken');
    const navigate = useNavigate();

    const fetchAllData = async (questionsUrl, choicesUrl) => {
        setIsLoading(true);
        try {
            let allQuestions = [];
            let nextQuestionsUrl = questionsUrl;
    
            while (nextQuestionsUrl) {
                const res = await Api.get(nextQuestionsUrl);
                if (res.data && Array.isArray(res.data.results)) {
                    const filteredQuestions = res.data.results.filter((q) => q.survey === survey.id);
                    allQuestions = [...allQuestions, ...filteredQuestions];
                    nextQuestionsUrl = res.data.next;
                } else {
                    console.log("Không có câu hỏi nào tồn tại!");
                    break;
                }
            }
    
            setQuestions(allQuestions);
    
            let allChoices = [];
            let nextChoicesUrl = choicesUrl;
    
            while (nextChoicesUrl) {
                const res = await Api.get(nextChoicesUrl);
                if (res.data && Array.isArray(res.data.results)) {
                    const filteredChoices = res.data.results.filter((c) => allQuestions.some(q => q.id === c.question));
                    allChoices = [...allChoices, ...filteredChoices];
                    nextChoicesUrl = res.data.next;
                } else {
                    console.log("Không có lựa chọn nào tồn tại!");
                    break;
                }
            }
    
            setChoices(allChoices);
        } catch (error) {
            console.log("Lỗi khi lấy dữ liệu: ", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (currentUserInfo) {
            fetchAllData(endpoints.s_questions, endpoints.s_choices);
        }
    }, [currentUserInfo]);
    
    const surveyJson = {
        elements: questions.map((q) => {
            const element = {
                type: q.type,
                name: `${q.id}`,
                title: q.content,
                isRequired: true,
            };
    
            if (q.type === 'rating') {
                element.rateType = 'smileys';
            } else if (['radiogroup', 'checkbox', 'dropdown', 'tagbox', 'ranking'].includes(q.type)) {
                const relevantChoices = Array.from(new Set(choices.filter((choice) => choice.question === q.id).map(choice => choice.content)));
                element.choices = relevantChoices;
                element.placeholder = 'Chọn lựa chọn';
            }
            return element;
        })
    };

    const surveyJS = new Model(surveyJson);
    surveyJS.locale = "vi";
    surveyJS.completeText = "Hoàn thành";
    surveyJS.clearText = "Xóa";
    surveyJS.completedHtml = "Cảm ơn bạn đã tham gia khảo sát!";

    surveyJS.applyTheme({
        "cssVariables": surveyTheme.cssVariables,
        "themeName": surveyTheme.themeName,
        "colorPalette": surveyTheme.colorPalette,
        "isPanelless": surveyTheme.isPanelless,
    });

    const onComplete = async (survey) => {
        const answers = survey.data;
        const entries = Object.entries(answers);

        setIsLoading(true);

        try {
            const requests = entries.map(async ([question, content]) => {
                const questionType = survey.getQuestionByName(question).getType();
                let dataToSend = content;

                if (questionType === 'checkbox') {
                    dataToSend = Array.isArray(content) ? content : [];
                }

                return Api.post(endpoints['fill-answer'], {
                    'question_id': question,
                    'data': dataToSend,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            });

            await Promise.all(requests);
            setMessage("Cảm ơn bạn đã thực hiện khảo sát! Những khảo sát này sẽ giúp nâng cao chất lượng cuộc sống của bạn trong tương lai.")
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate(-1);
            }, 1000);
        } catch (error) {
            console.error("Lỗi: ", error);
            setMessage("Hệ thống đang lỗi. Vui lòng thử lại sau!")
        } finally {
            setIsLoading(false);
        }
    }

    surveyJS.onComplete.add(onComplete);

    return (
        <React.Fragment key="survey-detail">
            <Container maxWidth="lg">
                <Box className="mt-3r mb-3r plpr-24">
                    <Box>
                        <Typography variant="h4" component="div" className="primary-text text-center">
                            {survey.name}
                        </Typography>

                        <Typography variant="h6" component="div" className="description-text text-center">
                            {survey.description}
                        </Typography>
                    </Box>

                    <Survey model={surveyJS} />
                </Box>
            </Container>

            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}
                message={message} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} />
            <Loading />
        </React.Fragment>
    );
};

export default SurveyDetail;