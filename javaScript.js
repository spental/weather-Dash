let cities = localStorage.getItem("")
if (!cities) {
    cities = [];
}
else {
    cities = cities.split(",")
};

// Save the cities searched for
function addHistory(city){ 
    // Check for changes in the local item and log them
    cities.push(city);
    localStorage.setItem("cities", cities); 
};
// show the history of the search and be able to return to that search on the main div
$("#search").on("click", function() {
    event.preventDefault();
    event.stopPropagation();
    let city = $("#search-input").val().trim();
    if (city != '') {
        // The following clears the error if errored!
        $("#city-input").html("")
        
        //console.log(localStorage.getItem("city"));
        searchCity(city);
        forecast(city);
        addHistory(city);
        renderHistory()
    }
    else {
        $("#city-input").html("Field cannot be empty");
    }
});