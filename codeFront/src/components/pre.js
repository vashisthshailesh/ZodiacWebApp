import React, { Component } from "react";
import axios from 'axios'
import banner from './banner.png'
import queryString from 'query-string'
import './Autocomplete.css';

export default class Pre extends Component{
	constructor(){
		super();
		this.state = {
			username:"",
			password:"",
			res:"",
			show:true
		}
	}

	componentDidMount() {
		console.log(typeof window.location.href)
		const string = window.location.href;
		const substring = "id";

		if(string.includes(substring)){
     		
            this.setState({
               show:false 
            })
       
    }
    }


	usernameChange =(e) =>{
		this.setState({
			username: e.target.value
			
		})
		console.log(e.target.value,"u");
	}

	passwordChange =(e) =>{
		this.setState({
			password: e.target.value

		})
		console.log(e.target.value,"p");
	}

	LoginbuttonClick=(e)=> {
        e.preventDefault();
		let paramst = {
			username: this.state.username,
			password: this.state.password
		}
		axios.post('http://localhost:8000/?login=1',JSON.stringify(paramst))
		.then( response => this.setState({res: response.data}))

		console.log(this.state.res);
		if(this.state.res == "ok"){
			this.setState({
				show:false
			})
			let url = 'http://localhost:3000/?id=4532';
			window.open(url, '_blank');
		}
		else if(this.state.res == "redirectToCodechef"){
			let url = 'https://api.codechef.com/oauth/authorize?response_type=code&client_id=8b5b6fecb503998bab4ca779f54946ed&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2F&state=xyz';
			window.open(url,'_blank');
		}
		else if(this.state.res == "wrong"){
			alert("wrong password");
		}
		

	}

	render(){
		if(this.state.show){
		return(
			<div className="start">
			
			<div>
			 <input type="text" onChange={this.usernameChange} placeholder='write username'/>
			 </div>
			 <input type="password" onChange={this.passwordChange} placeholder='write password'/>
			 <div>
			 <button type="button" onClick={this.LoginbuttonClick}>Login</button>
			 </div>
			</div>
		)
		}
		else{
			return (
				<div className="start"/>
				)
		}
	}
}