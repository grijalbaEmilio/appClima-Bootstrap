import '../../node_modules/bootstrap/dist/js/bootstrap.js'
import '../../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
import Helpers from './helpers.js'
import Toast from './toast.js'

const apiKey = '3a3b867b79864abb7c890a629be37fc3'
let worldCities
const url = 'https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json'
const weather_info = document.querySelector('#weather-info')
let myMap


document.addEventListener('DOMContentLoaded', async () => {

    Toast.instance = new bootstrap.Toast(
        document.querySelector('#message'), { delay: 3000 }
    )

    try {
        crearMApa(5.0689, -75.5174)

        worldCities = await Helpers.fetchData(url)

        //se obtiene un array con estructura mapa sin repeticiones
        const countries = [...new Map(
            worldCities.map(i => (
                [i.country, { 'country': i.country }]
            ))
        ).values()]

        //pobla el select
        const selectCountries = Helpers.populateSelectList('#countries', countries, 'country', 'country', 'elija un país')

        selectCountries[47].selected = true

        selectCountries.addEventListener('change', refreshCities)

        selectCountries.dispatchEvent(new Event('change')) // fuerza un evento 'change' al inicio de la carga
    } catch (error) {
        renderError('Sin accesos a países', 'danger', error)
    }

})

const renderError = (m, n, e) => {
    Toast.info({
        message: m,
        mode: n,
        error: e
    })
}

const refreshCities = e => {

    //console.log(`País = ${e.target.value}`)

    weather_info.innerHTML = `<h1">Información del clima</h1>`

    const cities = worldCities.filter(i => i.country == e.target.value)
    //ordenar cities
    cities.sort()
    const selectCities = Helpers.populateSelectList('#cities', cities, 'geonameid', 'name', 'seleccione una localidad')
    //console.log(cities)

    selectCities.addEventListener('change', loadWeatherInfo)
}

const loadWeatherInfo = async () => {

    const country = document.querySelector('#countries').value
    const city = Helpers.selectedItemList('#cities').text
    //console.log(country, city)
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}`

    try {
        const weather = await Helpers.fetchData(url)
        //console.log(weather.coord.lon) // información metereológica

        // agrega un marcador al mapa creado con las coordenadas de la localidad y lo enfoca
        agregar_marcador(weather.coord.lat, weather.coord.lon)

        renderWeather(weather)

    } catch (error) {
        renderError(`Datos de ${city} no encontrados`, 'warning','')
    }
}

const renderWeather = weatherData => {

    const { name, sys, main, weather } = weatherData // ← desestructuración
    const image = `http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`

    const html = `
        <h2 class="fst-italic text-info">
            ${name}, ${sys.country}
        </h2>

        <div >
            <div class="">
                <img src="${image}">
            </div>
            <h3 class="text-info">
                ${weather[0].main}
            </h3>
        </div>

        <div class="d-flex flex-column">
            <div class="">
              <p class="fst-italic fs-3">Temp</p>
              <p class="fst-italic fs-1 fw-bold">
                ${kelvinToCelsius(main.temp)} C°
              </p>
            </div>
            <div class="d-flex justify-content-center">
            <div class="mx-3">
              <p class="">Min</p>
              <p class="fw-bold progress text-primary bg-white rounded-circle p-1 d-flex align-items-center" style="height: 35px;">
                  ${kelvinToCelsius(main.temp_min)}
              </p>
            </div>
            <div class="mx-3">
              <p class="">Max</p>
              <p class="fw-bold progress text-primary bg-white rounded-circle p-1 d-flex align-items-center" style="height: 35px; ">
                 ${kelvinToCelsius(main.temp_max)}
              </p>
            </div>
            </div>
        </div>
    `
    document.querySelector('#weather-info').innerHTML = html
    document.querySelector('#titulo').innerHTML = `Ubucación geográfica de ${name}`
}

const kelvinToCelsius = kelvin => (kelvin - 273.15).toFixed(2)

function agregar_marcador(latitud, longitud) {
    myMap.setView([latitud, longitud], 10)
    L.marker([latitud, longitud]).addTo(myMap) // agregamos un marcador (latitud, longitud)
}

function crearMApa(latitud, longitud) {
    myMap = L.map('myMap').setView([latitud, longitud], 8)

    L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
        maxZoom: 18,
    }).addTo(myMap)

    L.marker([latitud, longitud]).addTo(myMap)
}