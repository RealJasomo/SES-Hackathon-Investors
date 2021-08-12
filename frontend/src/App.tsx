import React from 'react';
import AuthenticationProvider from '@contexts/AuthContext';
import {
  BrowserRouter as Router,
  Switch,
  Route,
 } from 'react-router-dom';
import Pages from '@pages';
import UnauthedNav from '@components/UnauthedNav';
import CountryProvider from '@contexts/CountryContext';
import Sidenav from '@components/Sidenav';

import './App.scss';

function App() {
  return (
    <div className="App">
      <AuthenticationProvider>
        <CountryProvider>
        <Router>
          <Switch>
            <Route exact path="/"></Route>
            <React.Suspense fallback={<div>loading...</div>}>
              <Route exact path={['/', '/contact', '/about']}>
                <UnauthedNav/>
              </Route>
              <Route exact path="/">
                <Pages.HomePage />
              </Route>
              <Route path="/contact">
                <Pages.ContactPage />
              </Route>
              <Route path="/about">
                <Pages.AboutPage />
              </Route>
              <Route path="/login">
                <Pages.LoginPage />
              </Route>
              <Route path="/signup">
                <Pages.SignupPage />
              </Route>
              <Route exact path={['/dashboard', '/investments', '/startups', '/messages', '/search', '/settings']}>
                <Sidenav/>
              </Route>
              <Route path="/search/startups">
                <Pages.StartupSearchPage/>
              </Route>
            </React.Suspense>
          </Switch>
        </Router>
        </CountryProvider>
      </AuthenticationProvider>
    </div>
  );
}

export default App;
