import { Form, Row, Col, Button,Modal } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import RegisterForm from "./RegisterForm.js"
var x = 0;

export default ({ setSuccessLogin }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState(0);

    useEffect(() => {
        console.log(loginStatus);
        if (loginStatus == -1) {
            alert("Login Failed");
        } else if (loginStatus) {
            setSuccessLogin(loginStatus);
        }
    }, [loginStatus]);


    const onClick = (e) => {
        e.preventDefault();

        const login_request = {
            method: "POST",
            mode: "cors",
            credentials: "omit",
            headers: { 'Content-type': 'text/plain' },
            body: JSON.stringify({ 'email': email, 'password': password })
        }

        fetch('http://localhost:8000/login', login_request)
            .then(response => {
                return response.json()
            })
            .then(response => {
                console.log(response.rec);
                if (!response.rec) {
                    setLoginStatus(-1);
                } else {
                    setLoginStatus(response.rec);
                }
            })

            
    }
    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
        <form onSubmit = {onClick} id="login">
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                <Form.Label column sm={2}>
                    Email
                </Form.Label>
                <Col sm={10}>
                    <Form.Control type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
                <Form.Label column sm={2}>
                    Password
                </Form.Label>
                <Col sm={10}>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
                <Col sm={{ span: 10, offset: 2 }}>

                    
                    {/* <>
                    <Button type="submit" onClick={handleShow}>Create account</Button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Your Account</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <RegisterForm/>
                        </Modal.Body>


                    </Modal>
                </> */}
           </Col>
        </Form.Group>
        </form >
        <Col sm={{ span: 10, offset: 2 }}>
        <Button form="login" type="submit" onSubmit={onClick}>Sign in</Button>{' '} or
        {' '}<Button type="submit" onClick={handleShow}>Create account</Button>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Your Account</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <RegisterForm/>
                        </Modal.Body>
                    </Modal>
        </Col>
        </div>
    )
}
export {x};