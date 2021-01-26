// Declaration of variables
let cities = localStorage.getItem("cities");
if (!cities) {
    cities = [];
}
else
{
    cities = cities.split(",")
};
$("#searchBtn").on("click", function() {
    event.preventDefault();
    event.stopPropagation();
    let city = $("#search-input").val().trim();
    if (city != '') {
        $("#search-input").html("")
        searchCity(city);
        forecast(city);
        addHistory(city);
        renderHistory()
    }
    else {
        $("#search-input").html("Field cannot be empty");
    }
});
function addHistory(city){ 
    cities.push(city);
    localStorage.setItem("cities", cities); 
};
function renderHistory(){
    $("#history").empty();
    for (i = 0; i < cities.length; i++) {
        $("#history").append($("<button class='btn btn-info d-flex flex-column'>").attr("cityName", cities[i]).text(cities[i]));
    }
    $("#history button").on("click",function(){
        event.preventDefault();
        let searchedCity = $(this).attr("cityName");
        searchCity(searchedCity);
        forecast(searchedCity);
    });
};
function searchCity(city){
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=3d16044a2eba4d271046d70fd1f2c155";
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response){
    $("#cityName").attr("class", "nowrap").text(city);
    let tempT = $("#temperature").attr("class", "nowrap");
    $("#humidity").attr("class", "nowrap").text("Humidity: "+ response.main.humidity + "%.");
    $("#windSpeed").attr("class", "nowrap").text("WindSpeed: " + response.wind.speed + " m/s,");
    let today = new Date();
    let date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    $("#currentDate").text(dateTime);
    let cTemp = fToC(response.main.temp);
    tempT.text("Temperature: "+ cTemp);
    let cityLat = response.coord.lat;
    let cityLon = response.coord.lon;
    let uvURL = "https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/uvi?appid=" + "3d16044a2eba4d271046d70fd1f2c155" + "&lat=" + cityLat + "&lon=" + cityLon + "&units=imperial";
    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function (response) {
        let uv = response.value;
        $("#uvIndex").empty(); 
        $("#uvIndex").append($("<div id=\"uvColor\">").text("Uv Index: " + uv)).attr("class", "nowrap");
        if(uv <= 3){
            $("#uvColor").attr("style", "background-color:green ; width:65%");
        }
        else if( uv <= 7){
            $("#uvColor").attr("style", "background-color:orange ; width:65%");
        }
        else{
            $("#uvColor").attr("style", "background-color:red ; width:65%");
        };
        
    })
})
};
function fToC(fahrenheit) {
    const fTemp = Math.round(fahrenheit);
    const fToCel = Math.round((fTemp - 32) * 5 / 9);
    const temp = `${fTemp}\xB0F : ${fToCel}\xB0C.`;
    return temp;   
};
function forecast(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=3d16044a2eba4d271046d70fd1f2c155";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(forecastResponse){
        let filteredDays = forecastResponse.list.filter(
            function (currentElement){
            return currentElement.dt_txt.includes("12:00:00")
            }	
        );
        $("#images").empty();
        for(let i = 0; i < filteredDays.length; i++ ){
            let date = filteredDays[i].dt_txt.split(" ")[0];
            let icon = filteredDays[i].weather[0].icon;
            let humidity = filteredDays[i].main.humidity;
            let square = $("<div>").attr("class","square");
            let section = $("<section>").attr("class","content").attr("class", "col-sm-3");
            let list = $("<ul>");
            let listElDates = $("<li>").attr("class","dates").attr("class", "nowrap").text(date);
            let listIcon = $("<ul>").append($("<img>").addClass("weatherImg").attr("src", "https://openweathermap.org/img/wn/" + icon + "@2x.png"));
            let cTemp = fToC(filteredDays[i].main.temp);
            let tempT = cTemp;
            let listElTempF = $("<li>").attr("class", "tempForecast").attr("class", "nowrap").text("Temp: " + tempT);
            let listElHumidityF = $("<li>").attr("class", "hunidityForecast").attr("class", "nowrap").text("Humidity: " + humidity);
            function fToC(fahrenheit) {
                const fTemp = Math.round(fahrenheit);
                const fToCel = Math.round((fTemp - 32) * 5 / 9);
                const temp = `${fTemp}\xB0F : ${fToCel}\xB0C.`;
                return temp;    
            }
            square.append(section.append(list.append(listElDates,listIcon,listElTempF,listElHumidityF)))
             $("#images").append(square)//listElicons
        }    
    })
};
searchCity(localStorage.getItem("cities").split(",")[localStorage.getItem("cities").split(",").length-1]);
renderHistory();
forecast(localStorage.getItem("cities").split(",")[localStorage.getItem("cities").split(",").length-1]);


