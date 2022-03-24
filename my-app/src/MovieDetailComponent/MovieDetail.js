import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Stack, Form, FormControl, Button,ListGroup, Container, Card, Dropdown, Collapse, Image, Row, Col, Ratio, Modal, ModalTitle } from 'react-bootstrap';
import 'holderjs';
import StarRatings from 'react-star-ratings';
import "./MovieDetail.css"
import {
    BrowserRouter as Router,
    withRouter,
    Switch,
    Route,
    Link
} from "react-router-dom";

// import StarRatings from 'react-star-ratings';

const ListCard = (item) => {
    const [disable, setDisable] = useState(false);
    const handleFav = () =>{
        if (JSON.parse(window.localStorage.getItem('login')).email){
        setDisable(true);
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: { 'Content-type': 'text/plain' },
            body: JSON.stringify({"list_id":item.valueProps.list_id, "user_id":JSON.parse(window.localStorage.getItem('login')).email})
        };
        fetch('http://localhost:8000/add_fav_list', request)
                .then(data => {
                    console.log('parsed json', data);
                    return data.json()
                })
                .then(data => {
                    console.log('parsed json', data.rec);
                }, (ex) => {
                    console.log('parsing failed', ex)
                });
        }else{
            alert('Please login first!')
        }

    }

    console.log("hhhhh",item)
    if (item.valueProps.cover=='none'){
        item.valueProps.cover = "//st.depositphotos.com/1987177/3470/v/450/depositphotos_34700099-stock-illustration-no-photo-available-or-missing.jpg"
    }
    return(
    
    <Card style={{ width: '15rem' }}>
    <Card.Body>
        <script src="holder.js"></script>
        <Card.Title style={{height:'2.2rem'}}>
        <Link style={{ textDecoration:'none',color: 'black'}} to={'/list/'.concat(item.valueProps.list_id)}>
            {item.valueProps.list_name}
        </Link>
            <Button variant='outline-primary' width='180' style={{ float: 'right' }} disabled={disable} onClick={handleFav}>+</Button>
        
        </Card.Title>
        <Link style={{ textDecoration:'none',color: 'black'}} to={'/list/'.concat(item.valueProps.list_id)}>
        <Card.Img variant="top" width='180' height='300' src={item.valueProps.cover} />
        <div style={{float:'right'}}>
            Created by {item.valueProps.level} member
        </div>

        </Link>
    </Card.Body>
    </Card>
)}

class MovieDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // var/objs to use
            display: "",
            movie_id: this.props.match.params.movieId,
            cover:"",
            description:"",
            language:"",
            people_id:[],
            production:"",
            release_year:"",
            runtime:"",
            title:"",
            type:"",
            director:"",
            writer:"",
            clickIndex: 0,
            hoverIndex: 0,
            rating:0,
            avg_rating:0,
            list:[]
        };
        this.changeRating = this.changeRating.bind(this)
        this.goBack = this.goBack.bind(this);
    }
    componentDidMount(e) {
        const request ={
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: {'Content-type':'text/plain'},
            body:JSON.stringify({'movie_id':this.state.movie_id})
        };
        fetch('http://localhost:8000/get_all_movies', request)
            .then(response => response.json())
            .then(response => {
                console.log("hhhhhh",response)
                // this.setState({ movie_id: response.rec.movie_id })
                this.setState({ 
                movie_id: response.rec.movie_id,
                cover:response.rec.cover,
                description:response.rec.description,
                language:response.rec.language,
                people_id:response.rec.peopleid_and_job,
                production:response.rec.production,
                release_year:response.rec.release_year,
                runtime:response.rec.runtime,
                title:response.rec.title,
                type:response.rec.type,
                avg_rating: response.rec.rating       
                })
                if (this.state.cover=='none'){
                    this.state.cover = "//st.depositphotos.com/1987177/3470/v/450/depositphotos_34700099-stock-illustration-no-photo-available-or-missing.jpg"
                }
                console.log(response.rec + "info");
                console.log(this.state)
            }).then(
                ()=>{
                    if (this.state.people_id)
                        this.state.people_id.map((item,index)=>{
                        item = item.split(":")
                        console.log(item)
                        if (item[1]=='director'){
                            const request ={
                                method: 'POST',
                                mode: 'cors',
                                credentials: 'omit',
                                headers: {'Content-type':'text/plain'},
                                body:JSON.stringify({'peopleid':item[0]})
                            };
                            fetch('http://localhost:8000/get_all_people', request)
                            .then(response => response.json())
                            .then(response => {
                                // this.setState({ movie_id: response.rec.movie_id })
                                this.setState({ 
                                director:response.rec.name  
                                })
                                console.log(response+ "hhhhhhh");
                                console.log(this.state)
                            })
                        }else if (item[1]=='writer'){
                            const request ={
                                method: 'POST',
                                mode: 'cors',
                                credentials: 'omit',
                                headers: {'Content-type':'text/plain'},
                                body:JSON.stringify({'peopleid':item[0]})
                            };
                            fetch('http://localhost:8000/get_all_people', request)
                            .then(response => response.json())
                            .then(response => {
                                // this.setState({ movie_id: response.rec.movie_id })
                                this.setState({ 
                                writer:response.rec.name
                                })
                                console.log(response + "hhhhhhh");
                                console.log(this.state)
                            })
                        
                }}
            )
    }).then(
        ()=>{
            if (JSON.parse(window.localStorage.getItem('login')).email){
            console.log("hgfdg",request)
            fetch('http://localhost:8000/randomly_generate_list', {
                method: 'POST',
                body:JSON.stringify({'user_id':JSON.parse(window.localStorage.getItem('login')).email})})
                            .then(response => response.json())
                            .then(response => {
                                // this.setState({ movie_id: response.rec.movie_id })
                                this.setState({ 
                                list:response.rec  
                                })
                                console.log(response+ "hhhhhhh");
                                console.log(this.state)
                            })}else{
                                console.log("hgfdg",request)
                                fetch('http://localhost:8000/randomly_generate_list', {
                                    method: 'POST',
                                    body:JSON.stringify({'user_id':""})})
                                                .then(response => response.json())
                                                .then(response => {
                                                    // this.setState({ movie_id: response.rec.movie_id })
                                                    this.setState({ 
                                                    list:response.rec  
                                                    })
                                                    console.log(response+ "hhhhhhh");
                                                    console.log(this.state)
                                })
            }
        }
    );
    // componentDidMount(e) {
    }
    changeRating( newRating, name ) {
        this.setState({
          rating: newRating
        });
        if (JSON.parse(window.localStorage.getItem('login')).email){
            const request = {
                method: 'POST',
                mode: 'cors',
                credentials: 'omit',
                headers: { 'Content-type': 'text/plain' },
                body: JSON.stringify({"movieid":this.state.movie_id, "userid":JSON.parse(window.localStorage.getItem('login')).email,"rating":newRating})
            };
            console.log(request)
            fetch('http://localhost:8000/rating_post', request)
                    .then(data => {
                        console.log('parsed json', data);
                        return data.json()
                    })
                    .then(data => {
                        console.log('parsed json', data.rec);
                        if (data.rec.whether_lucky){
                            alert("You are the lucky people! Your rating will be doubled.")
                        }
                    }, (ex) => {
                        console.log('parsing failed', ex)
                    });
            }else{
                alert('Please login first!')
            }
      }
      goBack(){
        this.props.history.goBack();
    }
    
    // <img alt="Lee Jung-jae, Anupam Tripathi, Oh Yeong-su, Heo Sung-tae, Park Hae-soo, Jung Hoyeon, and Wi Ha-Joon in Ojing-eo geim (2021)" class="ipc-image" loading="lazy" src="https://m.media-amazon.com/images/M/MV5BYWE3MDVkN2EtNjQ5MS00ZDQ4LTliNzYtMjc2YWMzMDEwMTA3XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_QL75_UX190_CR0,0,190,281_.jpg" srcset="https://m.media-amazon.com/images/M/MV5BYWE3MDVkN2EtNjQ5MS00ZDQ4LTliNzYtMjc2YWMzMDEwMTA3XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_QL75_UX190_CR0,0,190,281_.jpg 190w, https://m.media-amazon.com/images/M/MV5BYWE3MDVkN2EtNjQ5MS00ZDQ4LTliNzYtMjc2YWMzMDEwMTA3XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_QL75_UX285_CR0,0,285,422_.jpg 285w, https://m.media-amazon.com/images/M/MV5BYWE3MDVkN2EtNjQ5MS00ZDQ4LTliNzYtMjc2YWMzMDEwMTA3XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_QL75_UX380_CR0,0,380,562_.jpg 380w" sizes="50vw, (min-width: 480px) 34vw, (min-width: 600px) 26vw, (min-width: 1024px) 16vw, (min-width: 1280px) 16vw" width="190">
    // <img alt="Jeremy Renner and Hailee Steinfeld in Hawkeye (2021)" class="ipc-image" loading="lazy" src="https://m.media-amazon.com/images/M/MV5BNmQ1MGQ2NjItNzVmOC00MmIwLWJjZTUtNGFlMmNjYWE2NjNkXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_QL75_UY281_CR18,0,190,281_.jpg" srcset="https://m.media-amazon.com/images/M/MV5BNmQ1MGQ2NjItNzVmOC00MmIwLWJjZTUtNGFlMmNjYWE2NjNkXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_QL75_UY281_CR18,0,190,281_.jpg 190w, https://m.media-amazon.com/images/M/MV5BNmQ1MGQ2NjItNzVmOC00MmIwLWJjZTUtNGFlMmNjYWE2NjNkXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_QL75_UY422_CR26,0,285,422_.jpg 285w, https://m.media-amazon.com/images/M/MV5BNmQ1MGQ2NjItNzVmOC00MmIwLWJjZTUtNGFlMmNjYWE2NjNkXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_QL75_UY562_CR35,0,380,562_.jpg 380w" sizes="50vw, (min-width: 480px) 34vw, (min-width: 600px) 26vw, (min-width: 1024px) 16vw, (min-width: 1280px) 16vw" width="190"></img>
    // // myclick(e) {
    //     alert('info ' + this.state.username+','+this.state.email+','+this.state.password);
    // }
    render() {
        return(
            <Stack gap={3}>
            <Header/>
            <Container className="mb-2">
            <Card>
            <script src="holder.js"></script>
                <Card.Body>
                <Button variant= "secondary" style={{margin: "0.5em",position:"absolute",top:0,right:0}} onClick={this.goBack}>Back</Button>
                    <Row>
                        <Col xs='3'>
                            <Image src={this.state.cover} className='mx-auto' width='200' heigh='300'/>
                        </Col>
                        <Col>
                            <h2>
                                {this.state.title}
                            </h2>
                            <br/>
                            <div>
                            <b>Director:</b> {this.state.director}
                            </div>
                            <div>
                                <b>Writer:</b> {this.state.writer}
                            </div>
                            <div>
                             <b>Type:</b>  {this.state.type}
                            </div>
                            <div>
                            <b>Release year:</b>  {this.state.release_year}
                            </div>
                            <div>
                            <b>Run Time:</b>  {this.state.runtime} min
                            </div>
                            <div>
                            <b>Production:</b>  {this.state.production}
                            </div>
                            <div> 
                            <b>Language:</b>  {this.state.language}
                            </div>
                            <div>
                            <b>Rating:</b> {this.state.avg_rating}
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
                <Card.Body>
                    <b>Description:</b> {this.state.description}
                </Card.Body>
                <Card.Body>
                <b>Your Rating:</b> <StarRatings
                        width='100%'
                        starDimension='20px'
                rating={this.state.rating}
                starRatedColor="blue"
                changeRating={this.changeRating}
                numberOfStars={5}
                name='rating'
                />

                </Card.Body>
                <Card.Body>
                <b>Lists you may interested</b> 
                <Stack direction="horizontal" gap={3}>
                    {this.state.list.map((item,index)=>{
                        if (JSON.parse(window.localStorage.getItem('login')).email){
                            return(<ListCard valueProps = {item} user_id ={JSON.parse(window.localStorage.getItem('login')).email} />)}
                        else{
                            return(<ListCard valueProps = {item} user_id ='' />)
                        }
                        })}

                    

                    </Stack>
                </Card.Body>
            </Card>
            
            </Container>
                {/* <div class='movie_body'>

                    <div class='movie_title'>
                        {this.state.title}
                    </div>
                    <div class='movie_image'><img src="https://m.media-amazon.com/images/M/MV5BNmQ1MGQ2NjItNzVmOC00MmIwLWJjZTUtNGFlMmNjYWE2NjNkXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_QL75_UY281_CR18,0,190,281_.jpg" height="400" width="275"/></div>
                
                    <div class='movie_content'>
                    <a> Director: {this.state.director.name}</a>
                    <br/>
                    <a> Writer: {this.state.writer.name}</a>
                    <br/>
                    <a> Type: {this.state.type}</a>
                    <br/>
                    <a> Release year: {this.state.release_year}</a>
                    <br/>
                    <a> Run Time: {this.state.runtime} min</a>
                    <br/>
                    <a> Production: {this.state.production}</a>
                    <br/>
                    <a> Language: {this.state.language}</a>
                    <br/>
                    <a> Rating: </a>
                    </div>
                    <div class='movie_description'>
                        Description:{this.state.description}
                    </div>
                </div>
                <div class='rating_comments'>
                    <StarRatings
                        width='100%'
                rating={this.state.rating}
                starRatedColor="blue"
                changeRating={this.changeRating}
                numberOfStars={5}
                name='rating'
                />
                <br/>
                <input placeholder="Add your comments"></input>
        </div> */}
                
        </Stack>

        )
    }

    

}
// export default URegister;
export default withRouter(MovieDetail);