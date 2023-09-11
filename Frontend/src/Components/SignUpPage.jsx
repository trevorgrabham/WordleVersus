import React, { useState } from 'react';
import axios from 'axios';
import usePlayerStore from '../stores/playerStore';

function SignUpPage() {
  const { setPlayerId, setUsername, setEmail } = usePlayerStore();

  const defaultFormData = () => ({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const updatePlayerStore = ({ playerId, username, email }) => {
    setPlayerId(playerId);
    setUsername(username);
    setEmail(email);
  };

  const [formData, setFormData] = useState(defaultFormData());

  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(() => 'Password and confirm password do not match');
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/player/signup', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      setError(() => (response.data.error ? response.data.errorMessage : ''));
      if (response.data.error) return;
      setFormData(() => defaultFormData());
      updatePlayerStore(response.data.player);
    } catch (error) {
      console.error('Error', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h1>{error}</h1>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password:
          <input
            type="text"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <label>
          Confirm Password:
          <input
            type="text"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Sign Up</button>
      </div>
    </form>
  );
}

export default SignUpPage;
