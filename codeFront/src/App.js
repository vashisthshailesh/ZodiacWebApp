import React, {Component} from 'react';
//import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import Login from "./components/login.component";
import Contestname from "./components/contestname";
import Sign from "./components/signup.component";
import Pre from "./components/pre"
import Timerss from "./components/timer"
class App extends Component {
  render(){
    return (
      <Router>
      <div className="App">
      <Route path={'/'} component={Pre}/>
      
        <div className="App-component">
          <Route path ={'/'} component ={ Contestname}/>
          <Route path ={'/'} component ={ Timerss}/>
          </div>
      </div>
      </Router>
    );
  }
}

export default App;
