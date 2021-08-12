import React from 'react';
import AuthenticationProvider from '@contexts/AuthContext';
import {
  BrowserRouter as Router,
  Switch,
  Route,
 } from 'react-router-dom';
import './App.scss';

function App() {
  return (
    <div className="App">
      <AuthenticationProvider>
        <Router>
          <Switch>
            <Route exact path="/"></Route>
          </Switch>
        </Router>
      </AuthenticationProvider>
    </div>
  );
}

export default App;
