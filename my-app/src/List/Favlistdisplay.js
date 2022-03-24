import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
    BrowserRouter as Router,
    withRouter,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { Card, Container, Stack, ListGroup, Modal, Button } from 'react-bootstrap'
import { x } from "../LoginComponent/LoginForm_Bootstrap.js";
import Getcontent,{passpara} from './Getcontent.js';
export default () => {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         favlist: [],
    //         email: JSON.parse(window.localStorage.getItem('login')).email,
    //         showModal: false
    //     }
    //     this.componentDidMount = this.componentDidMount.bind(this);


    // }
    // openModal = () => this.setState({ showModal: true });
    // closeModal = () => this.setState({ showModal: false });

    const [favlist, setList] = useState([])
    const email = JSON.parse(window.localStorage.getItem('login')).email;


    // render() {
    // console.log(this.state.favlist);
    // this.getfavlist();
    // const favlist1 = this.state.favlist;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // console.log(email)
    useEffect(() => {
        // Update the document title using the browser API
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: { 'Content-type': 'text/plain' },
            body: JSON.stringify({ "user_id": email })
        };
        fetch('http://localhost:8000/get_fav_list', request)
            .then(response => {
                return response.json();
            })
            .then(response => {
                // this.setState({ favlist: response.rec })
                setList(response.rec)
                console.log(response.rec + "info");
                console.log(favlist)
            })
    }, []);


    // .catch((error) => {
    //     console.log(error)
    //   });
    return (
        <div>

            <Card style={{ width: '75%' }}>

                <ListGroup>
                    {favlist.map((fav) => {
                        return (<FavTab valueProps={fav} />)}
                    )
                    }
                </ListGroup>

            </Card>
        </div >
    )

}
function FavTab(fav) {
    return (
        <ListGroup.Item id={fav.valueProps.listid} style={{ height: '4em' }}
                            action href={"/list/"+fav.valueProps.listid}>{fav.valueProps.list_name}</ListGroup.Item>
    )
}