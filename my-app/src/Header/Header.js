import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button , Dropdown } from 'react-bootstrap'
import React, { useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import LoginIndicator from '../LoginComponent/LoginIndicator';

export default () => {

    const [searchMethod, setSearchMethod] = useState("Movie"); 
    const [keyword, setKeyword] = useState("");

    const language = new Map([
        ['English', false],
        ['Spanish', false],
        ['French', false],
        ['Chinese', false],
        ['Japanese', false],
        ['Korean', false]
    ])

    const type = new Map([
        ['Documentary', false],
        ['Comedy', false],
        ['Drama', false],
        ['Horror', false],
        ['Thriller', false],
        ['Action', false],
    ])

    const mapToObj = m => {
        return Array.from(m).reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {});
    };

    const handleSearch = () => {

        const searchJSON = JSON.stringify({
            "language": mapToObj(language),
            "type": mapToObj(type),
            "keyword": keyword,
            "isActor": searchMethod === "Actor"
        })

        console.log(searchJSON);
    
        window.localStorage.setItem('searchJSON', searchJSON);
        

    };


    return (
        <Navbar bg="light" expand="lg">
        <Container fluid>
            <Navbar.Brand href="/home" style={{fontWeight:'bold'}} >MATRIX</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
            >

            </Nav>

            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic" className="me-2">
                    {searchMethod}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item  onClick={ () => setSearchMethod("Movie") }>Movie</Dropdown.Item>
                    <Dropdown.Item  onClick={ () => setSearchMethod("Actor") }>Actor</Dropdown.Item>

                </Dropdown.Menu>
            </Dropdown>

            <Form className="d-flex">
                    <FormControl
                    type="search"
                    placeholder="Search"
                    className="me-2"
                    onChange={ (e) => setKeyword(e.target.value) }
                    value={keyword}
                    />
                    <Button variant="outline-success" className="me-2" href={"/advanced_search"} onClick={handleSearch}>Search</Button>
                    <LoginIndicator/>
                </Form>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    )
}