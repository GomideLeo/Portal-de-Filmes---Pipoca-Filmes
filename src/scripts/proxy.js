const apiUrl = "https://api.themoviedb.org/3/";
const apiKey = "5dde3464173950b074e511a8dd64471f";

function htmlGetRequest(url, callback, body = {}, async = true) {
    var request = new XMLHttpRequest();
    
    let getUrl = new URL(apiUrl + url);
    getUrl.searchParams.set("api_key", apiKey);
    Object.entries(body).forEach(([key, value]) =>
        getUrl.searchParams.set(key, value)
    );
    
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            let data = JSON.parse(request.response);
            callback(data);
        }
    };
    
    request.open("GET", getUrl, async);
    request.send();
}

function getSpotlightMovies (callback) {
    let url = "discover/movie";
    let date = new Date();
    date.setMonth(date.getMonth() - 1);

    let body = { 
        "sort_by": "popularity.desc",
        "primary_release_date.gte": date.toISOString().split("T")[0]
    }

    htmlGetRequest(url, callback, body);
}

function getFilterMovies(filter, callback) {
    let url = "discover/movie";

    let body = {
        sort_by: filter,
        "primary_release_date.lte": new Date().toISOString().split("T")[0],
    };

    htmlGetRequest(url, callback, body);
}

function getMoviesByCategories( category, callback ) {
    let url = "discover/movie"
    
    let body = {
        with_genres: category,
        "primary_release_date.lte": new Date().toISOString().split("T")[0]
    };

    htmlGetRequest(url, callback, body);
}

function getMovieCategories(callback) {
    let url = "genre/movie/list";
    
    htmlGetRequest(url, callback, {}, false);
}

function getNowPlaying(callback) {
    let url = "movie/now_playing";

    htmlGetRequest(url, callback);
}

function searchMovies (query, callback, page = 1) {
    let url = "search/movie";
    
    let body = {
        query: query,
        page: page
    }
    
    htmlGetRequest(url, callback, body)
}

function getMovie (movieId, callback) {
    let url = "movie/" + (movieId ? movieId : "");

    htmlGetRequest(url, callback)
}