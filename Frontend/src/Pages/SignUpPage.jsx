import React, { useState, useEffect } from 'react';
import axios from 'axios';
import usePlayerStore from '../stores/playerStore';
import Error from '../Components/Error';

const defaultFormData = () => ({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const emptyError = () => ({
  message: '',
  target: undefined,
});

function SignUpPage() {
  const { setPlayer } = usePlayerStore();
  const [formData, setFormData] = useState(defaultFormData());

  const [error, setError] = useState(emptyError());

  useEffect(() => {
    setError({ message: `Only for debugging`, target: 'global' });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check that passwords match
    if (formData.password !== formData.confirmPassword) {
      setError({
        message: 'Password and confirm password do not match',
        target: 'confirmPassword',
      });
      return;
    }
    // Check that all required fields are supplied
    let keys = Object.keys(formData);
    for (var i = 0; i < keys.length; ++i) {
      if (!formData[keys[i]]) {
        setError({
          message: `${keys[i]} is a required field`,
          target: keys[i],
        });
        return;
      }
    }
    // POST request
    try {
      const response = await axios.post('http://127.0.0.1:8000/player/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      // If error occured, report it
      // Else clear errors
      setError(
        response.data.error
          ? {
              message: response.data.errorMessage,
              target: 'global',
            }
          : emptyError(),
      );
      if (response.data.error) return;
      // Clear form and update playerStore
      setFormData(defaultFormData());
      setPlayer(response.data.player);
    } catch (error) {
      setError({ message: error.message, target: 'global' });
    }
  };

  return (
    <div style={mainContainerStyle}>
      {error.target && <Error>{error.message}</Error>}
      <form onSubmit={handleSubmit}>
        <div style={formContainerStyle}>
          <div style={inputFieldContainerStyle}>
            <input
              style={inputStyle}
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            {error.target === 'username' && (
              <Error fontSize={12}>{error.message}</Error>
            )}
          </div>
          <div style={inputFieldContainerStyle}>
            <input
              style={inputStyle}
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div style={inputFieldContainerStyle}>
            <input
              style={inputStyle}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div style={inputFieldContainerStyle}>
            <input
              style={inputStyle}
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
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
