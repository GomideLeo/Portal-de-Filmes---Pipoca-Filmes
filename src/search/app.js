const params = new URL(window.location).searchParams;
const imageUrl = "https://image.tmdb.org/t/p/w500";
const movieUrl = "https://www.themoviedb.org/movie/";
var movieCategories = [];

function getSearchParam(field) {
    return params.get(field);
}

function formatDate(date) {
    return (
        date.substr(8, 2) + "/" + date.substr(5, 2) + "/" + date.substr(0, 4)
    );
}

function getMovieImg(movie) {
    if (movie.backdrop_path) {
        return imageUrl + movie.backdrop_path;
    } else if (movie.poster_path) {
        return imageUrl + movie.poster_path;
    } else {
        return "../imagens/not-found-image.jpg";
    }
}

function completeMovieinfo(movie, movieBox) {
    let rating = Math.round(movie.vote_average / 2);
    movieBox.id = movie.id;

    movieBox.getElementsByClassName("image-item")[0].src = getMovieImg(movie);
    movieBox.getElementsByClassName("titulo")[0].innerHTML = movie.title;
    movieBox.getElementsByClassName(
        "language"
    )[0].innerHTML = movie.original_language.toUpperCase();
    movieBox.getElementsByClassName("movie-link")[0].href = movieUrl + movie.id;
    movieBox.getElementsByClassName("movie-link")[1].href = movieUrl + movie.id;
    movieBox.getElementsByClassName("date")[0].innerHTML = formatDate(
        movie.release_date
    );

    let catArea = movieBox.getElementsByClassName("order-tags")[0];
    catArea.innerHTML = "";

    movie.genre_ids.forEach((genre) => {
        catArea.innerHTML += `<div class="tag id-${genre}">${
            movieCategories.find((cat) => cat.id == genre).name
        }</div>`;
    });

    movieBox.getElementsByClassName("stars")[0].innerHTML = "";

    for (let i = 0; i < rating; i++) {
        movieBox.getElementsByClassName(
            "stars"
        )[0].innerHTML += `<i class="fa fa-star" aria-hidden="true"></i>`;
    }

    for (let i = 0; i < 5 - rating; i++) {
        movieBox.getElementsByClassName(
            "stars"
        )[0].innerHTML += `<i class="fa fa-star-o" aria-hidden="true"></i>`;
    }
}

function fillFilterMovies(data) {
    let movies = data.results;

    let resultArea = document.getElementById("results");
    let resultItem = resultArea.getElementsByClassName("result-item")[0];
    resultArea.innerHTML = "";
    if (movies.length > 0) {
    movies.forEach((movie, index) => {
        let thisItem;
        
        if (index == 0) {
            thisItem = resultItem;
        } else {
            thisItem = resultItem.cloneNode(true);
        }
        
        resultArea.appendChild(thisItem);
        completeMovieinfo(movie, thisItem);
    });
    } else {
        resultArea.innerHTML = `<div class="col-12 not-found-div">
                <h5 style="color: #E35F21"><img class="not-found" src="../imagens/data-not-found.png" alt="resultado-nao-encontrado">
                Não conseguimos encontrar resultados para a sua busca :(</h5>
            </div>`;
    }
}

$(document).ready(function () {
    getMovieCategories((data) =>
        data.genres.forEach((category) =>
            movieCategories.push({ id: category.id, name: category.name })
        )
    );
    searchMovies(getSearchParam("query"), fillFilterMovies);
});