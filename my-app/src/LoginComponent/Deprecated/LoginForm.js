import React from "react";
import { withRouter } from 'react-router-dom'  
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        // handle initialization activities
        this.state = {
            email : "",
            password : "",
            login_status : 0
        }
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
    }
    handleEmailChange(event) {
        this.setState({
            email: event.target.value
        })
        event.preventDefault();
    }
    
    handlePasswordChange(event){
        this.setState({
            password: event.target.value
        })
        event.preventDefault();
    }

    handleSubmit(event) {
        event.preventDefault();


        const login_request = {
            method : "POST",
            mode: "cors",
            credentials: "omit",
            headers: {'Content-type':'text/plain'},
            body: JSON.stringify({'email':this.state.email,'password':this.state.password})
        }

        fetch('http://localhost:8000/login', login_request)
            .then(response => {
                return response.json()})
            .then(response => {
                this.setState({
                    login_status: response.rec
                });
                console.log('parsed json', response.rec);
                if (this.state.login_status === 0) {
                    alert('No corresponding Email and Password found. Please enter again or create new user.')
                    
                }else{
                    // x = Object.values(this.state.login_status);
                    alert('Welcome! Log in successfully!')
                    // alert(x)
                    // const person_info = JSON.parse(this.state.login_status)
                    // console.log('person_info', Object.values(this.state.login_status))
                    
                    this.props.history.push({
                        pathname: '/personal'
                        // state: {person_info: Object.values(this.state.login_status)}
                    })
                    
                    
                }     
            }, (ex) => {
                this.setState({
                    requestError : true
                });
                console.log('parsing failed', ex)
            })
        
            this.setState({
                email: '',
                password: ''
            })


    }
    

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>Email</label>
                <input type="email" response-test="email" value={this.state.email} onChange={this.handleEmailChange} required/>
                <label>Password</label>
                <input type="text" response-test="password" value={this.state.password} onChange={this.handlePasswordChange } required/>
                <input type="submit" value="Log In" response-test="submit" />
                {/* Success: {this.state.login_status != 0} */}
            </form> 
        );
    }
}

export default withRouter(LoginForm); 