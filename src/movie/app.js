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

    $(".languages").text(movie.spoken_languages.map(language => language.name).join(', '));

    movieBox.getElementsByClassName("date")[0].innerHTML = formatDate(
        movie.release_date
    );

    movieBox.getElementsByClassName("budget")[0].innerHTML = movie.budget
        ? movie.budget
        : " - ";
    movieBox.getElementsByClassName("status")[0].innerHTML = movie.status
        ? movie.status
        : " - ";
    movieBox.getElementsByClassName("overview")[0].innerHTML = movie.overview
        ? movie.overview
        : " - ";

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

function fillMovieData(data) {
    let movie = data;

    console.log(movie)

    if (movie && movie.id) {
        $("#titulo").text(movie.title.toUpperCase());
        $("#subtitle").text(movie.tagline);
        $("#tituloLink").attr("href",movie.homepage
            ? movie.homepage
            : movieUrl + movie.id);
        $("#image").attr("src", getMovieImg(movie));

        let catArea = document.getElementsByClassName("order-tags")[0];
        catArea.innerHTML = "";

        movie.genres.forEach(
            (genre) =>
                (catArea.innerHTML += `<div class="tag id-${genre.id}">${genre.name}</div>`)
        );

        let movieInfo = document.getElementById("movieInfo");
    
        completeMovieinfo(movie, movieInfo)
    } else {
        $("#movie").html(`<div class="col-12 not-found-div">
                <h5 style="color: #E35F21"><img class="not-found" src="../imagens/data-not-found.png" alt="resultado-nao-encontrado">
                Filme não encontrado :(</h5>
            </div>`);
    }
}

$(document).ready(function () {
    getMovie(getSearchParam("movie"), fillMovieData);
});