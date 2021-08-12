import React from 'react';
import AuthenticationProvider from '@contexts/AuthContext';
import {
  BrowserRouter as Router,
  Switch,
  Route,
 } from 'react-router-dom';
import Pages from '@pages';

import './App.scss';
import CountryProvider from '@contexts/CountryContext';

function App() {
  return (
    <div className="App">
      <AuthenticationProvider>
        <CountryProvider>
        <Router>
          <Switch>
            <Route exact path="/"></Route>
            <React.Suspense fallback={<div>loading...</div>}>
              <Route exact path="/"></Route>
              <Route path="/login">
                <Pages.LoginPage/>
              </Route>
              <Route path="/signup">
                <Pages.SignupPage />
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
