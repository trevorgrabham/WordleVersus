import React, { useRef } from 'react';
import axios from 'axios';
import usePlayerStore from '../stores/playerStore';
import useErrorStore from '../stores/errorStore';
import Error from '../Components/Error';
import Header from '../Components/Header';

function LoginPage() {
  const identifierRef = useRef('');
  const passwordRef = useRef('');
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const [addError, clearErrors, loginTarget, getErrorMessage] = useErrorStore(
    (state) => [
      state.addError,
      state.clearErrors,
      state.loginTarget,
      state.getErrorMessage,
    ],
  );

  console.log(`Rendering LoginPage component`);

  async function handleSubmit(event) {
    console.log(`Form submitted!`);

    event.preventDefault();
    // Check that all required fields are provided
    let identifier = identifierRef.current.value;
    let password = passwordRef.current.value;
    if (!password) {
      addError({
        message: 'Password field is required',
        target: 'loginTarget',
        component: 'password',
      });
    } else {
      if (loginTarget.length > 0)
        clearErrors({ target: 'loginTarget', component: 'password' });
    }
    if (!identifier) {
      addError({
        message: 'Username/Email field is required',
        target: 'loginTarget',
        component: 'identifier',
      });
    } else {
      if (loginTarget.length > 0)
        clearErrors({ target: 'loginTarget', component: 'identifier' });
    }
    if (!password || !identifier) return;
    let requestObject = {
      password,
      [identifier.includes('@') ? 'email' : 'username']: identifier,
    };
    // POST request
    try {
      let response = await axios.post(
        'http://127.0.0.1:8000/player/login',
        requestObject,
      );
      if (response.data.error)
        addError({
          message: response.data.message,
          target: 'loginTarget',
          component: 'global',
        });
      if (response.data.error) {
        console.log(`Received error from database: ${response.data.message}`);
        return;
      }
      if (loginTarget.length > 0)
        clearErrors({ target: 'loginTarget', component: 'global' });
      console.log(
        `Good response from database: (${Object.keys(response.data.player)
          .map((key) => `${key}:${response.data.player[key]}`)
          .join(', ')})`,
      );
      // If we caused an error, we should have fixed it by this point
      setPlayer(response.data.player);
    } catch (e) {
      console.log(`Problem connecting to backend database`);
      addError({
        message: e.message,
        target: 'loginTarget',
        component: 'global',
      });
    }
  }

  return (
    <div style={mainContainerStyle}>
      <Header />
      {getErrorMessage({ target: 'loginTarget', component: 'global' }) && (
        <Error>
          {getErrorMessage({ target: 'loginTarget', component: 'global' })}
        </Error>
      )}
      <form onSubmit={handleSubmit}>
        <div style={formContainerStyle}>
          <div style={inputFieldContainerStyle}>
            <input
              style={inputStyle}
              type="text"
              name="identifier"
              ref={identifierRef}
              placeholder="Username or Email"
            />
            {getErrorMessage({
              target: 'loginTarget',
              component: 'identifier',
            }) && (
              <Error fontSize="12">
                {getErrorMessage({
                  target: 'loginTarget',
                  component: 'identifier',
                })}
              </Error>
            )}
          </div>
          <div style={inputFieldContainerStyle}>
            <input
              style={inputStyle}
              type="password"
              name="password"
              ref={passwordRef}
              placeholder="Password"
            />
            {getErrorMessage({
              target: 'loginTarget',
              component: 'password',
            }) && (
              <Error fontSize="12">
                {getErrorMessage({
                  target: 'loginTarget',
                  component: 'password',
                })}
              </Error>
            )}
          </div>
          <button style={formButtonStyle} type="submit">
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;

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
  flexDirection: 'column',
};

const inputStyle = { flex: '1' };

const formButtonStyle = {};
