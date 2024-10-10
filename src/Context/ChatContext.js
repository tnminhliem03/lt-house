import React, { createContext, useContext, useState } from 'react';
import { useAuthContext } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { currentUser } = useAuthContext();

    const INITIAL_STATE = {
        chatId: "null",
        user: {}
    };

    const [state, setState] = useState(INITIAL_STATE);

    const changeUser = (user) => {
        const chatId = currentUser.uid > user.uid ? 
            currentUser.uid + user.uid : 
            user.uid + currentUser.uid;

        setState({ user, chatId });
    };

    return (
        <ChatContext.Provider value={{ data: state, changeUser }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => useContext(ChatContext);