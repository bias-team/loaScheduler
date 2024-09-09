// src/components/Login.tsx
import React, { useState } from 'react';
import { login, createUser } from '../api';

interface LoginProps {
  onLogin: (userId: number) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [key, setKey] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUser(key);
        alert('User created successfully. Please log in.');
        setIsRegistering(false);
      } else {
        const response = await login(key);
        onLogin(response.id); // 백엔드에서 사용자 ID를 반환한다고 가정
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="User Key"
          required
        />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)}>
        {isRegistering ? 'Switch to Login' : 'Switch to Register'}
      </button>
    </div>
  );
};

export default Login;