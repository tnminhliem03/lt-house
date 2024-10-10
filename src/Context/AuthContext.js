import { auth, db, messaging } from '../Config/Firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Api, { endpoints } from '../Config/Api';
import { getToken } from 'firebase/messaging';

const pythonanywhere_client_id = "qORR4AvOwob80sLKjGbV1CvuZXmRzYhrDnRhfs3b";
const pythonanywhere_client_secret = "uyFHp3jYSHg4S3480AXd4EBviI5PZfjgHoW0aJNwudsArxRYCqLU627RHwBZ69DZFcWWkOtExRKPRvDAmQXFqrdSp6nflL4JTECmv7lRnKKSKal93ySEqr4bA2r6St5Z";
const local_client_id = "4WQgo6OG13j1Ca5YAD7VzIRZrN0hvGtMx4Upbsy8";
const local_client_secret = "oMdZge49c15Q5d6QquDQceKhqxrrVb61AJtOknPKh6RaSxl40atL5KnOePvj7yzXHxvmmAyULBS2vNJ3z5OcXVKxTmbcmfBsJ3pvtiwceXbQ8VVHHT2y4dZA7SMnzEjr";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState({}); // user được lưu trên firebase
    const navigate = useNavigate();

    // Lấy access token từ api
    const fetchAccessToken = async (username, password) => {
        try {
            const oauth2Response = await Api.post(endpoints['login'], {
                'grant_type': 'password',
                'username': username,
                'password': password,
                'client_id': pythonanywhere_client_id,
                'client_secret': pythonanywhere_client_secret,
            });

            const accessToken = oauth2Response.data.access_token;

            localStorage.setItem('accessToken', accessToken);
            
            return accessToken;
        } catch (error) {
            console.error("Lỗi lấy token: ", error);
            throw error;
        };
    };

    // Gọi api current-user để lấy thông tin người dùng từ database
    const fetchCurrentUserInfo = async (accessToken) => {
        try {
            const infoResponse = await Api.get(endpoints['current-user'], {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            console.log(accessToken);

            return infoResponse.data;
        } catch (error) {
            console.error("Lỗi lấy thông tin người dùng: ", error);
            throw error;
        };
    };

    // Tạo các doc cần thiết trên Firestore
    const handleSignUpFirestore = async (uid, firstName, lastName, email, username, dateJoined, phone, gender, birthday, avatar) => {
        try {
            await setDoc(doc(db, 'users', uid), {
                displayName: `${firstName} ${lastName}`,
                email,
                username,
                firstName,
                lastName,
                dateJoined,
                phone,
                gender,
                birthday,
                uid: uid,
                photoURL: avatar
            });
            console.log("Đã tạo mới người dùng trên Firestore.");

            await setDoc(doc(db, 'userChats', uid), {});
            console.log("Đã tạo mới UserChats trên Firestore.");

        } catch (error) {
            console.error("Lỗi set doc trên Firestore: ", error);
            throw error;
        };
    };

    // Tạo tài khoản trên Authentication Firebase
    const handleSignUpAuth = async (email, password, firstName, lastName, avatar) => {
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(res.user, {
                displayName: `${firstName} ${lastName}`,
                photoURL: avatar
            });

        } catch (error) {
            console.error("Lỗi đăng ký Authentication: ", error);
            if (error.response) {
                console.error("Phản hồi lỗi:", error.response.data);
            }
            console.error("Chi tiết lỗi:", error);
        };
    };

    // Cập nhật user đang đăng nhập
    useEffect(() => {
        const unSub = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
        });

        return () => unSub();
    }, []);

    const logout = () => {
        auth.signOut();
        navigate('/');
    };
    
    return (
        <AuthContext.Provider value={{ currentUser, fetchAccessToken, fetchCurrentUserInfo, handleSignUpFirestore,
            handleSignUpAuth, logout }} >
                { children }
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);