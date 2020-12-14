var offset = 0;
var favoritesOffset = 0;
var slideIndex = 1;
var modal = document.getElementById("myModal");
var imgMax = document.getElementById("imgGifMax");
var header = document.getElementsByClassName("header")[0];
var modalCloseButton = document.getElementsByClassName("modal-close")[0];
var modalActions = document.getElementsByClassName("modal-image-actions-div")[0];
var baseUrl = 'https://api.giphy.com/v1/gifs';
var apiKey = 'uXeIYjblhtWKqef33kir3YfDInqBBfD4';
var parameters = '&rating=r&lang=en';

fillSlides();
searchFavorites(0, false);
showSlides(slideIndex);

function fillSlides() {
    var url = baseUrl.concat('/trending?api_key=').concat(apiKey).concat('&limit=9&offset=0').concat(parameters);

    fetch(url)
        .then((resp) => resp.json())
        .then(function (response) {
            var images = document.getElementsByClassName("trendingImg");
            for (i = 0; i < images.length; i++) {
                images[i].src = response.data[i].images.downsized.url;
            }
        })

}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function searchFavorites(offset, seeMore) {
    var savedIds = JSON.parse(localStorage.getItem("favorites-gifs-ids"));
    var favoritesDiv = document.getElementById('favoritesDiv');
    var noFavoritesDiv = document.getElementById('noFavoritesDiv');
    var seeMoreButton = document.getElementById('seeMoreFavoritesButton');

    if (savedIds && savedIds.length > 0) {
        var concatIds = savedIds.join(',');
        var url = baseUrl.concat('?api_key=').concat(apiKey).concat('&ids=').concat(concatIds).concat('&limit=12&offset=').concat(offset).concat(parameters);

        fetch(url)
            .then((resp) => resp.json())
            .then(function (response) {
                fillResults(response, favoritesDiv, noFavoritesDiv, seeMoreButton, seeMore);
            })
    }
    else if (seeMore == false) {
        favoritesDiv.innerHTML = '';
        noFavoritesDiv.style.display = 'inherit';
    }
}

function searchResults(e) {
    if (e.keyCode === 13) {
        search(0, false);
    }
}

function search(offset, seeMore) {
    var searchText = document.getElementById('searchText').value;
    var url = baseUrl.concat('/search?api_key=').concat(apiKey).concat('&q=').concat(searchText).concat('&limit=12&offset=').concat(offset).concat(parameters);
    var resultsDiv = document.getElementById('resultsDiv');
    var noResultsDiv = document.getElementById('noResultsDiv');
    var seeMoreButton = document.getElementById('seeMoreButton');

    document.getElementById('searchResults').innerHTML = searchText;

    fetch(url)
        .then((resp) => resp.json())
        .then(function (response) {
            fillResults(response, resultsDiv, noResultsDiv, seeMoreButton, seeMore);
        })
}

function fillResults(response, resultsDiv, noResultsDiv, seeMoreButton, seeMore) {
    if (response.data.length > 0) {
        noResultsDiv.style.display = 'none';

        if (seeMore == false) {
            resultsDiv.innerHTML = '';
        }

        seeMoreButton.classList.remove('hiddenButton');
        response.data.forEach(element => {
            var url = element.images.downsized.url;
            var title = element.title;
            var div = document.createElement('div');

            div.className = 'div-gifs';
            div.style.backgroundImage = 'url(' + url + ')';
            div.onmouseover = function () {
                createImageButtons(div, url, element.id, title);
                createImageTitle(div, title);

            };
            div.onmouseleave = function () {
                removeImagesButtons(div.getElementsByClassName("img-div")[0]);
                removeImageTitle();
            };
            div.innerHTML = "<div class='img-div'></div>";
            resultsDiv.appendChild(div);
        });
    }
    else {
        resultsDiv.innerHTML = '';
        noResultsDiv.style.display = 'inherit';
    }
}

function seeMore() {
    if (offset == 0) {
        offset = 12;
    } else {
        offset += 12;
    }
    search(offset, true);
}

function seeMoreFavorites() {
    if (favoritesOffset == 0) {
        favoritesOffset = 12;
    } else {
        favoritesOffset += 12;
    }
    searchFavorites(favoritesOffset, true);
}

function createImageButtons(mainDiv, url, gifId, title) {
    var imageDiv = mainDiv.getElementsByClassName("img-div")[0];

    var maxButton = imageDiv.getElementsByClassName("max-button");
    if (maxButton.length < 1) {
        createMaxButton(imageDiv, url, gifId, title);
    }

    var downloadButton = imageDiv.getElementsByClassName("download-button");
    if (downloadButton.length < 1) {
        createDownloadButton(imageDiv, url, title);
    }

    var favoriteButton = imageDiv.getElementsByClassName("fav-button");
    var img3Selected = imageDiv.getElementsByClassName("fav-button-selected");
    if (favoriteButton.length < 1 && img3Selected.length < 1) {
        createFavoriteButton(imageDiv, gifId);
    }
}

function createMaxButton(imageDiv, url, gifId, title) {
    var img = document.createElement('img');
    img.setAttribute('class', 'max-button');
    img.onclick = function () {
        imgMax.src = url;
        modal.style.display = "block";
        header.style.display = "none";
        document.body.style.overflow = "hidden";
        createDownloadButton(modalActions, url, title);
        createFavoriteButton(modalActions,gifId);
    };
    imageDiv.appendChild(img);
}

function createDownloadButton(imageDiv, url, title) {
    var img = document.createElement('img');
    img.setAttribute('class', 'download-button');
    img.onclick = function () {
        (async () => {
            let a = document.createElement('a');
            let response = await fetch(url);
            let file = await response.blob();
            a.download = title;
            a.href = window.URL.createObjectURL(file);
            a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
            a.click();
        })();
    };
    imageDiv.appendChild(img);
}

function createFavoriteButton(imageDiv, gifId) {
    var img = document.createElement('img');
    var savedIds = JSON.parse(localStorage.getItem("favorites-gifs-ids"));
    if (savedIds && savedIds.find(x => x == gifId)) {
        img.setAttribute('class', 'fav-button-selected');
        img.setAttribute('gif-id', gifId);
        img.onclick = function () {
            var currentId = this.getAttribute("gif-id");
            savedIds.splice(savedIds.indexOf(currentId), 1);

            img.setAttribute('class', 'fav-button');
            localStorage.setItem("favorites-gifs-ids", JSON.stringify(savedIds));
            searchFavorites(0, false);
        };
    }
    else {
        img.setAttribute('class', 'fav-button');
        img.setAttribute('gif-id', gifId);
        img.onclick = function () {
            var currentId = this.getAttribute("gif-id");
            if (savedIds != null) {
                savedIds.push(currentId);
            }
            else {
                savedIds = [currentId];
            }

            img.setAttribute('class', 'fav-button-selected');
            localStorage.setItem("favorites-gifs-ids", JSON.stringify(savedIds));
            searchFavorites(0, false);
        };
    }

    imageDiv.appendChild(img);
}

function createImageTitle(div, title) {
    var imageTitle = div.getElementsByClassName("img-gif-title");
    if (imageTitle.length < 1) {
        var titleSpan = document.createElement('span');
        titleSpan.className = 'img-gif-title';
        var titleText = document.createTextNode(title.substring(0, 25));
        titleSpan.appendChild(titleText);
        var imageDiv = div.getElementsByClassName("img-div")[0];
        imageDiv.appendChild(titleSpan);
    }
}

function removeImagesButtons(div) {
    var img1 = div.getElementsByClassName("max-button");
    if (img1.length > 0) {
        div.removeChild(img1[0]);
    }

    var img2 = div.getElementsByClassName("download-button");
    if (img2.length > 0) {
        div.removeChild(img2[0]);
    }

    var img3 = div.getElementsByClassName("fav-button");
    if (img3.length > 0) {
        div.removeChild(img3[0]);
    }

    var img3Selected = div.getElementsByClassName("fav-button-selected");
    if (img3Selected.length > 0) {
        div.removeChild(img3Selected[0]);
    }
}

function removeImageTitle() {
    var element = document.getElementsByClassName('img-gif-title')[0];
    element.parentNode.removeChild(element);
}

modalCloseButton.onclick = function (event) {
    modal.style.display = "none";
    header.style.display = "inherit";
    document.body.style.overflow = "inherit";
    removeImagesButtons(modalActions);
}