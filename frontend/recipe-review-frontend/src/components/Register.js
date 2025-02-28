import React, { useState } from "react";
import { useRegisterMutation } from "../features/auth/authApiSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [register, { isLoading }] = useRegisterMutation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const user = { username, email, password };
        const response = await register(user).unwrap();
        if (response.username) {
            setUsername('');
            setEmail('');
            setPassword('');
            setError('');
            navigate('/login');
        }
    } catch (err) {
        if (err.status === 400) {
            setError(err.data.message || 'Failed to register user')
        } else {
            setError('Failed to register user')
        }
    }
  };

  return (
    <div className="auth-container">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister} className="auth-form">
            <label>
                Username
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                />
            </label>
            <label>
                Email
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
            </label>
            <label>
                Password
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a password"
                />
            </label>
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
        </form>
        {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default Register;