import logo from './logo.svg';
import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { store } from './app/store';
import Register from './components/Register';
import './App.css';
import { Provider } from 'react-redux';
import Recipe from './components/Recipe';
import Login from './components/Login';
import TestRefresh from './components/testRefresh';
import Search from './components/Search';
import Layout from './components/Layout';
import PersistLogin from './components/PersistLogin';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route index element ={<Search />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />}/>

          <Route path="recipe/:videoId" element={<Recipe />} />

          <Route element={<PersistLogin />}>
            <Route path="loggedin" element=<Layout /> >
              <Route index element ={<Search />} />
              <Route path="recipe/:videoId" element={<Recipe />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
