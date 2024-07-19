import React from 'react';
import { useRefreshMutation } from '../features/auth/authApiSlice';

const TestRefresh = () => {
  const [refresh] = useRefreshMutation();

  const handleRefresh = async () => {
    try {
      const response = await refresh().unwrap();
      console.log("Refresh Response:", response);
    } catch (err) {
      console.error("Error refreshing token:", err);
    }
  };

  return (
    <div>
      <h2>Test Refresh Token</h2>
      <button onClick={handleRefresh}>Refresh Token</button>
    </div>
  );
};

export default TestRefresh;