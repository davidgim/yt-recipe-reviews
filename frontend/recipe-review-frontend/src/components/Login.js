import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import usePersist from "../hooks/usePersist";

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()
  const [persist, setPersist] = usePersist('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const credentials = { username, password };
        const response = await login(credentials).unwrap();
        const { user, token } = response;
        dispatch(setCredentials({ user, token }));
        setUsername('');
        setPassword('');
        setError('');
        navigate('/loggedin')
    } catch (err) {
        const errorMessage = err?.data?.message || err?.data || 'Failed to login user';
        setError(errorMessage);
    }
  }

  const handleToggle = () => setPersist(prev => !prev);

  return (
    <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
            <label>
                Username
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                />
            </label>
            <label>
                Password
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                />
            </label>
            <label htmlFor="persist" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                    type="checkbox" 
                    id="persist" 
                    onChange={handleToggle} 
                    checked={persist}
                    style={{ width: 'auto' }}
                />
                Trust this device
            </label>
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
        </form>
        {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default Login;
