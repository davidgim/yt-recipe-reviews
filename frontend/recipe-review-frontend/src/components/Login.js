import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../features/auth/authApiSlice";
import { setCredentials } from "../features/auth/authSlice";

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const credentials = { username, password };
        const response = await login(credentials).unwrap();
        console.log("Login Response:", response);
        const { user, token } = response;
        dispatch(setCredentials({ user, token }));
        alert('User logged in successfully');
        setUsername('');
        setPassword('');
        setError('');
    } catch (err) {
    }
  }
  return (
    <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
            <label>
                Username
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <label>
                Password
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <button type="submit" disabled={isLoading}>Login</button>
        </form>
    </div>
  );
};

export default Login
