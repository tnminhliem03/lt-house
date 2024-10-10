import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'survey-core/defaultV2.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { LayoutProvider } from './Context/LayoutContext';
import { AuthProvider } from './Context/AuthContext';
import { ProfileProvider } from './Context/ProfileContext';
import { ChatProvider } from './Context/ChatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LayoutProvider>
        <AuthProvider>
          <ProfileProvider>
            <ChatProvider>
              <App /> 
            </ChatProvider>
          </ProfileProvider>
        </AuthProvider>
      </LayoutProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
