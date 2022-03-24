import React, { useState, useEffect } from 'react';
import { Button, Stack } from 'react-bootstrap'

import LoginModal from './LoginModal.js'

export default () => {

    const [login, setLogin] = useState(0);

    useEffect(() => {
        setLogin(JSON.parse(window.localStorage.getItem('login')));
    }, []);

    useEffect(() => {
        window.localStorage.setItem('login', JSON.stringify(login));
    }, [login]);

    const onLogin = (login_value) => {
        console.log(login_value);
        setLogin(login_value);
    }

    const onLogout = () => {
        setLogin(0);
        
    }


    if (!login) {
        return (
            
            <LoginModal onLogin={onLogin}/>
        );
    } else {
        return (            
            <Stack direction="horizontal" style={{minWidth: "13rem"}}>
            <Button variant="outline-success" className="d-flex me-2" onClick={onLogout}> Log out </Button>
            <Button variant="outline-secondary" href="/userinfo"> Personal Info </Button>
            </Stack>
            );
    }
}