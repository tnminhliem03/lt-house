import './App.css';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuthContext } from './Context/AuthContext';
import HomePage from './Components/Guest/Home/Home';
import HeaderPage from './Components/Guest/Header/Header';
import LoginPage from './Components/Guest/Login/Login';
import AccountPage from './Components/User/Account/Account';
import ComplaintPage from './Components/User/Complaint/Complaint';
import PackagePage from './Components/User/Package/Package';
import SecurityCardPage from './Components/User/SecurityCard/SecurityCard';
import PaymentPage from './Components/User/Payment/Payment';
import SurveyPage from './Components/User/Survey/Survey';
import SurveyDetailPage from './Components/User/Survey/SurveyDetail';
import ChatPage from './Components/User/Chat/Chat';
import FooterPage from './Components/Guest/Footer/Footer';
import { useProfileContext } from './Context/ProfileContext';
import { Box } from '@mui/material';


function App(props) {
  const { currentUser } = useAuthContext();
  const { currentUserInfo } = useProfileContext();
  const answeredSurvey = currentUserInfo.answered;

  return (
    <React.Fragment>
        <HeaderPage />

        <main>
          <Routes>
            <Route exact path="/dashboard" Component={HomePage} />
            <Route path="/login" Component={LoginPage} />

            {currentUser ? (
              <>
                <Route path={`/${currentUser.uid}/profile`} Component={AccountPage} />
                <Route path={`/${currentUser.uid}/complaints`} Component={ComplaintPage} />
                <Route path={`/${currentUser.uid}/packages`} Component={PackagePage} />
                <Route path={`/${currentUser.uid}/security-cards`} Component={SecurityCardPage} />
                <Route path={`/${currentUser.uid}/payments`} Component={PaymentPage} />
                <Route path={`/${currentUser.uid}/surveys`} Component={SurveyPage} />
                <Route path={`/${currentUser.uid}/chats`} Component={ChatPage} />

                <Route path={`/${currentUser.uid}/surveys/:surveyId/detail`} element={answeredSurvey ?
                  <SurveyDetailPage /> : <Navigate to={`/${currentUser.uid}/surveys`} />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}

            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
        
        <Box className="h-bg-black">
          <FooterPage />
        </Box>
    </React.Fragment>
  );
}

export default App;
