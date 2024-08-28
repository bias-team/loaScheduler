// src\components\Login.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/memberSlice';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const dispatch = useDispatch();

    const handleLogin = () => {
        // Mock login process
        if (username === 'tester') {
            dispatch(login({ id: 1, username: 'tester' }));
        } else {
            alert('Invalid username. Use "tester" to log in.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;