import React from 'react';
import ReactDOM from 'react-dom';
import './styles/output.css';
import './styles/custom.css';

import { HashRouter } from 'react-router-dom';
import App from './App.jsx';

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);