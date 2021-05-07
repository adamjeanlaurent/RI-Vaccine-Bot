import React, {useState} from 'react';
import Header from './components/Header/Header';
import LoginForm from './components/LoginForm/LoginForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import Home from './components/Home/Home';
import PrivateRoute from './utils/PrivateRoutes';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import AlertComponent from './components/AlertComponent/AlertComponent'; 
import UserForm from './components/UserForm/UserForm';

function App() {
  const [title, updateTitle] = useState(null);
  const [errorMessage, updateErrorMessage] = useState(null);
  return (
    <Router>
      <div className="App">
        <Header title={title} />
          <div className="container d-flex align-items-center flex-column">
            <Switch>
              <Route path="/" exact={true}>
                <RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle} />
              </Route>
              <Route path="/register">
              <RegistrationForm showError={updateErrorMessage} updateTitle={updateTitle}/>
              </Route>
              <Route path="/login">
                <LoginForm showError={updateErrorMessage} updateTitle={updateTitle}/>
              </Route>
              <Route path="/form">
                <UserForm showError={updateErrorMessage} updateTitle={updateTitle}/>
              </Route>
              <Route path="/home">
                <Home/>
              </Route>
            </Switch> 
            <AlertComponent errorMessage={errorMessage} hideError={updateErrorMessage}/>
          </div>
      </div>
    </Router>
  );
}

export default App;
