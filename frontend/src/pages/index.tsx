import React from 'react';

const Pages = { 
    LoginPage: React.lazy(() => import('./LoginPage')),
    SignupPage: React.lazy(() => import('./SignupPage')),
    StartupSearchPage: React.lazy(() => import('./StartupSearchPage')),
}

export default Pages;