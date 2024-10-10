import React from 'react';
import './Footer.css';
import { Box, Container, Grid, Typography } from '@mui/material';
import { useLayoutContext } from '../../../Context/LayoutContext';

function Footer () {
    const { sizes } = useLayoutContext();
    return (
        <React.Fragment key="footer">
            <Container maxWidth="lg">
                <Box className="f-box">
                    <Box className="mb-1r">
                        <Typography variant="body1" align="center">
                            Copyright ©2024, LT House
                        </Typography>
                    </Box>

                    <Box>
                        <Grid container spacing={3} justifyContent="center">
                            <Grid item>
                                <img style={{ width: sizes.avatarWidthMd, height: sizes.avatarHeightMd }} src="https://img.icons8.com/color/48/facebook-new.png" alt="facebook-new"/>
                            </Grid>

                            <Grid item>
                                <img style={{ width: sizes.avatarWidthMd, height: sizes.avatarHeightMd }} src="https://img.icons8.com/color/48/instagram-new--v1.png" alt="instagram-new--v1"/>
                            </Grid>

                            <Grid item>
                                <img style={{ width: sizes.avatarWidthMd, height: sizes.avatarHeightMd }} src="https://img.icons8.com/color/48/tiktok--v1.png" alt="tiktok--v1"/>
                            </Grid>

                            <Grid item>
                                <img style={{ width: sizes.avatarWidthMd, height: sizes.avatarHeightMd }} src="https://img.icons8.com/color/48/youtube-play.png" alt="youtube-play"/>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </React.Fragment>
    );
};

export default Footer;