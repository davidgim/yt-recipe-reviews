import React, { useState } from "react";
import { useRegisterMutation } from "../features/auth/authApiSlice";

const Register = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const user = { username, email, password };
        await register(user).unwrap();
        alert('User registered successfully');
        setUsername('');
        setEmail('');
        setPassword('');
        setError('');
    } catch (err) {
        setError(err.data || 'Failed to register user');
    }
  };

  return (
    <div>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
            </label>
            <label>
                Email:
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            </label>
            <label>
                Password:
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </label>
            <button type="submit" disabled={isLoading}>Register</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Register;