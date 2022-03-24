import React, { useState } from 'react';
import Popup from 'reactjs-popup';
import LoginForm from "./LoginForm"

export default () => {
    const [login_status, setStatus] = useState(0);
    return (
        <div>
            <Popup trigger={<button> Login</button>} position="right center">
                <div>
                    <LoginForm/>        
                </div>
            </Popup>
            Success: {login_status}
        </div>
    );
}