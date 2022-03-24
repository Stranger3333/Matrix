import React, {useState} from 'react';

import Select from 'react-select';

export default () => {
    const [language, setLanguage] = useState([]);
    const [type, setType] = useState([]);
    const [minRuntime, setMinRuntime] = useState(0);
    const [maxRuntime, setMaxRuntime] = useState(999);
    const [keyword, setKeyword] = useState("");
    const [isMovie, setIsMovie] = useState(1);



    return (
        <div>

        <Select
        defaultValue={[{ value: 'orange', label: 'Orange', color: '#FF8B00' }]}
        isMulti
        name="colors"
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={handleInputChange}
        />
        {JSON.stringify(selections)}
        </div>
    );
};
