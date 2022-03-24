import React from 'react';
import moment from 'moment';
import {
    BrowserRouter as Router,
    withRouter,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { Card, Container, Stack, ListGroup } from 'react-bootstrap'

import { x } from "../LoginComponent/LoginForm.js";
function Addmovie(){
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         list_id: "",
    //         movie_id: "" // example
    //     }
    //     this.getmyfav = this.getmyfav.bind(this);

    // }
    const[list_id] = 1;
    const[movie_id] = 2;
    const addtolist=(e)=> {
        e.preventDefault();
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: { 'Content-type': 'text/plain' },
            body: JSON.stringify({ 'list_id': list_id,'movie_id':movie_id })
        };
        fetch('http://localhost:8000/add_movie_to_list', request)
            .then(response => response.json())
            .then(response => {
                // this.setState({ favlist: response.rec })
                console.log(response.rec + "info");
                // console.log(this.state.favlist)
            })

    }

        return (
            <Card style={{ width: '75%',height: '10rem'}}>
                <ListGroup variant="flush">
                    <ListGroup.Item>Cras justo odio</ListGroup.Item>
                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                </ListGroup>
            </Card>
        )
}
export default Addmovie;