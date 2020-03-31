import React, { Component } from "react";
import axios from 'axios'
import './Autocomplete.css';

export default class Login extends Component {
    constructor () {
        super()
        this.state = {
            
            once:true,
         
        }  
        
    }
    submitHandler =e =>{
    	axios.post('http://localhost:8000/')

    }

    raiseInvoiceClicked(){
    
    const url = 'https://api.codechef.com/oauth/authorize?response_type=code&client_id=8b5b6fecb503998bab4ca779f54946ed&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2F&state=xyz';
    window.open(url, '_blank');
    //window.location.href = "https://google.com";
    
    this.state.once = false;

}

    render() {
        if(this.state.once){
            return (
                <div>
                <h3>Welcome, User</h3>
                <div className="loginButtton">
                <form onSubmit = {this.raiseInvoiceClicked}>
                    
                    <button type="submit"  className="btn btn-primary btn-block">Login</button>
                </form>
                </div>
                </div>
            );
        }
        else{
            return(
                <h1> Logged In</h1>
            )
        }
    }
}