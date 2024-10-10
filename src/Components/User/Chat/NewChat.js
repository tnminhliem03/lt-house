import React, { useState } from 'react';
import './Chat.css'; 
import { Avatar, Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useAuthContext } from '../../../Context/AuthContext';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../Config/Firebase';

function NewChat() {
    const { currentUser } = useAuthContext();

    const [userSearch, setUserSearch] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const searchTerm = formData.get("searchTerm").toLowerCase();

        try {
            const userRef = collection(db, 'users');

            const allDocsSnapshot = await getDocs(userRef);

            const results = allDocsSnapshot.docs
                .map((doc) => ({ ...doc.data(), id: doc.id }))
                .filter((user) => user.displayName.toLowerCase().includes(searchTerm));

            setUserSearch(results);
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    };

    const handleAdd = async (user) => {
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
        console.log(combinedId);

        try {
            const res = await getDoc(doc(db, 'chats', combinedId));
            
            if (!res.exists()) {
                await setDoc(doc(db, 'chats', combinedId), {
                    messages: []
                });

                await updateDoc(doc(db, 'userChats', currentUser.uid), {
                    [combinedId+".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoURL: user.photoURL
                    },
                    [combinedId+".date"]: serverTimestamp()
                });

                await updateDoc(doc(db, 'userChats', user.uid), {
                    [combinedId+".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoURL: currentUser.photoURL
                    },
                    [combinedId+".date"]: serverTimestamp()
                });
            }

        } catch (error) {
            setUserSearch(null);
        }
    };

    return (
        <React.Fragment key="new-chat">
            <Box className="au-modal bdr-06r">
                <Box component="form" className="form-common nc-form align-center" onSubmit={handleSearch} sx={{ '& .MuiTextField-root': { width: '25ch' } }}>
                    <TextField name="searchTerm" placeholder="Tìm thành viên" required />
                    <Button type="submit" variant="contained" className="btn-color" sx={{ ml: 2 }}>Tìm</Button>
                </Box>

                {userSearch.length > 0 && userSearch.map((user) => (
                    <Box key={user.id} className="justify-between mt-3r">
                        <Grid container spacing={2} className="align-center">
                            <Grid item>
                                <Avatar alt={user.displayName} src={user.photoURL || "/static/images/avatar/1.jpg"} />
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" component="div" className="secondary-text">
                                    {user.displayName}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Button variant="contained" className="btn-color" onClick={() => handleAdd(user)}>
                            Thêm
                        </Button>
                    </Box>
                ))}
            </Box>
        </React.Fragment>
    );
}

export default NewChat;
