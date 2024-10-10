import { Avatar, Box, Button, Container, Divider, Grid, TextField, Typography, ClickAwayListener } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../../../Context/AuthContext';
import { useLayoutContext } from '../../../Context/LayoutContext';
import { SearchOutlined } from '@mui/icons-material';
import './Chat.css';
import { db, storage } from '../../../Config/Firebase';
import { arrayUnion, doc, onSnapshot, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import ImageIcon from '@mui/icons-material/Image';
import { useChatContext } from '../../../Context/ChatContext';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EmojiPicker from 'emoji-picker-react';
import NewChatModal from './NewChat';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import addNotification from 'react-push-notification';
import { useNavigate } from 'react-router-dom';



function Chat () {
    const { currentUser } = useAuthContext();
    const { data, changeUser } = useChatContext();
    const { Search, SearchIconWrapper, StyledInputBase, sizes, VisuallyHiddenInput, Loading } = useLayoutContext();

    const [addMode, setAddMode] = useState(false);
    const [openEmoji, setOpenEmoji] = useState(false);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [messImg, setMessImg] = useState(null);
    const [chats, setChats] = useState([]);
    
    const endRef = useRef(null);
    const navigate = useNavigate();

    const handleEmoji = (e) => {
        setText((prev) => prev + e.emoji);
    };

    useEffect(() => {
        const getChats = () => {
            const unSub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
                if (doc.exists()) {
                    setChats(doc.data());
                } else {
                    setChats([]);
                }
            });
    
            return () => unSub();
        };
    
        currentUser.uid && getChats();
    }, [currentUser.uid]);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'chats', data.chatId), (doc) => {
            if (doc.exists()) {
                setMessages(doc.data().messages);
            }
        });

        return () => unSub();
    }, [data.chatId]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSelectChat = (u) => {
        changeUser(u);
    };

    const handleSend = async () => {
        await updateDoc(doc(db, 'chats', data.chatId), {
            messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
            }),
        });

        await updateDoc(doc(db, 'userChats', currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
                senderId: currentUser.uid,
            },
            [data.chatId+".date"]: serverTimestamp()
        });

        await updateDoc(doc(db, 'userChats', data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
                senderId: currentUser.uid,
            },
            [data.chatId+".date"]: serverTimestamp()
        });

        setText("");
    };

    const handleSendImg = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setMessImg(file);

        const storageRef = ref(storage, `images/${uuid()}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                console.log("Ok");
            },

            (error) => {
                console.error("Upload Error: ", error);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                await updateDoc(doc(db, 'chats', data.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                        img: downloadURL,
                    }),
                });

                await updateDoc(doc(db, 'userChats', currentUser.uid), {
                    [data.chatId + ".lastMessage"]: {
                        text: "Đã gửi một ảnh",
                    },
                    [data.chatId + ".date"]: serverTimestamp()
                });

                await updateDoc(doc(db, 'userChats', data.user.uid), {
                    [data.chatId + ".lastMessage"]: {
                        text: "Đã gửi một ảnh",
                    },
                    [data.chatId + ".date"]: serverTimestamp()
                });

                setMessImg(null);
            }
        );
    };

    return (
        <React.Fragment key="chat">
            <Box className="wrapper">
                <Container maxWidth="xl" className="c-wrapper plpr-24">
                    <Box className="c-container">
                        <Grid container spacing={4}>
                            {/* Left */}
                            <Grid item xs={3} className="c-height br-white hidden-overflow">
                                <Box>
                                    <Grid container spacing={1.5} className="p-1r align-center">
                                        <Grid item>
                                            <Avatar alt="My Avatar" src={currentUser.photoURL} style={{ width: sizes.avatarWidthMd, height: sizes.avatarHeightMd }}/>
                                        </Grid>

                                        <Grid item>
                                            <Typography variant="h6" component="div" className="hidden-overflow">
                                                {currentUser.displayName}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Grid container spacing={4} direction="column" className="chat-list scroll-bar">
                                    <Grid item>
                                        <Box className="justify-between p-1r">
                                            <Box component="form">
                                                <Search>
                                                    <SearchIconWrapper>
                                                        <SearchOutlined />
                                                    </SearchIconWrapper>
                                                    <StyledInputBase name="searchTerm" placeholder="Tìm kiếm..." inputProps={{ 'aria-label': 'search' }} />
                                                </Search>
                                            </Box>
                                            <Button className="btn-color btn-scale bdr-06r chat-btn-new" variant="contained" onClick={() => setAddMode((prev) => !prev)}>
                                                {addMode ? <RemoveIcon /> : <AddIcon />}
                                            </Button>
                                        </Box>

                                        <Box>
                                            {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat) => (
                                                <>
                                                    <Grid container spacing={4} className="align-center p-1r nowrap" key={chat[0]} onClick={() => handleSelectChat(chat[1].userInfo)}>
                                                        <Grid item>
                                                            <Avatar alt={chat[1].userInfo.displayName} src={chat[1].userInfo.photoURL} />
                                                        </Grid>

                                                        <Grid item>
                                                            <Box>
                                                                <Typography variant="body1" component="div" fontWeight="600" gutterBottom className="primary-text">
                                                                    {chat[1].userInfo.displayName}
                                                                </Typography>

                                                                <Typography variant="body2" component="div">
                                                                    {chat[1].lastMessage?.text}
                                                                </Typography>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>

                                                    <Divider color="white" />
                                                </> 
                                            ))}        
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Mid */}
                            {data?.chatId === "null" ? (
                                <Grid item xs={9} className="text-center" sx={{ alignContent: 'center' }}>
                                    <Typography variant="h4" component="div" className="orange-text mb-1r plpr-24">
                                        Chào mừng trở lại với LT House Chat Realtime
                                    </Typography>

                                    <Typography variant="body1" component="div">
                                        Vui lòng chọn một cuộc trò chuyện để bắt đầu!
                                    </Typography>
                                </Grid>
                            ) : (
                                <>
                                    <Grid item xs={6} className="br-white pl-0">
                                        <Box className="flex-col">
                                            <Box className="align-center p-1r inner-width">
                                                <Grid container spacing={2} className="align-center">
                                                    <Grid item>
                                                        <Avatar alt={data.user.displayName} src={data.user.photoURL} style={{ width: sizes.avatarWidthMd, height: sizes.avatarHeightMd }} />
                                                    </Grid>
                                                    
                                                    <Grid item>
                                                        <Typography variant="h6" component="div">
                                                            {data.user.displayName}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            
                                            <Divider color="white" />

                                            {/* Chat */}
                                            <Box className="p-1r scroll-bar chat-mid-content">
                                                {messages.sort((a, b) => a.createdAt - b.createdAt).map((m) => (
                                                    <Box key={m.id}>
                                                        <Grid container spacing={2} sx={{ alignItems: "flex-end" }} className="mb-2r">
                                                            {m.senderId === currentUser.uid ? (
                                                                <>
                                                                    <Grid item className="chat-message chat-message-owner-ml">
                                                                        {m.img ? (
                                                                            <Box className="chat-img-box">
                                                                                <img className="bdr-06r chat-img" src={m.img} alt="Message Image" />
                                                                            </Box>
                                                                        ) : (
                                                                            <Box className="chat-message-owner-bg bdr-06r">
                                                                                <Typography variant="body1" component="div" className="p-1r">
                                                                                    {m.text}
                                                                                </Typography>
                                                                            </Box>
                                                                        )}
                                                                    </Grid>

                                                                    <Grid item>
                                                                        <Avatar alt="My avatar" src={currentUser.photoURL} />
                                                                    </Grid>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Grid item>
                                                                        <Avatar alt={data.user.displayName} src={data.user.photoURL} />
                                                                    </Grid>

                                                                    <Grid item className="chat-message">
                                                                        {m.img ? (
                                                                            <Box className="chat-img-box">
                                                                                <img className="bdr-06r chat-img" src={m.img} alt="Message Image" />
                                                                            </Box>
                                                                        ) : (
                                                                            <Box className="chat-message-partner bdr-06r">
                                                                                <Typography variant="body1" component="div" className="p-1r">
                                                                                    {m.text}
                                                                                </Typography>
                                                                            </Box>
                                                                        )}
                                                                    </Grid>
                                                                </>
                                                            )}
                                                        </Grid>
                                                    </Box>
                                                ))}

                                                <div ref={endRef} />
                                            </Box>
                                            
                                            <Divider color="white" />

                                            {/* Navigation */}
                                            <Grid container spacing={0} className="p-1r justify-between align-center chat-navigation">
                                                <Grid item lg={1.5}>
                                                    <Button component="label" role={undefined} tabIndex={-1} className="btn-p">
                                                        <ImageIcon />
                                                        <VisuallyHiddenInput type="file" onChange={handleSendImg} />
                                                    </Button>
                                                </Grid>

                                                <Grid item lg={7.5}>
                                                    <TextField variant="outlined" placeholder="Nhập tin nhắn..."
                                                        onChange={(e) => setText(e.target.value)} value={text} />
                                                </Grid>

                                                <Grid item className="text-center emoji" lg={1.5}>
                                                    <ClickAwayListener onClickAway={() => setOpenEmoji(false)}>
                                                        <div>
                                                            <Button className="btn-p" onClick={() => setOpenEmoji((prev) => !prev)}>
                                                                <EmojiEmotionsIcon />
                                                            </Button>

                                                            {openEmoji && (
                                                                <Box className="emoji-picker">
                                                                    <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
                                                                </Box>
                                                            )}
                                                        </div>
                                                    </ClickAwayListener>
                                                </Grid>

                                                <Grid item lg={1.5}>
                                                    <Button variant="contained" className="btn-color btn-scale" onClick={handleSend}>
                                                        Gửi
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Grid>


                                {/* Right */}
                                <Grid item xs={3} className="pl-0">
                                    <Grid container spacing={1} direction="column" className="p-1r align-center">
                                        <Grid item>
                                            <Avatar alt={data.user.displayName} src={data.user.photoURL} sx={{ width: 72, height: 72 }} />
                                        </Grid>

                                        <Grid item>
                                            <Typography variant="h6" component="div">
                                                {data.user.displayName}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Divider color="white" />
                                    
                                    {/* Info */}
                                    <Box>
                                        <Box>
                                            <Box className="justify-between align-center" sx={{ padding: '0.7rem 1rem 0.5rem 1rem' }}>
                                                <Typography variant="body1" component="div">
                                                    Ảnh đã gửi
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Grid container className="scroll-bar chat-gallery">
                                                    {/* {messages.map((m) => (
                                                        m.img &&  */}
                                                            <Grid item xs={12} sm={4} sx={{ mt: 2 }}>
                                                                <img src="" alt="abc" className="chat-gallery-img" />
                                                            </Grid>
                                                    {/* ))} */}
                                                </Grid>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            </>
                        )}
                        </Grid>
                    </Box>

                    {addMode && (
                        <Box>
                            <NewChatModal />
                        </Box>
                    )}

                    <Loading />
                </Container>
            </Box>
        </React.Fragment>
    );
};

export default Chat;