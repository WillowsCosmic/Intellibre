import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export const ToastComponent = () => {
    return (
        <ToastContainer 
            position="top-right" 
            autoClose={5000} 
            hideProgressBar={false} 
            closeOnClick 
            pauseOnHover 
            draggable 
            theme="light" 
        />
    );
};



