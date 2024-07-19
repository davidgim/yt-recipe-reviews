import logo from './logo.svg';
import React from 'react';
import { store } from './app/store';
import Register from './components/Register';
import './App.css';
import { Provider } from 'react-redux';
import Login from './components/Login';
import TestRefresh from './components/testRefresh';

function App() {
  return (
    <Provider store={store}>
      <div>
        <Register />
        <Login />
        <TestRefresh />
      </div>
    </Provider>
  );
}

export default App;
