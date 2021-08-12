import React from 'react';
import AuthenticationProvider from '@contexts/AuthContext';
import {
  BrowserRouter as Router,
  Switch,
  Route,
 } from 'react-router-dom';
import Pages from '@pages';

import './App.scss';

function App() {
  return (
    <div className="App">
      <AuthenticationProvider>
        <Router>
          <Switch>
            <React.Suspense fallback={<div>loading...</div>}>
              <Route exact path="/"></Route>
              <Route path="/login">
                <Pages.LoginPage/>
              </Route>
              <Route path="/signup">
                <Pages.SignupPage />
              </Route>
            </React.Suspense>
          </Switch>
        </Router>
      </AuthenticationProvider>
    </div>
  );
}

export default App;
