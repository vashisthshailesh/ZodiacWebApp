import React, { Component } from 'react'
import axios from 'axios'

export default class Sign extends Component {
    constructor () {
        super()
        this.state = {
        username: [],
        contest: null,
        contestDetails:[],
        show : false
        }  
        this.handleClick = this.handleClick.bind(this)
    }


    handlechange = (e) =>{
        this.setState({
            contest : e.target.value
        })
    }

    handleClick =(e)=> {
        e.preventDefault();
        axios.get('http://localhost:8000/?name='+this.state.contest)
        .then(response => this.setState({contestDetails: response.data}))
    }


    render () {
    	if(this.show){
    		return(
    			<div> welcome </div>
    		)
    	}
    	else{
    		return(<div> noope not gonna happen </div>)
    	}
       
    }
}

