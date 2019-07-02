import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import './App.css';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import jwtDecode from 'jwt-decode'
import AuthRoute from './utils/AuthRoute'

import themeObject from './utils/theme'

// Components
import Navbar from './components/Navbar'

// Pages
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'

const theme = createMuiTheme(themeObject)

let authenticated
const token = localStorage.FirebaseToken
if (token) {
  const decodedToken = jwtDecode(token)
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = '/login'
    authenticated = false
  } else authenticated = true
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className="App">
        <Router>
          <Navbar/>
          <div className="container">
            <Switch>
              <Route exact path='/' component={Home} />
              <AuthRoute exact path='/login' component={Login} authenticated={authenticated} />
              <AuthRoute exact path='/signup' component={Signup} authenticated={authenticated} />
            </Switch>
          </div>
        </Router>
      </div>
    </MuiThemeProvider>
  );
}

export default App;
