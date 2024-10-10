import { Backdrop, Button, CircularProgress, InputBase, styled } from '@mui/material';
import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

// Các giá trị chung
const sizes = {
    widthLg: "9.375rem",
    heightLg: "3.125rem",
    avatarWidthLg: "4rem",
    avatarHeightLg: "4rem",
    avatarWidthMd: "3rem",
    avatarHeightMd: "3rem",
};



// Slider
const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
      <Button className="custom-prev-arrow btn-scale" onClick={onClick}>
          &lt;
      </Button>
  );
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
      <Button className="custom-next-arrow btn-scale" onClick={onClick}>
          &gt;
      </Button>
  );
};

const sliderStyle = {
  infinite: true,
  lazyLoad: true,
  slidesToShow: 3,
  autoplay: true,
  autoplaySpeed: 3000,
  swipeToSlide: true,
  prevArrow: <CustomPrevArrow />,
  nextArrow: <CustomNextArrow />,
};


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});



// Loading
function GradientCircularProgress() {
    return (
      <React.Fragment>
        <svg width={0} height={0}>
          <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e01cd5" />
              <stop offset="100%" stopColor="#1CB5E0" />
            </linearGradient>
          </defs>
        </svg>
        <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
      </React.Fragment>
    );
};



// Search
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)'
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(0),
        width: '80%',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'blue'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'white',
    '& .MuiInputBase-input': {
        padding: theme.spacing(2, 1, 2, 2),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: 'calc(100% - 1em - ${theme.spacing(4)})', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap', 
        [theme.breakpoints.up('md')]: {
            width: 'calc(100% - 1em - ${theme.spacing(4)})', 
        },
    },
}));



// Modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '20px',
  background: '#fff6ee',
  boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
  p: 4,
};



export const LayoutProvider = ({ children }) => {    
    const [isLoading, setIsLoading] = useState(false);

    function Loading() {
      return (
        <Backdrop open={isLoading} style={{ zIndex: 9999 }}>
          <GradientCircularProgress />
        </Backdrop>
      );
    };

    return (
        <LayoutContext.Provider value={{ isLoading, setIsLoading, Loading, sizes, GradientCircularProgress, Search,
            StyledInputBase, SearchIconWrapper, VisuallyHiddenInput, modalStyle, sliderStyle }} >
                { children }
        </LayoutContext.Provider>
    );
};

export const useLayoutContext = () => useContext(LayoutContext);