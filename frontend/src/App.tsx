import React from 'react';
import AuthenticationProvider from '@contexts/AuthContext';
import {
  BrowserRouter as Router,
  Switch,
  Route,
 } from 'react-router-dom';
import './App.scss';
import TestComponent from './components/TestComponent';

function App() {
  return (
    <div className="App">
      <AuthenticationProvider>
        <Router>
          <Switch>
            <Route exact path="/"></Route>
            <Route exact path="/database" component={TestComponent}></Route>
          </Switch>
        </Router>
      </AuthenticationProvider>
    </div>
  );
}

export default App;
