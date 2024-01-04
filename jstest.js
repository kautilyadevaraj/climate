document.addEventListener("DOMContentLoaded", function () {
    var inputElement = document.getElementById("loc");
    var magnifyingGlassBtn = document.getElementById("input-btn");
    var temperatureElement = document.getElementById("temperature");
    var timeElement = document.getElementById("time");
    var weatherDescriptionElement = document.getElementById("weather");
    var humidityElement = document.getElementById("humidity");
    var windElement = document.getElementById("wind");
    var pressureElement=document.getElementById("pressure");
    var visibilityElement=document.getElementById("visibility");
    var coordElement = document.getElementById("lonvalue");
    var countryElement = document.getElementById("country");

    //  default location
    fetchWeatherData("Bengaluru");

    magnifyingGlassBtn.addEventListener("click", function () {
        var LOC = inputElement.value;
        console.log("Location entered: " + LOC);

        fetchWeatherData(LOC);
    });

    //suggested cities
    var suggestedCitiesElement = document.getElementById("suggested-cities");
    var suggestedCitiesList = suggestedCitiesElement.querySelector("ul");

    suggestedCitiesList.addEventListener("click", function (event) {
        if (event.target.tagName === "LI") {
            var selectedCity = event.target.dataset.city;
            console.log("Suggested city selected: " + selectedCity);
            inputElement.value = selectedCity;
            // Fetch weather data for the selected city
            fetchWeatherData(selectedCity);
        }
    });
    // Function to add suggested cities dynamically
 function addSuggestedCity(cityName) {
    var li = document.createElement("li");
    li.dataset.city = cityName;
    li.textContent = cityName;
    suggestedCitiesList.appendChild(li);
}

// Add more suggested cities as needed
addSuggestedCity("Paris");
addSuggestedCity("Sydney");
addSuggestedCity("Mumbai");
addSuggestedCity("London");
addSuggestedCity("New York");
addSuggestedCity("Tokyo");
addSuggestedCity("Dubai");


    var googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY'; 
    function fetchWeatherData(location) {
        var apiKey = '57359984bfcf2e9200834de6922951f3';
        var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.coord && data.coord.lat !== undefined && data.coord.lon !== undefined) {
                    var latitude = data.coord.lat;
                    var longitude = data.coord.lon;

                    

                    

                            fetch(`https://restcountries.com/v2/alpha/${data.sys.country}`)
                                .then(response => response.json())
                                .then(countryData => {
                                    if (countryData.name!== undefined && countryData.name!=="United Kingdom of Great Britain and Northern Ireland")
                                         {
                                        countryElement.innerHTML = `<h3 id="country">${countryData.name}</h3>`;
                                    }
                                    else if (countryData.name==="United Kingdom of Great Britain and Northern Ireland"){
                                        
                                        countryElement.innerHTML = `<h3 id="country">United Kingdom</h3>`;
                                    }
                                    
                                    else {
                                        console.error("Country name not available in the API response");
                                    }
                                })
                                .catch(error => {
                                    console.error("Error fetching country data:", error);
                                });
                            
                            
                            if (data.name !== undefined) {
                                document.getElementById("place").innerHTML = `<h1>${data.name}</h1>`;
                            } else {
                                console.error("Location not available in the API response");
                            }

                            if (data.main && data.main.temp !== undefined) {
                                var temperatureFeels = data.main.feels_like;
                                var temperatureCelsius = temperatureFeels - 273.15;
                                var temperatureMin = data.main.temp_min;
                                var temperatureMinCelsius = temperatureMin - 273.15;
                                var temperatureMax = data.main.temp_max;
                                var temperatureMaxCelsius = temperatureMax - 273.15;

                                
                            
                                temperatureElement.innerHTML = `<h1>Feels like</h1><h2><i class="fa-solid fa-temperature-half"></i>${temperatureCelsius.toFixed(2)} °C</h2>
                                                                <h3 class="min">Min</h3><h3 class="max">Max</h3><br><h4 class="mintemp">${temperatureMinCelsius.toFixed(2)}°C</h4>
                                                                <h4 class="maxtemp">${temperatureMaxCelsius.toFixed(2)}°C</h4>`;
                                    
                            } else {
                                console.error("Temperature not available in the API response");
                            }

                            if(data.main.pressure!==undefined){
                                var pressure = data.main.pressure;
                                pressureElement.innerHTML=`<h1>Pressure <i class="fa-solid fa-droplet"></i></h1><h2>${pressure} Pa</h2>`;

                            }

                            if (data.coord.lon !== undefined){
                                var longitude = data.coord.lon;
                                var latitude = data.coord.lat;
                                coordElement.innerHTML=`<h4 class="latitude">${latitude.toFixed(2)}</h4><h4 class="longitude">${longitude.toFixed(2)}</h4>`;
                            }

                            if (data.main && data.main.humidity !== undefined ) {
                                var humidity = data.main.humidity;
                                
                               humidityElement.innerHTML=`<h1>Humidity <i class="fa-solid fa-umbrella"></i></h1><h2>${humidity} %</h2>`;
                            
                            } else {
                                console.error("Humidity not available in the API response");
                            }

                            if (data.wind && data.wind.speed !== undefined) {
                                var windSpeed = data.wind.speed;
                                var windDegree=data.wind.deg; 
                                windElement.innerHTML=`<h1>Wind <i class="fa-solid fa-wind"></i></h1><h3>${windSpeed} km/h</h3><h2>Degree</h2><h3>${windDegree}°</h3>`;
                            } else {
                                console.error("Wind Speed not available in the API response");
                            }

                            if(data.visibility !== undefined){
                                var visibility=data.visibility;
                                visibilityElement.innerHTML=`<h1>Visibility <i class="fa-regular fa-eye-slash"></i></h1><h2>${visibility} m</h2>`;

                            }
                            

                            

                            if (data.weather && data.weather[0] && data.weather[0].main !== undefined) {
                                var description = data.weather[0].main;
                                setWeatherImage(description);
                                weatherDescriptionElement.innerHTML=`<h1>${description}</h1>`;
                            } else {
                                console.error("Description not available in the API response");
                            }
                            
                       
                } else {
                    console.error("Latitude and longitude not available in the API response");
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
            });
    }

    function updateTime() {
        var currentDate = new Date();
        var hours = currentDate.getHours();
        var flag = false;
        if(hours>12){
            hours-=12;
            flag = true;
        }
        var minutes = currentDate.getMinutes();
        var seconds = currentDate.getSeconds();

        if (flag){
            var formattedTime = padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds) + " PM";
        }
        else{
            var formattedTime = padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds) + " AM";
        }
        
        timeElement.innerHTML = `<h2 id="time">${formattedTime}</h2>`;
    }

    function padZero(number) {
        return number < 10 ? "0" + number : number;
    }

    function setWeatherImage(description) {
        var image = document.getElementById("img");
        
        switch (description) { // Fix variable name
            case 'Clear':
                image.src = "clear.png";
                break;
            case 'Rain':
                image.src = 'rain.png';
                break;
            case 'Fog':
                image.src = 'fog.png';
                break;
            case 'Smoke':
                image.src = "smoke.png";
                break;
            case 'Thunderstorm':
                image.src = "storm.png";
                break;
            case 'Snow':
                image.src = 'snow.png';
                break;
            case 'Clouds':
                image.src = 'C:clouds.png';
                break;
            case 'Mist':
                image.src = 'mist.png'; // Double backslashes in the path
                break;
            case 'Drizzle':
                image.src = 'C:\\Users\\kauti\\OneDrive\\Desktop\\directory\\images\\drizzle.png';
                break;
            case 'Haze':
                    image.src = 'haze.png'
                    break;
            default:
                image.src = 'mist.png';
        }

       
        
    }

    setInterval(updateTime, 1000);
    updateTime();
});