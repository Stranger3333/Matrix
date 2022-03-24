import React, {useState} from 'react';
import {Modal, Button} from 'react-bootstrap'
import LoginForm_Bootstrap from './LoginForm_Bootstrap';


export default ({onLogin}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Login
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Log In</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <LoginForm_Bootstrap setSuccessLogin={onLogin}/>
        </Modal.Body>


      </Modal>
    </>
  );
}
