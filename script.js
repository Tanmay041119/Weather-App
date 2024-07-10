const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector('.weatherContainer');
const grantContainer=document.querySelector('.grantLocationContainer');
const grantButton=document.querySelector("[data-grantAccess]");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector('.loadingContainer');
const userInfoContainer=document.querySelector('.userInfoContainer');

//initially variables
let currentTab=userTab;
const API_KEY='bc3e3212660447df68d424a82f52b5a4';
userTab.classList.add("property");
getFromStorage();
function switchTab(tab){
    if(tab!=currentTab){
        console.log('Tab changed');
        currentTab.classList.remove("property");
        currentTab=tab;
        currentTab.classList.add("property");
    }
    if(!searchForm.classList.contains("active")){
        console.log('opened Search form');
        grantContainer.classList.remove("active");
        userInfoContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        console.log('Opened user weather');
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getFromStorage(); 
    }
}
userTab.addEventListener('click',()=>{
    switchTab(userTab);
});
searchTab.addEventListener('click',()=>{
switchTab(searchTab);
});
//check if coordinates are already present in session storage
function getFromStorage(){
    const ourCoordinates= sessionStorage.getItem("userCoordinate");
    if(!ourCoordinates){
        grantContainer.classList.add("active");

    }
    else{
        const coordinates =JSON.parse(ourCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
 async function fetchUserWeatherInfo(coordinates){
    const { lat,long }=coordinates;
    //grant container invisible
    grantContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    console.log(lat);
    console.log(long);
    try{
    const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`);
    const data= await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    }
    catch(err){
        alert('No such place');
    }
}
function renderWeatherInfo(weatherInfo){

     const cityName=document.querySelector("[data-cityName]");
     const countryIcon=document.querySelector("[data-countryIcon]");
     const weatherDesc=document.querySelector("[data-weatherDesc]");
     const weatherIcon=document.querySelector("[data-weatherIcon]");
     const temperature=document.querySelector("[data-temp]");
     const windSpeed=document.querySelector("[data-windSpeed]");
     const humidity=document.querySelector("[data-humidity]");
     const cloudy=document.querySelector("[data-cloud]"); 
     //fetch values from weather info obj and put on UI
    cityName.innerText = weatherInfo?.name.toUpperCase();
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText=weatherInfo?.weather?.[0]?.description.toUpperCase();
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText=`${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText=`${weatherInfo?.wind?.speed} m/s`
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudy.innerText=`${weatherInfo?.clouds?.all}%`
}
grantButton.addEventListener('click',getLocation);
function getLocation(){
    console.log('hi');
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert('No Geolocation Support Available');
    }
}
function showPosition(position){

    const userCoordinates ={
        lat: position.coords.latitude,
        long: position.coords.longitude,
    }
    sessionStorage.setItem("userCoordinate",JSON.stringify(userCoordinates));
    // ab ui pr show karo
    console.log('hi');
    console.log(userCoordinates);
    fetchUserWeatherInfo(userCoordinates);
}
const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName=="")return ;
    else{
        fetchSearchWeatherInfo(cityName);
    }
});
 async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantContainer.classList.remove("active");
    try{
        const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data= await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
    }
    catch{
        alert('No such place present');
    }
}
