const API_KEY = "e58882a87348158ff2690ef72d0a595e";


const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const formContainer = document.querySelector("[data-searchForm]");
const searchInput = document.querySelector("[data-searchInput]");
const loadingContainer = document.querySelector(".loading-container");
const userInfo = document.querySelector(".user-info-container");
const grantAccessBtn = document.querySelector(".btn");
const notFound = document.querySelector(".not-found");




let currentTab = userTab;
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab)
{
    if(clickedTab != currentTab)
    {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!formContainer.classList.contains("active"))
        {
            notFound.classList.remove("active");
            userInfo.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            formContainer.classList.add("active");
        }
        else{
            notFound.classList.remove("active");
            formContainer.classList.remove("active");
            userInfo.classList.remove("active");
            getFromSessionStorage();
        }
    }
}
userTab.addEventListener("click", () => {
    switchTab(userTab);
});
searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getFromSessionStorage()
{
    const localCords = sessionStorage.getItem("user-coordinates");
    if(!localCords)
    {
        grantAccessContainer.classList.add("active");
        notFound.classList.remove("active");
    }
    else{
        const coordinates = JSON.parse(localCords);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates)
{
    const {latitude, longitude} = coordinates;
    grantAccessContainer.classList.remove("active");
    notFound.classList.remove("active");
    loadingContainer.classList.add("active");

    //API call
    try{
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
        const data = await res.json();
        loadingContainer.classList.remove("active");
        notFound.classList.remove("active");
        userInfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err)
    {
        loadingContainer.classList.remove("active");
    }

}

function renderWeatherInfo(weatherInfo)
{
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-clouds]");

    if(weatherInfo?.cod === 200)
    {
        cityName.innerHTML = weatherInfo?.name;
        countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
        weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
        weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
        temp.innerText = weatherInfo?.main?.temp + '°C';
        windSpeed.innerText = weatherInfo?.wind?.speed + 'm/s';
        humidity.innerText = weatherInfo?.main?.humidity + '%';
        clouds.innerText = weatherInfo?.clouds?.all + '%';
    }

    else{
        userInfo.classList.remove("active");
        notFound.classList.add("active");
    }

   


}

grantAccessBtn.addEventListener("click", getLocation);

function getLocation()
{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Geolocation not supported!");
    }
}

function showPosition(position)
{
    const userCordinates = {
        latitude : position.coords.latitude,
        longitude: position.coords.longitude

    };
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCordinates));
    fetchUserWeatherInfo(userCordinates);
}


async function fetchSearchWeatherInfo(city){
   loadingContainer.classList.add("active");
   userInfo.classList.remove("active");
   notFound.classList.remove("active");
   grantAccessContainer.classList.remove("active");

   try{
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
    const data = await result.json();

    loadingContainer.classList.remove("active");
    notFound.classList.remove("active");
    userInfo.classList.add("active");
    renderWeatherInfo(data);
   }
   catch(err)
   {
   alert("error occured:", err);
   
   }


}

formContainer.addEventListener("submit", (e) => {
    e.preventDefault();
    let city = searchInput.value;
    if(city === ""){
        return;
    }
    
        fetchSearchWeatherInfo(city);
    
})



