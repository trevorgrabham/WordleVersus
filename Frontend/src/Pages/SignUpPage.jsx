import React, { useRef } from 'react';
import axios from 'axios';
import usePlayerStore from '../stores/playerStore';
import Error from '../Components/Error';
import useErrorStore from '../stores/errorStore';

function SignUpPage() {
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const [addError, clearErrors, signupTarget, getErrorMessage] = useErrorStore(
    (state) => [
      state.addError,
      state.clearErrors,
      state.signupTarget,
      state.getErrorMessage,
    ],
  );

  const usernameRef = useRef('');
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const confirmPasswordRef = useRef('');

  const handleSubmit = async (event) => {
    console.log('Form submitted');
    event.preventDefault();

    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (!username) {
      addError({
        message: 'Username field is required',
        target: 'signupTarget',
        component: 'username',
      });
    } else {
      if (signupTarget.length)
        clearErrors({ target: 'signupTarget', component: 'username' });
    }
    if (!email) {
      addError({
        message: 'Email field is required',
        target: 'signupTarget',
        component: 'email',
      });
    } else {
      if (signupTarget.length)
        clearErrors({ target: 'signupTarget', component: 'email' });
    }
    if (!password) {
      addError({
        message: 'Password field is required',
        target: 'signupTarget',
        component: 'password',
      });
    } else {
      if (signupTarget.length)
        clearErrors({ target: 'signupTarget', component: 'password' });
    }
    if (!confirmPassword) {
      addError({
        message: 'Confirm Password field is required',
        target: 'signupTarget',
        component: 'confirmPassword',
      });
    } else {
      if (signupTarget.length)
        clearErrors({ target: 'signupTarget', component: 'confirmPassword' });
    }
    if (password !== confirmPassword) {
      addError({
        message: 'Passwords do not match',
        target: 'signupTarget',
        component: 'confirmPassword',
      });
      addError({
        message: 'Passwords do not match',
        target: 'signupTarget',
        component: 'password',
      });
    }
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      password !== confirmPassword
    )
      return;

    // POST request
    try {
      const response = await axios.post('http://127.0.0.1:8000/player/signup', {
        username,
        email,
        password,
      });
      // If error occured, report it
      // Else clear errors
      if (response.data.error)
        return addError({
          message: response.data.message,
          target: 'signupTarget',
          component: 'global',
        });
      clearErrors({ target: 'signupTarget', component: 'global' });
      // Clear form and update playerStore
      setPlayer(response.data.player);
    } catch (error) {
      setError({
        message: error.message,
        target: 'signupTarget',
        component: 'global',
      });
    }
  };

  return (
    <div style={mainContainerStyle}>
      {getErrorMessage({ target: 'signupTarget', component: 'global' }) && (
        <Error>
          {getErrorMessage({ target: 'signupTarget', component: 'global' })}
        </Error>
      )}
      <form onSubmit={handleSubmit}>
        <div style={formContainerStyle}>
          <div style={inputFieldContainerStyle}>
            <input
              style={inputStyle}
              type="text"
              name="username"
              placeholder="Username"
              ref={usernameRef}
            />
          </div>
          {getErrorMessage({
            target: 'signupTarget',
            component: 'username',
          }) && (
            <Error fontSize="12">
              {getErrorMessage({
                target: 'signupTarget',
                component: 'username',
              })}
            </Error>
          )}
          <div style={inputFieldContainerStyle}>
            <input
              style={inputStyle}
              type="text"
              name="email"
              placeholder="Email"
              ref={emailRef}
            />
          </div>
          {getErrorMessage({ target: 'signupTarget', component: 'email' }) && (
            <Error fontSize="12">
              {getErrorMessage({ target: 'signupTarget', component: 'email' })}
            </Error>
          )}
          <div style={inputFieldContainerStyle}>
            <input
              style={inputStyle}
              type="password"
              name="password"
              placeholder="Password"
              ref={passwordRef}
            />
          </div>
          {getErrorMessage({
            target: 'signupTarget',
            component: 'password',
          }) && (
            <Error fontSize="12">
              {getErrorMessage({
                target: 'signupTarget',
                component: 'password',
              })}
            </Error>
          )}
          <div style={inputFieldContainerStyle}>
            <input
              style={inputStyle}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              ref={confirmPasswordRef}
            />
          </div>
          {getErrorMessage({
            target: 'signupTarget',
            component: 'confirmPassword',
          }) && (
            <Error fontSize="12">
              {getErrorMessage({
                target: 'signupTarget',
                component: 'confirmPassword',
              })}
            </Error>
          )}
          <button style={formButtonStyle} type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignUpPage;

const mainContainerStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const formContainerStyle = {
  width: '60vw',
  height: '80vh',
  border: '2px solid grey',
  padding: '1vh, 1vw',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const inputFieldContainerStyle = {
  width: '50%',
  margin: '12px',
  display: 'flex',
  flexDirection: 'row',
};

const inputStyle = { flex: '1' };

const formButtonStyle = {};
