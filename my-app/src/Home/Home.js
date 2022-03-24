import React, {useEffect, useState} from 'react';
import { Card, Container , Stack, ListGroup, Image, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import Header from '../Header/Header';
import 'holderjs';
import 'bootstrap/dist/css/bootstrap.min.css';


const MovieCard = ({info}) => (
    <Card style={{ width: '16rem', minHeight: '18rem' }}>
    <Card.Body>

        <Link style={{ textDecoration:'none', color: 'black'}} to={'/movie/'.concat(info.movie_id)}>
            <Card.Title>{info.title}</Card.Title>
            <Card.Img src={info.cover === "none" 
                        ? "//st.depositphotos.com/1987177/3470/v/450/depositphotos_34700099-stock-illustration-no-photo-available-or-missing.jpg"    
                        : info.cover
                        } />
        </Link>

    </Card.Body>
    </Card>
)

const MovieCardGroup = ({movies}) => (
    movies.map((m) => {
        console.log("m:", m);
        return(

        <Stack direction='horizontal' className='align-items-stretch' gap={3}>
            <MovieCard info={m}/>
        </Stack>
    )})
)

const ListCard = ({info}) => {



    const [disable, setDisable] = useState(false);
    const handleFav = () =>{
        setDisable(true);
        const request = {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: { 'Content-type': 'text/plain' },
            body: JSON.stringify({"list_id":info.list_id, "user_id":JSON.parse(window.localStorage.getItem('login')).email})
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
    }

    

    return (
        <Card style={{ width: '16rem', minHeight: '18rem'}} >
        <Card.Body>
            
            <Card.Title style={{height:'2.2rem'}}>
                <Link style={{ textDecoration:'none', color: 'black'}} to={'/list/'.concat(info.list_id)}>
                    {info.list_name}
                </Link>
                <Button variant='outline-primary' style={{ float: 'right' }} width='180' disabled={disable} onClick={handleFav}>+</Button>
            </Card.Title>

            
            
            <Link style={{ textDecoration:'none', color: 'black'}} to={'/list/'.concat(info.list_id)}>
                <Card.Img src={info.cover === "none" 
                    ? "//st.depositphotos.com/1987177/3470/v/450/depositphotos_34700099-stock-illustration-no-photo-available-or-missing.jpg"    
                    : info.cover
                } 
                />
                <div style={{float:'right'}}>
                    Created by {info.level} member
                </div>

            </Link>

        </Card.Body>
        </Card>
    )

}

const ListCardGroup = ({lists}) => (
    <Stack direction='horizontal' className='align-items-stretch' gap={3}>
        {lists.map((l) => (
            <ListCard info={l}/>
        ))}
    </Stack>
)

export default () => {
    
    const [movies, setMovies] = useState([]);
    const [lists, setLists] = useState([]);

    const login = JSON.parse(window.localStorage.getItem('login'));


    useEffect(() => {
        
        fetch('http://localhost:8000/randomly_generate_movie', { method: 'GET' })
        .then(response => response.json())
        .then(response => {
            setMovies(response.rec);
        })
        
        console.log("userid: ", login);

        const body = login ? {"user_id": login.email} : {"user_id": ''};


        fetch('http://localhost:8000/randomly_generate_list', 
            { method: 'POST',
                mode: 'cors',
                credentials: 'omit',
                headers: { 'Content-type': 'text/plain' },
                body: JSON.stringify(body)
            }
        )
        .then(response => response.json())
        .then(response => {
            setLists(response.rec);
        })

    }, []);

    useEffect(() => {
        lists.map(l => {
            console.log(JSON.stringify(l));
        })
    }, [lists]);


    return (
        <Stack gap={3}>
            <Header/>
            
            <Container>
                <Stack gap={3}>
                    <h2>
                    Featured Movies
                    </h2>
                    <Stack direction="horizontal" gap={3}>

                    <MovieCardGroup movies={movies}/>

                    </Stack>
                    <h2>
                    Featured Lists
                    </h2>
                    <Stack direction="horizontal" gap={3}>

                    <ListCardGroup lists={lists}/>

                    </Stack>
                </Stack>
            </Container>
        </Stack>
    )
}


