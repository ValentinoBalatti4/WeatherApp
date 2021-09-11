const btn = $(".search-button");
//solicitar ubicacion al cargar la pagina
window.addEventListener('load', ()=> {
    let lat;
    let long;
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude;
            long = position.coords.longitude;

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&exclude=hourly,minutely&units=metric&appid=${weather.weather_API}`)
            .then((response)=>{
                return response.json();
            })
            .then((data) => weather.displayWeather(data))
        })
    }
})

let weather = {
    weather_API: 'f943a92dc91fa629d3648c1c1b9cc33e',
    //funcion que obtiene informacion de la API
    fetchWeather: function (city) {
        fetch('https://api.openweathermap.org/data/2.5/weather?q='
        + city
        + '&units=metric&&appid='
        + this.weather_API
        )
        .then((response) => {
            if (!response.ok) {
                alert("No weather found.");
                throw new Error("No weather found.");
            }
            return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
    // Pasa la informacion del API al documento HTML
    displayWeather: function(data){
        const { name } =  data;
        const { country } = data.sys;
        const { temp } = data.main;
        const { icon, description} = data.weather[0];
        const {humidity} = data.main;
        const {speed} = data.wind;
        this.displayTime()
        $(".location-timezone").html(country + "/" + name);
        $("#temperature-number").html(temp + "°C");
        $(".icon").attr('src', "https://openweathermap.org/img/wn/" + icon + ".png")
        $(".description").html(description)
        $(".humidity").html("Humidity: " + humidity + "%");
        $(".wind").html("Wind speed: " + speed + "km/h");
    },
    //funcion de busqueda de ciudades
    search: function(){
        this.fetchWeather($("input").val())
        $("input").val("")
    },
    // funcion que obtiene la fecha y hora del usuario
    displayTime: function(){
        let time = new Date();
        var date = time.toLocaleDateString()
        var hour = time.getHours()
        var min = time.getMinutes()

        hour = this.checkTime(hour)
        min = this.checkTime(min)

        $(".time").html(`${date} ${hour}:${min}`)
    },
    //agregar 0 a numeros menores a 10 de la funcion anterior
    checkTime: function(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
};

btn.click(function(){
    weather.search();
})

$("input").on("keyup", function (event) {
    if (event.key == "Enter") {
    weather.search();
    }
});
