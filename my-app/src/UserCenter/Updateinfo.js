import React from 'react';
import moment from 'moment';
import { Form, Row, Col, Button, Modal } from 'react-bootstrap'
import {
    BrowserRouter as Router,
    withRouter,
    Switch,
    Route,
    Link
} from "react-router-dom";
const user_info = JSON.parse(window.localStorage.getItem('login'))
class Updateinfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // var/objs to use
            new_username: user_info.username,
            new_password: user_info.password,
            new_birthday: user_info.birthday,
            // new_birthday: x[0],
            new_gender: user_info.gender,
            status: 0,
            delete: 0
        };
        // this.handleEmailRegistration = this.handleEmailRegistration.bind(this);
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleBirthday = this.handleBirthday.bind(this);
        this.handleGender = this.handleGender.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.DeleteUser = this.DeleteUser.bind(this);
        // this.componentDidMount = this.componentDidMount.bind(this)

    }
    handleUsername(e) {
        // if(e.target.value.length > 0){
        //     this.setState({
        //         new_username: e.target.value

        //     })
        // }else{
        {
            this.setState({
                new_username: e.target.value

            });
        }
    }
    handlePassword(e) {
        // console.log(e.target.value.length)

        this.setState({
            new_password: e.target.value

        })


    }
    handleBirthday(e) {

        this.setState({
            new_birthday: e.target.value

        })
    }
    handleGender(e) {
        // console.log(e.target.value.length);

        this.setState({
            new_gender: e.target.value

        })

    }
    handleSubmit(e) {
        // alert('Your personal information has been successfully updated.')
        // alert(x[3])
        // alert('Username' + this.state.new_username + ',Birthday: ' + this.state.new_birthday + "; " + "Gender: " + this.state.new_gender + ',password:' + this.state.new_password);
        // e.preventDefault();
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: { 'Content-type': 'text/plain' },
            body: JSON.stringify({ 'username': this.state.new_username, 'password': this.state.new_password, 'gender': this.state.new_gender, 'birthday': this.state.new_birthday, 'email': JSON.parse(window.localStorage.getItem('login')).email })
        };
        fetch('http://localhost:8000/update_user', request)
            // if backend receive and response
            .then(response => {
                return response.json()
            })
            .then(response => {
                console.log(response)
                this.setState({ status: response.rec });
                console.log(this.state.status)
                if (this.state.status === 0) {
                    alert('Your personal information has been successfully updated.')
                    console.log(this.state.new_username)
                    // this.props.history.push("/home");
                } else {
                    alert('Username may already existed! Please use other usernames')
                }
                console.log('parsed json', response.rec);
            }, (e) => {
                this.setState({ requestError: true });
                console.log('parsing failed', e)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        // try to clear the input box after inputs
        // document.getElementById('update').reset();
        var x = { 'username': this.state.new_username, 'password': this.state.new_password, 'gender': this.state.new_gender, 'birthday': this.state.new_birthday, 'email': JSON.parse(window.localStorage.getItem('login')).email }
        window.localStorage.setItem('login', JSON.stringify(x));
        // window.localStorage.setItem('login'.password, JSON.stringify(this.state.new_password));
        // window.localStorage.setItem('login'.gender, JSON.stringify(this.state.new_gender));


    }
    // componentDidMount(e) {
    //     window.localStorage.setItem('username',JSON.stringify(this.state.new_username));
    //     window.localStorage.setItem('password', JSON.stringify(this.state.new_password));
    //     window.localStorage.setItem('gender', JSON.stringify(this.state.new_gender));
    //     window.localStorage.setItem('birthday', JSON.stringify(this.state.new_birthday));

    //     // this.setState({new_username:JSON.parse(window.localStorage.getItem('login')).username})
    //     // this.setState({new_password: JSON.parse(window.localStorage.getItem('login')).password})
    //     // this.setState({new_birthday: JSON.parse(window.localStorage.getItem('login')).birthday})
    //     // // new_birthday: x[0],
    //     // this.setState({new_gender: JSON.parse(window.localStorage.getItem('login')).gender})
    //     // window.localStorage.setItem('username', JSON.stringify(this.state.new_username));
    //     // window.localStorage.setItem('password', JSON.stringify(this.state.new_password));
    //     // window.localStorage.setItem('gender', JSON.stringify(this.state.new_gender));
    //     // window.localStorage.setItem('birthday', JSON.stringify(this.state.new_birthday));


    // }

    DeleteUser(e) {
        e.preventDefault();
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: { 'Content-type': 'text/plain' },
            body: JSON.stringify({ 'email': JSON.parse(window.localStorage.getItem('login')).email })
        };
        fetch('http://localhost:8000/delete_user', request)
            .then(response => {
                return response.json();
            })
            .then(response => {
                // should be 1 if delete request received
                this.setState({ delete: response.rec });
                console.log('parsed json', response.rec);
                if (this.state.delete === 1) {
                    alert('Your account has been deleted.')
                    window.localStorage.setItem('login', '0');
                    this.props.history.push("/home");
                } else {
                    alert('something is wrong')
                }

            })
    }


    // myclick(e) {
    //     alert('info ' + this.state.username+','+this.state.email+','+this.state.password);
    // }
    render() {

        return (
            <div>

                {/* <Link to=""><button>
                    Back to main page
                </button>
                </Link> */}

                <form id="update" onSubmit={this.handleSubmit}>
                    {/* <h1>Update personal information</h1> */}
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>New Username</Form.Label>
                        <Col sm={3}>
                            <Form.Control type="text" placeholder="New Username" value={this.state.new_username} onChange={this.handleUsername} name="username" id="username" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>New Password</Form.Label>
                        <Col sm={3}>
                            <Form.Control type="text" placeholder="New Password" value={this.state.new_password} onChange={this.handlePassword} name="Password" id="Password" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm={2}>
                            Gender
                        </Form.Label>
                        <Col sm={3}>
                            <Form.Select value={this.state.new_gender} onChange={this.handleGender}>
                                <option value="" disabled selected>Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-Binary</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={2}>
                            Birthday
                        </Form.Label>
                        <Col sm={3}>
                            <Form.Control type="date" value={this.state.new_birthday} onChange={this.handleBirthday} />
                        </Col>
                    </Form.Group>
                    <div className="mb-2">
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
                <div>
                    <Button variant="danger" type="submit" onClick={this.DeleteUser}>Delete Account</Button><br />
                </div>
            </div>
        )
    }
}
export default withRouter(Updateinfo);
