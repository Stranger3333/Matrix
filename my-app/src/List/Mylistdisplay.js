import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
    BrowserRouter as Router,
    withRouter,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { x } from "../LoginComponent/LoginForm_Bootstrap.js";
import { Card, Container, Stack, ListGroup, Modal, Button, Row, Col } from 'react-bootstrap'
import Getcontent from "./Getcontent.js";
export default () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [mylist, setList] = useState([]);
    const email = JSON.parse(window.localStorage.getItem('login')).email;

    console.log(JSON.parse(window.localStorage.getItem('login')).email)
    useEffect(() => {
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: { 'Content-type': 'text/plain' },
            body: JSON.stringify({ "user_id": email })
        };
        fetch('http://localhost:8000/get_owned_list', request)
            .then(response => {
                return response.json();
            })
            .then(response => {
                // this.setState({ mylist: response.rec })
                setList(response.rec)
                console.log(response.rec + "info");
            })
            .catch((error) => {
                console.log(error)
            });
    }, []);


    return (
        <div>
            {/* {this.getmylist()} */}
            <Card style={{ width: '75%' }} className = "d-flex">
                <ListGroup>
                    {mylist.map((myl) => {
                        return (<Mytab valueProps={myl} />)
                    }
                    )
                    }

                </ListGroup>

            </Card>
        </div>
    )
}
function Mytab(myl) {
    return (
        <>
                <ListGroup.Item id={myl.valueProps.listid} style={{ height: '4em' }}
                    action href={"/list/" + myl.valueProps.listid}>{myl.valueProps.list_name}</ListGroup.Item>
        </>

    )
}
