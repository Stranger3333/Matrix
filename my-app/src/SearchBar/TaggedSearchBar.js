import React, {useState} from 'react';


export default () => {
    const [banners, setBanners] = useState(['']);

    const [language, setLanguage] = useState(
        new Map([
            ['English', false],
            ['Spanish', false],
            ['French', false],
            ['Chinese', false],
            ['Japanese', false],
            ['Korean', false]
        ])
    );
    const [type, setType] = useState(
        new Map([
            ['Documentary', false],
            ['Comedy', false],
            ['Drama', false],
            ['Horror', false],
            ['Thriller', false],
            ['Action', false],
        ])
    );

    const [keyword, setKeyword] = useState("");
    const [isActor, setIsActor] = useState(false);

    const handleChangeIsMovie = () => {
        setIsActor(!isActor);
        };

    const handleChangeLanguage = (languageName) => {
        
        const updated = new Map(language);
        updated.set(languageName, !updated.get(languageName));
        setLanguage(updated);
    } 

    const handleChangeType = (typeName) => {
        
        const updated = new Map(type);
        updated.set(typeName, !updated.get(typeName));
        setType(updated);
    }

    const handleChangeKeyword = (event) => {
        setKeyword(event.target.value)
    }



    const handleSearch = (event) => {
        event.preventDefault();

        const mapToObj = m => {
            return Array.from(m).reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});
        };

        let bodyObject = {
            "language": mapToObj(language),
            "type": mapToObj(type),
            "keyword": keyword,
            "isActor": isActor
        };

        const request ={
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: {'Content-type':'text/plain'},
            body: JSON.stringify(bodyObject)
        };

        console.log(request.body);


        fetch('http://localhost:8000/search_movie', request)
                    .then(data => {
                        console.log('parsed json', data);
                        return data.json()})
                    .then(data => {
                        console.log(data.rec);
                        if (!data.rec) {
                            console.log('no results');
                            setBanners(['No results!']);
                        } else {
                            setBanners(data.rec);
                        }
                        console.log('parsed json', data.rec);            
                    }, (ex) => {
                        console.log('parsing failed', ex)
                    })

    };

    return (
        <div>
            <div>
                Search Movie
            </div>
            <input type="text" value={keyword} onChange={handleChangeKeyword}/>
            <button type='button' onClick={handleSearch}>
                Submit
            </button>
            <div>
                
                <Checkbox
                    label="Search by Actor"
                    value={isActor}
                    onChange={handleChangeIsMovie}
                /> 
            </div>

            {/* Language Checkboxes*/}
            <div>
                Language: 
                <Checkbox
                    label="Japanese"
                    value={language["Japanese"]}
                    onChange={() => handleChangeLanguage("Japanese")}
                /> 
                <Checkbox
                    label="English"
                    value={language["English"]}
                    onChange={() => handleChangeLanguage("English")}
                />
                <Checkbox
                    label="Chinese"
                    value={language["Chinese"]}
                    onChange={() => handleChangeLanguage("Chinese")}
                /> 
                <Checkbox
                    label="Korean"
                    value={language["Korean"]}
                    onChange={() => handleChangeLanguage("Korean")}
                /> 
                <Checkbox
                    label="Spanish"
                    value={language["Spanish"]}
                    onChange={() => handleChangeLanguage("Spanish")}
                /> 
                <Checkbox
                    label="French"
                    value={language["French"]}
                    onChange={() => handleChangeLanguage("French")}
                />
            </div>

            {/* Genre Checkboxes */}
            <div>
                Genre: 
                <Checkbox
                        label="Documentary"
                        value={type["Documentary"]}
                        onChange={() => handleChangeType("Documentary")}
                    /> 
                <Checkbox
                        label="Comedy"
                        value={type["Comedy"]}
                        onChange={() => handleChangeType("Comedy")}
                    /> 
                <Checkbox
                        label="Drama"
                        value={type["Drama"]}
                        onChange={() => handleChangeType("Drama")}
                    /> 
                <Checkbox
                        label="Horror"
                        value={type["Horror"]}
                        onChange={() => handleChangeType("Horror")}
                    /> 
                <Checkbox
                        label="Thriller"
                        value={type["Thriller"]}
                        onChange={() => handleChangeType("Thriller")}
                    /> 
                <Checkbox
                        label="Action"
                        value={type["Action"]}
                        onChange={() => handleChangeType("Action")}
                    /> 
            </div>

            {/* Search Results */}
            <ProductTable banners={banners}/>

        </div>
    );
};


const Checkbox = ({ label, value, onChange }) => {
    return (
      <label>
        <input type="checkbox" checked={value} onChange={onChange} />
        {label}
      </label>
    );
  };


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