import React from 'react';
import logo from './logo-labelled.svg';
import { ProductList } from './pages/ProductList';

import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <ProductList />
      </header>
    </div>
  );
}

export default App;
