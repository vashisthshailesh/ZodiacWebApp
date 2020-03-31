import React, { Component } from 'react'
import axios from 'axios'
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import queryString from 'query-string'
import './Autocomplete.css';
export default class Contestname extends Component {


    constructor () {
        super()
        this.state = {
            username: [],
            contestDetails:[],
            show:false,
            Ccodes:[],
            allContest:[],
            suggestion:[],
            once:true,
            text:'',
            questionsList: [],
            qcode:[],
            qNotShown:true,
            qDetails:[],
            qbody:"",
            qsol:"",
            exinput:"",
            codeOutput:"",
            compileOutput:"",
            ranklist:[]
        }
        
        this.handleClick = this.handleClick.bind(this)
    }


    componentDidMount() {
        console.log(this.props.location) // "?filter=top&origin=im"
        const values = queryString.parse(this.props.location.search)
        console.log(values.id)
        if(parseInt(values.id,10) == 4532){
            this.setState({
               show:true 
            })
            console.log("reached ere");
            axios.get('http://localhost:8000/?name=')
            .then(response => JSON.parse(response.data))
            .then(x => this.setState({allContest :x['result']['data']['content']['contestList']})) 
        }
    }

    handlechange = (e) =>{
        if(this.state.once){
            this.state.allContest.map((item) => this.state.Ccodes.push(item['code']));
            this.state.once = false;
        }
        const value = e.target.value;
        let suggestion = [];
        if(value.length != 0){
            const regex = new RegExp(`^${value}`,'i');
            suggestion =this.state.Ccodes.filter(v => regex.test(v));
        }
        this.setState(() => ({suggestion, text:value}));
    }

    suggestionSelected(value){
        this.setState(() => ({
            text:value,
            suggestion:[],
        }))
    }

    handleClick =(e)=> {
        e.preventDefault();
        this.setState({
            contestDetails:[],
            questionsList:[],
            qcode:[],
            qNotShown :true
        })
        axios.get('http://localhost:8000/?name='+this.state.text)
        .then(response => JSON.parse(response.data))
        .then(x => this.setState({contestDetails : x['result']['data']['content']}))
        .then(y => this.setState({questionsList : this.state.contestDetails['problemsList']}))
        .then(y => this.setState({qbody:""}))

        axios.get('http://localhost:8000/?contestDetails='+this.state.text)
        .then(res => JSON.parse(res.data))
        .then(res => this.setState({ranklist: res}))
    }



    renderSuggestion(){
        const{suggestion} = this.state;
        if(suggestion.length === 0){
            return null;
        }
        return(
            
            <ul>
            {suggestion.map((item) => <li onClick={() => this.suggestionSelected(item)}> {item}</li>)}
            </ul>
            
            )
    }

    makeQuestionRequest = (id) =>{
        axios.get('http://localhost:8000/?name='+this.state.text+'&qcode='+id)
        .then(response => JSON.parse(response.data))
        .then(x => this.setState({qDetails: x['result']['data']['content']}))
        .then(y => this.setState({qbody: this.state.qDetails["body"]}))
    }

    renderbody(){
        return(
            <div className="qbody" dangerouslySetInnerHTML={{ __html: this.state.qbody }} />
            )
        }

    fileUpload=(e)=>{
        let files = e.target.files;
        // let reader = new FileReader();
        // reader.readAsDataURL(files[0]);
        // this.state.qsol = e.target.result;
    }
    renderTimer(){
        // if (this.state.qcode.length > 0){
        //     return( {this.state.time.m this.state.time.s}
        // )
        // }
        // else{
        //     return (null)
        // }
           
    }

    renderQuestion(){
        this.state.qcode = [];
        this.state.questionsList.map((item) => this.state.qcode.push(item['problemCode']));
        
        return(
            <div className = "questionListStyle">
            <ul>          
            {this.state.qcode.map((item)=> <li onClick={() => this.makeQuestionRequest(item)} id={item}>{item}</li>)}
        
            </ul> 
            
            </div>       
            )
       
    }


    renderRanklist(){

        return(
            <div className = "ranklisttable">
            <table>
            <tr>
            <th> Rank </th>
            <th> Username </th>
            </tr>
            {this.state.ranklist.map(item => <tr> <td> {item["rank"]} </td> <td> {item["username"]} </td> </tr>)}
            </table>
            </div>       
            )
       
    }

    solutionChange =(e)=>{
        this.state.qsol = e.target.value;
    }

    inputToCodeChange =(e)=>{
        this.state.exinput = e.target.value;
    }

    postqbody = (e) => {
        e.preventDefault();
        let paramst = {
            sourceCode: this.state.qsol,
            input: this.state.exinput
        };
        axios.post('http://localhost:8000/?ide=34',JSON.stringify(paramst))
        .then(res => JSON.parse(res.data))
        .then(res => this.setState({codeOutput:res['output'],compileOutput:res['cmpinfo']}));
    }


    render () {
       
        if(this.state.show){
            const{text} = this.state;
            return (
                <div >
                    <div>
                    <form onSubmit = {this.handleClick}> 
                    <div className ="Contestname">
                    <input value={text} type="text" onChange={this.handlechange} placeholder='write contest'/>
                    {this.renderSuggestion()}
                    <button type = "submit">Submit</button>
                    </div>
                    <hr/>
                    {this.renderQuestion()} 
                    {this.renderRanklist()}
                    <hr/>
                    {this.renderbody()} 
                    </form>
                    </div>
                    <div className="qsol">
                    <textarea name="qsolbody" onChange={this.solutionChange} placeholder='write your code here'/>
                    
                    </div>
                    <div className="qinputbody" >
                    <textarea name="qinputbody" onChange={this.inputToCodeChange} placeholder='write your input here'/>
                    <textarea name="outputbody" value={this.state.codeOutput.length > 0?this.state.codeOutput:this.state.compileOutput} placeholder='your output here'/>

                    <input type = "file" name="codefile" on onChange={this.fileUpload}/>
                    <button type="button" onClick={this.postqbody}> Submit Answer </button>
                    </div>

                </div>
            )
        }
        else{
            return(
                <div>
                    <h2> please login </h2>
                </div>
                )
        }
    }
}

