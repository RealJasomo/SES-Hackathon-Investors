import React from 'react';

const Pages = { 
    LoginPage: React.lazy(() => import('./LoginPage')),
    SignupPage: React.lazy(() => import('./SignupPage')),
}

export default Pages;