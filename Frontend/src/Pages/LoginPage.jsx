import React, { useState, useEffect } from 'react';
import axios from 'axios';
import usePlayerStore from '../stores/playerStore';
import useGameSettingStore from '../stores/gameSettingsStore';
import Error from '../Components/Error';

const emptyFormData = () => ({
  identifier: '',
  password: '',
});
const emptyError = () => ({
  message: '',
  target: undefined,
});

function LoginPage() {
  console.log(`Rendering LoginPage component`);
  const { setPlayer } = usePlayerStore();
  const { setWordleLength } = useGameSettingStore();
  const [error, setError] = useState(emptyError());
  const [formData, setFormData] = useState(emptyFormData());

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function handleSubmit(event) {
    console.log(`Form submitted!`);

    event.preventDefault();
    // Check that all required fields are provided
    let keys = Object.keys(formData);
    for (var i = 0; i < keys.length; ++i) {
      if (!formData[keys[i]]) {
        setError({
          message: `${
            keys[i] === 'identifier' ? 'Username or Email' : keys[i]
          } is a required field`,
          target: keys[i],
        });
        console.log(`${formData[key]} field is empty`);
        return;
      }
    }
    let requestObject = {
      password: formData.password,
    };
    // Parse identifier as an email or username
    if (formData.identifier.includes('@'))
      requestObject['email'] = formData.identifier;
    else requestObject['username'] = formData.identifier;
    console.log(
      `Identifier is of type: ${requestObject.email ? 'email' : 'username'}`,
    );
    console.log(
      `Attemping a POST request to http://127.0.0.1:8000/player/login`,
    );
    // POST request
    try {
      let response = await axios.post(
        'http://127.0.0.1:8000/player/login',
        requestObject,
      );
      setError(
        response.data.error
          ? {
              message: response.data.message,
              target: 'global',
            }
          : emptyError(),
      );
      if (response.data.error) {
        console.log(`Received error from database: ${response.data.message}`);
        return;
      }
      console.log(
        `Good response from database: (${Object.keys(response.data.player)
          .map((key) => `${key}:${response.data.player[key]}`)
          .join(', ')})`,
      );
      /* DEBUG ONLY */ setWordleLength(5);
      setPlayer(response.data.player);
      setFormData(emptyFormData());
    } catch (e) {
      console.log(`Problem connecting to backend database`);
      setError({ message: e.message, target: 'global' });
    }
  }

  return (
    <div style={mainContainerStyle}>
      {error.target && <Error>{error.message}</Error>}
      <form onSubmit={handleSubmit}>
        <div style={formContainerStyle}>
          <div style={inputFieldContainerStyle}>
            <input
              style={inputStyle}
              type="text"
              name="identifier"
              placeholder="Username or Email"
              value={formData.identifier}
              onChange={handleInputChange}
            />
            {error.target === 'identifier' && (
              <Error fontSize={12}>{error.message}</Error>
            )}
          </div>
          <div style={inputFieldContainerStyle}>
            <input
              style={inputStyle}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {error.target === 'password' && (
              <Error fontSize={12}>{error.message}</Error>
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
