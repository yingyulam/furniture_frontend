import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';


function Login({ setUser }) {

  const onSuccess = (res) => {
    var tokenData = jwtDecode(res.credential);
    var loginData = {
      googleId: tokenData.sub,
      ...tokenData
    }
    setUser(loginData);
    localStorage.setItem("login", JSON.stringify(loginData));
  };

  const onError = () => {
    console.log('Login failed');
  }

  return (
    <div>
      <GoogleLogin
        onSuccess={onSuccess}
        onError={onError}
        useOneTap
      />
    </div>
  );
}

export default Login;