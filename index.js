// Fetch API to retrive data
const getCountryData = async() => {
    const url= "https://restcountries.com/v3.1/all";
    const options = {
        method: 'GET',
        headers: {
            "Content-Type":'application/json'},
    };

    try{
        const response = await fetch(url, options);
        const data = await response.json();
        const countryData = data.map((element)=>{
            return {
                src : element.flags.png,
                name : element.name.common,
                continent: element.continents[0],
                currency : Object.keys(element.currencies||{unknwn:{}}),
                language : Object.values(element.languages||{unknwn:{}}),
                population : element.population || "unknown"
            };

        });
        return countryData;
    } catch (err) {console.log(err);}

    

}


const renderCard = (country)=>{
    const cardElement = document.createElement('article');
    const parentNode = document.querySelector('.countries');
    cardElement.classList.add('country');
    cardElement.innerHTML = `
        <img class="country__img" src="${country.src}" />
        <div class="country__data">
            <h3 class="country__name name">${country.name}</h3>
            <h4 class="country__region region">${country.continent}</h4>
            <p class="country__row population"><span>👫</span>${country.population}</p>
            <p class="country__row language"><span>🗣️</span>${country.language}</p>
            <p class="country__row currency"><span>💰</span>${country.currency}</p>
        </div>
    `
    return cardElement;
    
}

const renderCards = (countries) =>{
    const parentNode = document.querySelector('.countries' );
    parentNode.innerHTML = "";
    countries.forEach((country)=>parentNode.appendChild(renderCard(country)));

}

const handleClicks = (countries, continent) =>{
    countries = countries.filter(country=>{
        if(continent === "All"){
            return true;
        }
        return country.continent === continent;
    });

    return countries;
}

const filterCountriesByClicks = async()=>{

    const options = document.querySelectorAll('option');
    let countries = await getCountryData();
    options.forEach((option)=>{
        option.addEventListener('click', ()=>{
            let continent = option.innerText;
            let filteredcountries = handleClicks(countries, continent);
            renderCards(filteredcountries);
          
        });
    });   
}

const handleSearch = (countries, searchValue) =>{
    countries = countries.filter(country =>{
        if(!searchValue){
            return true;
        } else{
        return country.name.toLowerCase().includes(searchValue.toLowerCase());}
    });
    renderCards(countries);
}
const filterCountriesBySearch = async()=>{
    let countries = await getCountryData();
    const searchInput = document.querySelector("input");
    
    searchInput.addEventListener('change', ()=>{
        let searchValue = searchInput.value;
        handleSearch(countries, searchValue);
    });
    
}



(async() => {
    
const countries = await getCountryData();




filterCountriesByClicks();
filterCountriesBySearch();


})();



