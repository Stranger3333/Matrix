import React, { useState } from "react";

function App() {
    const [inputList, setInputList] = useState([{keyword : ""}]);
    const [banners, setBanners] = useState([]);
    const [filterText, setFilterText] = useState("");

    const handleSearch = (event) => {
        
        const request ={
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: {'Content-type':'text/plain'},
            body: JSON.stringify(inputList)
        };

        console.log(request.body);

        fetch('http://localhost:8000/search_movie', request)
                    .then(data => {
                        console.log('parsed json', data);
                        return data.json()})
                    .then(data => {
                        setBanners(data.rec);
                        console.log('parsed json', data.rec);            
                    }, (ex) => {
                        console.log('parsing failed', ex)
                    })

    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, {keyword: "" }]);
    };
 
    return (
    <div className="App">
        Search
        {inputList.map((x, i) => {
        return (
            <div className="box">
            <input
                name="keyword"
                value={x.keyword}
                onChange={e => handleInputChange(e, i)}
            />

            <div className="btn-box">
                {inputList.length !== 1 && <button onClick={handleRemoveClick} className="mr10">Remove</button>}
                {inputList.length - 1 === i && <button onClick={handleAddClick}>Add</button>}
            </div>
            </div>
        );
        })}
        <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div>
        <div>
            <SearchBar
                        filterText={'aa'}
                        onSearch={handleSearch}
                        />
            <ProductTable
                banners={banners}
                />
        </div>
    </div>
    );
}

class SearchBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            keywords:''
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    handleChange(e){
        e.preventDefault();
        let inputText=this.refs.inputText.value;
        this.setState({keywords:inputText});
    }
    handleSubmit(e){
        e.preventDefault();
        let inputText = this.state.keywords;
        console.log(inputText);
        this.props.onSearch(inputText)
    }
    render(){
        return(
            <div>
                <button onClick={this.handleSubmit}>
                    Search
                </button>
            
            </div>
        )
    }
}

class ProductTable extends React.Component{
    constructor() {
                super();
                this.state = {
                    banners: ['']
                }
            }
            
            
        
            render() {
                
                return (
                    <div>
                    <h1>Get </h1>
                    {
                        this.props.banners.map((photo,index) =>{
                            return(
                                <ul key = {index}>
                                    <h3>{index}:{photo}</h3>
                                </ul>
                            )
                        })
                    }
                    </div>
                    
                )}
}
 
export default App;