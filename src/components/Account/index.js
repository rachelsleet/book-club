import React from 'react';
import { PasswordChangeForm } from '../PasswordChange';
import { PasswordForgetForm } from '../PasswordForget';


const Account = () => (
    <div>
        <p>Account</p>
        <PasswordForgetForm />
        <PasswordChangeForm />
    </div>
);

export default Account;