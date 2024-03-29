// https://api.darksky.net/forecast/[key]/[latitude],[longitude]
// api.zippopotam.us/country/state/city
let zipBaseURL = 'https://api.zippopotam.us/'
let weatherBaseURL = 'https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/'
let zipURL;
let weatherURL;

let key = 'f0153628555f8b2acc20f0941fa5d3ec';

let latitude;
let longitude;
let stateValue;

const countrySelect = document.getElementById('countrySelect');
const stateSelect = document.querySelectorAll('#stateOption');
const cityInput = document.getElementById('city')
const searchForm = document.querySelector('form');
const currentTempDiv = document.querySelector('.currentTemp');
const weeklySumText = document.querySelector('.weeklySumText');
const weeklySumText2 = document.querySelector('.weeklySumText2');
const weeklySumIcons = document.querySelector('.weeklySumIcons');
const weeklySumIcons2 = document.querySelector('.weeklySumIcons2');
const iconHolder = document.getElementById('iconHolder');
const weekForecastText = document.getElementById('eight');
weekForecastText.style.display = 'none';

stateSelect.forEach(dropdown => {
    dropdown.addEventListener('click', function () {
        stateValue = dropdown.value;
        console.log(stateValue);
    })
})

let icons = new Skycons({
    "color": "white"
});


searchForm.addEventListener('submit', fetchPlace);

function fetchPlace(e) {
    e.preventDefault();
    zipURL = `${zipBaseURL}${countrySelect.text}/${stateValue}/${cityInput.value}`
    console.log(zipURL);
    fetch(zipURL)
        .then(response => response.json())
        .then(json => latitudeLongitude(json))
        .catch(error => console.log(error));
}

let latitudeLongitude = (json) => {
    console.log(json);
    latitude = json.places[0].latitude;
    longitude = json.places[0].longitude;
    console.log(latitude, longitude);

    getWeather();
}

let getWeather = () => {
    weatherURL = `${weatherBaseURL}${key}/${latitude},${longitude}`;
    console.log(weatherURL);
    fetch(weatherURL)
        .then(response => response.json())
        .then(json => displayWeather(json))
        .catch(error => console.log(error));
}

let displayWeather = (json) => {
    console.log(json)

    while(currentTempDiv.firstChild) {
        currentTempDiv.removeChild(currentTempDiv.firstChild);
    }

    while(weeklySumText.firstChild) {
        weeklySumText.removeChild(weeklySumText.firstChild);
    }

    while(weeklySumText2.firstChild) {
        weeklySumText2.removeChild(weeklySumText2.firstChild);
    }

    // CURRENT
    // set icons
    let skycon = json.currently.icon;

    let canvasEl = document.createElement('canvas');

    canvasEl.setAttribute('id', skycon);
    canvasEl.setAttribute('height', 100);
    canvasEl.setAttribute('width', 100);

    icons.add(canvasEl, skycon);

    // set temperature
    let currentTemp = json.currently.temperature;
    let CTcontainer = document.createElement('div');
    CTcontainer.setAttribute('class', 'currentDisplay');

    CTcontainer.textContent = `Current weather in ${cityInput.value}, ${stateValue.toUpperCase()}: `;

    let currentTempDisplay = document.createElement('h4');
    currentTempDisplay.innerHTML = `${currentTemp} degrees`;

    if (currentTemp >= 90) {
        currentTempDisplay.style.color = 'red'
    } else if (currentTemp >=  70) {
        currentTempDisplay.style.color = 'orange'
    } else if (currentTemp >= 50) {
        currentTempDisplay.style.color = 'green'
    } else if (currentTemp >= 32) {
        currentTempDisplay.style.color = 'rgb(77, 154, 255)'
    } else if (currentTemp >= 0) {
        currentTempDisplay.style.color = 'rgb(138, 189, 255)'
    }

    // set description
    let summary = document.createElement('p');
    summary.textContent = json.currently.summary

    iconHolder.appendChild(canvasEl);
    CTcontainer.appendChild(currentTempDisplay)
    currentTempDiv.appendChild(CTcontainer);
    currentTempDiv.appendChild(summary);

    // WEEKLY
    let weekly = json.daily.data;

    weekForecastText.style.display = 'block';

    weekly.forEach((day, i) => {
        let skycon = day.icon;
        // console.log(skycon);

        let date = document.createElement('h4');
        let summary = document.createElement('p');
        let canvasEl = document.createElement('canvas');
        let temp = document.createElement('p');

        let tempLow = day.temperatureLow;
        let tempHigh = day.temperatureHigh;

        let timestamp = day.time;
        let pullDate = new Date(timestamp*1000);
        let dateString = pullDate.toString();
        let sliced = dateString.slice(0, 10);

        date.textContent = sliced;
        summary.textContent = day.summary;
        temp.textContent = `High: ${tempHigh} - Low: ${tempLow}`

        canvasEl.setAttribute('id', skycon);
        canvasEl.setAttribute('height', 100);
        canvasEl.setAttribute('width', 100);

        icons.add(canvasEl, skycon);

        if (i <= 3){
            weeklySumText.appendChild(date);
            weeklySumIcons.appendChild(canvasEl);
            weeklySumText.appendChild(summary);
            weeklySumText.appendChild(temp);

        } else {
            weeklySumText2.appendChild(date);
            weeklySumIcons2.appendChild(canvasEl);
            weeklySumText2.appendChild(summary);
            weeklySumText2.appendChild(temp);
        }

        // let date = Date()
        // date.toString();
        // console.log(date)
        icons.play();
    })

}