import React from 'react';
import { Link } from 'react-router-dom';
import { AuthUserContext } from '../Session';

import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

const Navigation = () => (
  <div className='nav-bar'>
    <AuthUserContext.Consumer>
      {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = () => (
  <div>
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>LANDING</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>HOME</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>ACCOUNT</Link>
      </li>
      <li>
        <Link to={ROUTES.ADMIN}>ADMIN</Link>
      </li>
      <li>
        <SignOutButton />
      </li>
    </ul>
  </div>
);

const NavigationNonAuth = () => (
  <div>
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>LANDING</Link>
      </li>
      <li>
        <Link to={ROUTES.SIGN_IN}>SIGN IN</Link>
      </li>
    </ul>
  </div>
);

export default Navigation;
