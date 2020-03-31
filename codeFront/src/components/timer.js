import React, { Component } from 'react'
import axios from 'axios'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import queryString from 'query-string'
import './Autocomplete.css';


export default class Timerss extends React.Component {
  constructor() {
    super();
    this.state = { time: {}, seconds: 2225,show:false };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  componentDidMount() {
    console.log(this.props.location) // "?filter=top&origin=im"
        const values = queryString.parse(this.props.location.search)
        console.log(values.id)
        if(parseInt(values.id,10) == 4532){
          this.setState({
               show:true 
            })
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
    this.startTimer();
  }
  }

  startTimer() {
    if (this.timer == 0 && this.state.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });
    
    // Check if we're at zero.
    if (seconds == 0) { 
      clearInterval(this.timer);
    }
  }

  render() {
    if(this.state.show){
    return(
      <div>
        
        m: {this.state.time.m} s: {this.state.time.s}
      </div>
    );
  }
  else{
    return (null)
  }
  }
}

