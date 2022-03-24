import React from 'react';
import {
    BrowserRouter as Router,
    withRouter,
    Switch,
    Route,
    Link
} from "react-router-dom";
class URegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // var/objs to use
            username: "",
            email: "",
            password: "",
            birthday: "",
            gender: "",
            succeed: 0

        };
        this.handleEmailRegistration = this.handleEmailRegistration.bind(this);
        this.handleUsernameRegistration = this.handleUsernameRegistration.bind(this);
        this.handlePasswordRegistration = this.handlePasswordRegistration.bind(this);
        this.handleBirthdayRegistration = this.handleBirthdayRegistration.bind(this);
        this.handleGenderRegistration = this.handleGenderRegistration.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    let 
    handleUsernameRegistration(e) {
        this.setState({
            username: e.target.value
            
        });
    }
    handleEmailRegistration(e) {
        this.setState({
            email: e.target.value
        });
    }
    handlePasswordRegistration(e){
        this.setState({
            password: e.target.value
        });
    }
    handleBirthdayRegistration(e){
        this.setState({
            birthday: e.target.value
        });
    }
    handleGenderRegistration(e){
        this.setState({
            gender: e.target.value
        });
    }
    // handlBirthdayRegistration(e) {
    //     this.setState({
    //         username: e.target.value
            
    //     });
    // }
    handleSubmit(e) {
        // alert('info ' + this.state.username+','+this.state.email+','+this.state.password+','+this.state.birthday+','+this.state.gender);
        e.preventDefault();
        const request ={
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: {'Content-type':'text/plain'},
            body:JSON.stringify({'username':this.state.username, 'email':this.state.email, 'password':this.state.password,'gender':this.state.gender,'birthday':this.state.birthday})
        };
        fetch('http://localhost:8000/register', request)
            // if backend receive and response
            .then(response => {
                return response.json();
            }) 
            .then(response => {
                this.setState({succeed: response.rec});
                if (this.state.succeed === 1) {
                    alert('Your account has been registered successfully!')
                    this.props.history.push("");
                }else{
                    alert('Username or Email already existed! Please use another usernames or Email address')
                }  
                console.log('parsed json', response.rec); 
            },(e)=>{
                this.setState({requestError: true});
                console.log('parsing failed', e)
            })
            this.setState({
                username: '',
                email: '',
                password: '',
                gender: '',
                birthday: document.getElementById("birthday").value = ""
            })

    }
    
    // myclick(e) {
    //     alert('info ' + this.state.username+','+this.state.email+','+this.state.password);
    // }
    render() {
         
        return(
            <form onSubmit = {this.handleSubmit}>
                <div>
                <Link to = ""><button>
                Back to main page
                </button>
                </Link>
                    <h1>Create Your Account</h1>
                
                    <label htmlFor = 'username'>Username
                    </label> 
                    <input type="text"  placeholder="New Username" value={this.state.username} onChange = {this.handleUsernameRegistration} name="username" id="username" required/><br/>

                    <label htmlFor = 'email'>Email
                    </label> 
                    <input type="email" placeholder="Email" value={this.state.email} onChange = {this.handleEmailRegistration} name="Email" id="Email" required/><br/>
                    <label htmlFor = 'password'>Password
                    </label> 
                    <input type="text" placeholder="Password" value={this.state.password} onChange = {this.handlePasswordRegistration} name="Password" id="Password" required/><br/>
                    {/* <h2>Succeed: {this.state.succeed}</h2> */}
                    <label htmlFor='gender'>Gender</label> 
                    <select id = 'gender' value={this.state.gender} onChange = {this.handleGenderRegistration}>
                        <option value="" disabled selected>Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-Binary</option>
                    </select><br/>
                    <label htmlFor="birthday">Birthday</label>
                    <input type="date" onChange = {this.handleBirthdayRegistration} id="birthday" name="birthday"  /><br/>
                <button type = "submit">
                Create Account
                </button>
                </div>
            </form>

        )
    }
}
// export default URegister;
export default withRouter(URegister);