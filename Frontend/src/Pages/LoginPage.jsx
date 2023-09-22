import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import usePlayerStore from '../stores/playerStore';
import useErrorStore from '../stores/errorStore';
import Error from '../Components/Error';

/*
  Responsibilities - Gather the player information and logs them in

  External Data Needed - playerStore: need to be able to update the playerStore to log the player in.
                         errorStore: need to be able to set and get Errors that are from user input or the database.

  Data Set - playerStore: update the playerStore to log the user in.

  Goes To - HomePage on a successful login
*/
function LoginPage() {
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const [addError, clearErrors, getErrorMessage] = useErrorStore((state) => [
    state.addError,
    state.clearErrors,
    state.getErrorMessage,
  ]);
  const navigate = useNavigate();
  const identifierRef = useRef('');
  const passwordRef = useRef('');

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
      clearErrors({ target: 'loginTarget', component: 'password' });
    }
    if (!identifier) {
      addError({
        message: 'Username/Email field is required',
        target: 'loginTarget',
        component: 'identifier',
      });
    } else {
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
      clearErrors({ target: 'loginTarget', component: 'global' });
      console.log(
        `Good response from database: (${Object.keys(response.data.player)
          .map((key) => `${key}:${response.data.player[key]}`)
          .join(', ')})`,
      );
      // If we caused an error, we should have fixed it by this point
      setPlayer(response.data.player);
      navigate('/', { replace: true });
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
