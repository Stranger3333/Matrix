import React from "react";
import ReactDOM from 'react-dom';
import LoginForm from "./LoginComponent/LoginForm.js";
import URegister from "./RegisterComponent/Register.js";
import LLL from "./test_page/test.js";
import Updateinfo from "./Updateinfo.js"

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

class LoginPage extends React.Component {
    render() {
        return (
            <div>
            <LoginForm />
                <Link to="/newuser"><button>New User</button></Link>
                <Link to="/newuser"><button>New User</button></Link>
            </div>
        )
    }

}

ReactDOM.render(

    <Router>

        <Switch>

            <Route path="/lol">
                <LLL />
            </Route>
            <Route path="/register" ><URegister /></Route>
            <Route path="/personal"><Updateinfo /></Route>
            <Route path="">

                <Test />
            </Route>

        </Switch>
    </Router>

    , document.getElementById("root")

)