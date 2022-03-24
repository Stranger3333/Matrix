import React from "react";
import { Link } from "react-router-dom";
import { Container, Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

class LLL extends React.Component {
    render() {
        return (
            <div>
                <Link to="">
                never gonna give you up
                
                </Link>
                <Nav variant="pills" defaultActiveKey="/home" className="flex-column">
            <Nav.Item>
                <Nav.Link href="/home">Active</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="link-1">Option 2</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="fav list">
                    fav list
                </Nav.Link>
            </Nav.Item>
        </Nav>
            </div>
        )
    }
}
export default LLL;