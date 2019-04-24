import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.scss';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import Group from '../Group';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';
import GroupForm from '../GroupForm';

const App = props => {
  return (
    <div className='App'>
      <Router>
        <Navigation />

        <hr />

        <Route exact path={ROUTES.LANDING} component={LandingPage} />
        <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route path={ROUTES.HOME} component={HomePage} />
        <Route path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route path={ROUTES.ADMIN} component={AdminPage} />
        <Route path={ROUTES.GROUP_FORM} component={GroupForm} />
        <Route path={ROUTES.GROUP_PAGE} component={Group} />
      </Router>
    </div>
  );
};

export default withAuthentication(App);
