// this file will contains the personal info of user, including user's own list, user's fav list
import { Tabs, Tab, Row, Col, Nav, Button } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    withRouter,
    Switch,
    Route,
    Link
} from "react-router-dom";
import React from "react";
import Updateinfo from "./Updateinfo.js"
import Mydisplay from "../List/Mylistdisplay.js"
import Favlistdisplay,{Getfavlist} from "../List/Favlistdisplay.js"

// export default function UserInfo(){
//     return (
//         <Nav variant="pills" defaultActiveKey="/home">
//             <Nav.Item>
//                 <Nav.Link href="/home">Active</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//                 <Nav.Link eventKey="link-1">Option 2</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//                 <Nav.Link eventKey="disabled" disabled>
//                     Disabled
//                 </Nav.Link>
//             </Nav.Item>
//         </Nav>
//     )
// };
class UserInfo extends React.Component {
    render() {
        return (
            <div>
            <Button variant= "secondary" style={{margin: "0.5em",position:"absolute",top:0,right:0}} href="/home">Back to homepage</Button>
            
            <Tab.Container id="left-tabs"  defaultActiveKey="info" >
                <Row>
                    <Col sm={3}>
                        
                        <Nav justify variant="pills" className="flex-column" style={{margin: "0.5em"}}>
                            <Nav.Item>
                                <Nav.Link eventKey="info" href="#info" >Update Your Information</Nav.Link>
                            </Nav.Item>
                            <Nav.Item style={{padding:"0.5em 0 0"}}>
                                <Nav.Link eventKey="mylist" href="#mylist" >My Own Lists</Nav.Link>
                            </Nav.Item>
                            <Nav.Item style={{padding:"0.5em 0 0"}}>
                                <Nav.Link eventKey="favlist" href="#favlist" >My Favorite Lists</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="info">
                                <div>
                                <br/>
                                <h2>
                                 Update Your Information   
                                </h2><br/>
                                <Updateinfo/>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="mylist">
                            <br/>
                            <h2>
                                 My Own Lists  
                            </h2><br/>
                                <Mydisplay />
                            </Tab.Pane>
                            <Tab.Pane eventKey="favlist">
                            <br/>  
                            <h2>
                                 My Favorite Lists  
                            </h2>
                            <br/>
                                <Favlistdisplay />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
            </div>
        )
    }
}
export default UserInfo