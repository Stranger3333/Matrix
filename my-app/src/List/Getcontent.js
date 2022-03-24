import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Stack, Container, Card, Image, Badge, Nav, Navbar} from 'react-bootstrap'
import {
  BrowserRouter as Router,
  Switch,
  withRouter,
  Route,
  hashHistory,
  Link,
  useHistory
} from "react-router-dom";
import 'holderjs';
export default withRouter((props) => {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState([]);
  const [lname, setLname] = useState("");
  const [ldesc, setLdesc] = useState("");
  const history = useHistory();
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);
  useEffect(() => {
    const listinfo = {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: { 'Content-type': 'text/plain' },
      body: JSON.stringify({ 'list_id': props.match.params.lid })
    }
    fetch('http://localhost:8000/get_list_by_id', listinfo)
      .then(response => {
        return response.json();
      })
      .then(response => {
        setLname(response.rec.list_name)
        setLdesc(response.rec.description)
        console.log('parsed json', response.rec);
        console.log(response.rec.list_name)
        console.log(ldesc)

      }, (e) => {
        // this.setState({ requestError: true });
        console.log('parsing failed', e)
      })
  }, []);


  useEffect(() => {
    const l_id = {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: { 'Content-type': 'text/plain' },
      body: JSON.stringify({ "list_id": props.match.params.lid })
    }
    fetch('http://localhost:8000/get_list_movie', l_id)
      .then(response => {
        return response.json();
      })
      .then(response => {
        setContent(response.rec)
        console.log('parsed json', response.rec);
      }, (e) => {
        // this.setState({ requestError: true });
        console.log('parsing failed', e)
      })
  }, []);
  console.log(props)
  return (
<>
<Navbar bg="light" expand="lg">
<Container>
  <Navbar.Brand href="/userinfo">{lname}</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="me-auto">
      <Nav.Link href="/home">Home</Nav.Link>
      <Nav.Link href="#description" onClick={() => setShow(true)}>Description</Nav.Link>
      <Modal
        show={show}
        onHide={() => setShow(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            Description About {lname}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body><p>
            {ldesc}
          </p>
        </Modal.Body>
      </Modal>
      {/* <Nav.Link href="#delete" onClick={() => setShow(true)}>Delete</Nav.Link>
      <Modal show={show}
        onHide={() => setShow(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Delete your list</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <p>Are you sure you want to delete your list from your account?</p>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary">Close</Button>
    <Button variant="danger">Delete</Button>
  </Modal.Footer>
</Modal> */}
    </Nav>
  </Navbar.Collapse>
</Container>
</Navbar><br/>

      <Container className="mb-2">


        <Stack>
          <Container>
            <Card>
              <Card.Body>
                {content.map((item, index) => {
                  {console.log(item)}
                  return (<Moviecard valueProps={item} />)
                })}
              </Card.Body>
            </Card>
          </Container>
        </Stack>
        
      </Container>
  </>
  )

})



function Moviecard(item) {
  if (item.valueProps.cover == 'none') {
    item.valueProps.cover = "//st.depositphotos.com/1987177/3470/v/450/depositphotos_34700099-stock-illustration-no-photo-available-or-missing.jpg"
  }
  return (
    <Container className="mb-2">
      <Card>
        <script src="holder.js"></script>
        <Card.Body>
          <Row>
            <Col xs='2'>
              <Link style={{ textDecoration: 'none' }} to={'/movie/' + item.valueProps.movie_id}>
                <Image src={item.valueProps.cover} height='150' width='100' className='mx-auto' />
              </Link>
            </Col>
            <Col xs='9'>
              <Link style={{ textDecoration: 'none' }} to={'/movie/' + item.valueProps.movie_id}>
                <h3>
                  {item.valueProps.title}
                </h3>
              </Link>
              <div>
                Runtime: {item.valueProps.runtime} min
              </div>
              <div>
                Release Year: {item.valueProps.release_year}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}
