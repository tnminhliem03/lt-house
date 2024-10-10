import React, { createContext, useContext, useEffect, useState } from 'react';
import Api, { endpoints } from '../Config/Api'
import { useAuthContext } from './AuthContext';
import { useLayoutContext } from './LayoutContext';


const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { currentUser, fetchCurrentUserInfo } = useAuthContext();
    const { setIsLoading } = useLayoutContext();

    const [currentUserInfo, setCurrentUserInfo] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [message, setMessage] = useState('');

    
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchProfile = async () => {
            if (currentUser && currentUser.uid) {
                setIsLoading(true);
                try {
                    const info = await fetchCurrentUserInfo(accessToken);
                    setCurrentUserInfo(info);
                    console.log("Thông tin người dùng: ", info);
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin người dùng: ", error);
                } finally {
                    setIsLoading(false);
                };
            }
        };

        fetchProfile();
    }, [currentUser, accessToken]);

    const handleUpdateProfile = async (formData) => {
        setIsLoading(true);

        try {
            const res = await Api.patch(endpoints['update-profile'](currentUserInfo.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const avatarUrl = res.data.avatar;
            await localStorage.setItem('avatarUrl', avatarUrl);

            setCurrentUserInfo(res.data);
            setMessage("Cập nhật thông tin thành công!");
            setOpenSnackbar(true);
        } catch (error) {
            console.log("Lỗi cập nhật: ", error);
            setMessage("Không thể cập nhật thông tin. Vui lòng thử lại sau!");
            setOpenSnackbar(true);
        } finally {
            setIsLoading(false);
        };
    }

    return (
        <ProfileContext.Provider value={{ currentUserInfo, openSnackbar, setOpenSnackbar, message, setMessage,
            handleUpdateProfile }} >
                { children }
        </ProfileContext.Provider>
    );
};

export const useProfileContext = () => useContext(ProfileContext);