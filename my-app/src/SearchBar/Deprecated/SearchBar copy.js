import React from 'react';

class FilterableProductTable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            filterText: '',
            banners:[],
            inputList:[]
        };
        this.handleSearch=this.handleSearch.bind(this);
    }
    handleSearch(keywords){
        this.setState({
            filterText:keywords
        });
        fetch('http://localhost:8000/search_movie/' + keywords)
                    .then(data => {
                        console.log('parsed json', data);
                        return data.json()})
                    .then(data => {
                        this.setState({
                            banners: data.rec
                        });
                        console.log('parsed json', data.rec);            
                    }, (ex) => {
                        this.setState({
                            requestError : true
                        });
                        console.log('parsing failed', ex)
                    })

    }
    render(){
        const filterText=this.state.filterText;
        const banners=this.state.banners;

        return(
            <div>
                <SearchBar
                    filterText={filterText}
                    onSearch={this.handleSearch}
                    onCheckBox={this.handleCheckBox}/>
                <ProductTable
                    banners={banners}
                    />
            </div>
        )
    }
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
        this.props.onSearch(inputText)
    }
    render(){
        return(
            <div>
                <input type="text" ref='inputText' value={this.state.keywords} onChange={this.handleChange} placeholder="Search Movie"/>
                <button onClick={this.handleSubmit}>
                    Submit
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




export default FilterableProductTable;