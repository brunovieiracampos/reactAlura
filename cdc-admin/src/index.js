import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter, Route } from 'react-router-dom'
import AutorBox from './Autor';
import Home from './Home';

ReactDOM.render((<BrowserRouter>
    <div>
        <App>
            <Route exact path="/" />
            <Route path="/home" component={Home} />
            <Route path="/autor" component={AutorBox} />
            <Route path="/livro" />
        </App>
    </div>
</BrowserRouter>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
