const imageUrl = "https://image.tmdb.org/t/p/w500";
const movieUrl = "https://www.themoviedb.org/movie/";
var movieCategories = [];
var filterItemsShown = 2;
var categoriesItemsShown = 2;
var nowPlayingItemsShown = 2;

function formatDate(date) {
    return (
        date.substr(8, 2) + "/" + date.substr(5, 2) + "/" + date.substr(0, 4)
    );
}

function getMovieImg (movie) {
    if (movie.backdrop_path) {
        return imageUrl + movie.backdrop_path; 
    } else if (movie.poster_path) {
        return imageUrl + movie.poster_path; 
    } else {
        return "./imagens/not-found-image.jpg"
    }
}

function updateCarrouselItem(movie, item) {
    let rating = Math.round(movie.vote_average / 2);

    item.id = movie.id;
    item.getElementsByClassName("image-item")[0].src = getMovieImg(movie);
    item.getElementsByClassName("movie-link")[0].href = movieUrl + movie.id;
    item.getElementsByClassName("movie-link")[1].href = movieUrl + movie.id;
    item.getElementsByClassName("lancamento-titulo")[0].innerHTML = movie.title;
    item.getElementsByClassName("overview")[0].innerHTML = movie.overview;
    item.getElementsByClassName("date")[0].innerHTML = formatDate(
        movie.release_date
    );
    item.getElementsByClassName("stars")[0].innerHTML = "";

    for (let i = 0; i < rating; i++) {
        item.getElementsByClassName(
            "stars"
        )[0].innerHTML += `<i class="fa fa-star" aria-hidden="true"></i>`;
    }

    for (let i = 0; i < 5 - rating; i++) {
        item.getElementsByClassName(
            "stars"
        )[0].innerHTML += `<i class="fa fa-star-o" aria-hidden="true"></i>`;
    }
}

function fillSpotlightCarrousel(data) {
    let movies = data.results;
    let spotlight = document.getElementById("spotlightCarrousel");
    let carrouselIndicatorArea = document.getElementById("spotlightIndicator");
    let indicator = carrouselIndicatorArea.getElementsByTagName("li")[0];
    let carrouselItem = spotlight.getElementsByClassName("carousel-item")[0];

    movies.splice(5);

    movies.forEach((movie, index) => {
        let thisMovieDiv;
        let thisIndicator;

        if (carrouselItem.id) {
            thisMovieDiv = carrouselItem.cloneNode(true);
            thisMovieDiv.classList.remove("active");
            spotlight.appendChild(thisMovieDiv);
            thisIndicator = indicator.cloneNode(true);
            thisIndicator.classList.remove("active");
            thisIndicator["data-slide-to"] = index;
            carrouselIndicatorArea.appendChild(thisIndicator);
        } else {
            thisMovieDiv = carrouselItem;
        }

        updateCarrouselItem(movie, thisMovieDiv);
    });
}

function fillCategories(data) {
    let categories = data.genres;
    let select = document.getElementById("categorySelect");
    let option = select.getElementsByTagName("option")[0];


    categories.forEach((category) => {
        let thisOption;
        movieCategories.push({ id: category.id, name: category.name });

        thisOption = option.cloneNode(true);
        select.appendChild(thisOption);
        thisOption.value = category.id;
        thisOption.text = category.name;
    });

    select.selectedIndex = 0;
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

    movie.genre_ids.forEach(genre => {
        catArea.innerHTML += `<div class="tag id-${genre}">${movieCategories.find(cat => cat.id == genre).name}</div>`;
    })
    

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

function updatePlayingVisibility() {
    let filterItems = document
        .getElementById("nowPlaying")
        .getElementsByClassName("now-playing-item");

    for (let index = 0; index < filterItems.length; index++) {
        if (index < nowPlayingItemsShown) {
            filterItems[index].classList.remove("hidden");
        } else {
            filterItems[index].classList.add("hidden");
        }
    }

    if (filterItems.length <= nowPlayingItemsShown) {
        $("#nowPlayingButt").addClass("hidden");
    } else {
        $("#nowPlayingButt").removeClass("hidden");
    }
}

function loadNowPlayingItems() {
    nowPlayingItemsShown += 2;

    updatePlayingVisibility();
}

function fillNowPlaying(data) {
    let movies = data.results;
    let filterArea = document.getElementById("nowPlaying");
    let filterItem = filterArea.getElementsByClassName("now-playing-item")[0];
    filterArea.innerHTML = "";
    nowPlayingItemsShown = 2;

    movies.forEach((movie, index) => {
        let thisItem;

        if (index == 0) {
            thisItem = filterItem;
        } else {
            thisItem = filterItem.cloneNode(true);
        }

        filterArea.appendChild(thisItem);
        completeMovieinfo(movie, thisItem);
    });
    updatePlayingVisibility();
}

function updateCatVisibility() {
    let filterItems = document
        .getElementById("categoriesArea")
        .getElementsByClassName("categories-item");

    for (let index = 0; index < filterItems.length; index++) {
        if (index < categoriesItemsShown) {
            filterItems[index].classList.remove("hidden");
        } else {
            filterItems[index].classList.add("hidden");
        }
    }

    if (filterItems.length <= categoriesItemsShown) {
        $("#catButt").addClass("hidden");
    } else {
        $("#catButt").removeClass("hidden");
    }
}

function loadMoreCatItems() {
    categoriesItemsShown += 2;

    updateCatVisibility();
}

function fillCategoriesMovies(data) {
    let movies = data.results;
    let filterArea = document.getElementById("categoriesArea");
    let filterItem = filterArea.getElementsByClassName("categories-item")[0];
    filterArea.innerHTML = "";
    categoriesItemsShown = 2;

    movies.forEach((movie, index) => {
        let thisItem;

        if (index == 0) {
            thisItem = filterItem;
        } else {
            thisItem = filterItem.cloneNode(true);
        }

        filterArea.appendChild(thisItem);
        completeMovieinfo(movie, thisItem);
    });
    updateCatVisibility();
}

function updateOrderVisibility() {
    let filterItems = document
        .getElementById("orderBy")
        .getElementsByClassName("order-item");

    for (let index = 0; index < filterItems.length; index++) {
        if (index < filterItemsShown) {
            filterItems[index].classList.remove("hidden");
        } else {
            filterItems[index].classList.add("hidden");
        }
    }

    if (filterItems.length <= filterItemsShown) {
        $("#orderByButt").addClass("hidden");
    } else {
        $("#orderByButt").removeClass("hidden");
    }
}

function loadMoreOrderItems() {
    filterItemsShown += 2;

    updateOrderVisibility();
}

function fillFilterMovies(data) {
    let movies = data.results;
    let filterArea = document.getElementById("orderBy");
    let filterItem = filterArea.getElementsByClassName("order-item")[0];
    filterArea.innerHTML = "";
    filterItemsShown = 2;

    movies.forEach((movie, index) => {
        let thisItem;

        if (index == 0) {
            thisItem = filterItem;
        } else {
            thisItem = filterItem.cloneNode(true);
        }

        filterArea.appendChild(thisItem);
        completeMovieinfo(movie, thisItem);
    });
    updateOrderVisibility();
}

function getcategory() {
    return $("#categorySelect").val() == 0 ? "" : $("#categorySelect").val();
}

$(document).ready(function () {
    getSpotlightMovies(fillSpotlightCarrousel);
    getMovieCategories(fillCategories);
    getNowPlaying(fillNowPlaying)
    getMoviesByCategories(getcategory(), fillCategoriesMovies);
    getFilterMovies($("#filterSelect").val(), fillFilterMovies);
});
