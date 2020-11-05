var offset = 0;
var favoritesOffset = 0;

fillSlides();
searchFavorites(0, false);

function Search(e) {
    if (e.keyCode === 13) {
        searchPrefetch(0, false);
    }
};

function searchPrefetch(offset, ifSeeMore) {
    var searchText = document.getElementById('searchText').value;
    document.getElementById('searchResults').innerHTML = searchText;
    var url = "https://api.giphy.com/v1/gifs/search?api_key=uXeIYjblhtWKqef33kir3YfDInqBBfD4&q=" + searchText + "&limit=12&offset=" + offset + "&rating=r&lang=en";

    fetch(url)
        .then((resp) => resp.json())
        .then(function (response) {
            if (response.data.length > 0) {
                document.getElementById('noResultsDiv').style.display = 'none';

                if (ifSeeMore == false) {
                    document.getElementById('searchDiv').innerHTML = '';
                }

                document.getElementById('seeMoreButton').classList.remove('hiddenButton');
                response.data.forEach(element => {
                    var url = element.images.downsized.url;
                    var div = document.createElement('div');

                    div.className = 'div-gifs';
                    div.style.backgroundImage = 'url(' + url + ')';
                    div.onmouseover = function () { createImages(div, url, element.id); };
                    div.onmouseleave = function () { removeImages(div); };
                    div.innerHTML = "<div class='img-div'></div>";
                    // asignar gif
                    document.getElementById('searchDiv').appendChild(div);
                });
            }
            else {
                document.getElementById('searchDiv').innerHTML = '';
                document.getElementById('noResultsDiv').style.display = 'inherit';
            }
        })
}

function createImages(mainDiv, url, gifId) {
    var div = mainDiv.getElementsByClassName("img-div")[0];
    var img1 = div.getElementsByClassName("max-button");
    if (img1.length < 1) {
        var img = document.createElement('img');
        img.setAttribute('class', 'max-button');
        img.onclick = function () {
            imgMax.src = url;
            modal.style.display = "block";
        };
        div.appendChild(img);
    }

    var img2 = div.getElementsByClassName("download-button");
    if (img2.length < 1) {
        var img = document.createElement('img');
        img.setAttribute('class', 'download-button');
        img.onclick = function () {
            (async () => {
                let a = document.createElement('a');
                let response = await fetch(url);
                let file = await response.blob();
                a.download = 'image';
                a.href = window.URL.createObjectURL(file);
                a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
                a.click();
            })();
        };
        div.appendChild(img);
    }

    var img3 = div.getElementsByClassName("fav-button");
    var img3Selected = div.getElementsByClassName("fav-button-selected");
    if (img3.length < 1 && img3Selected.length < 1) {
        var img = document.createElement('img');
        var savedIds = JSON.parse(localStorage.getItem("favorites-gifs-ids"));
        if (savedIds && savedIds.find(x => x == gifId)) {
            img.setAttribute('class', 'fav-button-selected');
            img.setAttribute('gif-id', gifId);
            img.onclick = function () {
                var currentId = this.getAttribute("gif-id");
                savedIds.splice(currentId, 1);

                img.setAttribute('class', 'fav-button');
                localStorage.setItem("favorites-gifs-ids", JSON.stringify(savedIds));
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
            };
        }

        div.appendChild(img);
    }
}

function removeImages(mainDiv) {
    var div = mainDiv.getElementsByClassName("img-div")[0];
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

function seeMore() {
    if (offset == 0) {
        offset = 12;
    } else {
        offset += 12;
    }
    searchPrefetch(offset, true);
}

function seeMoreFavorites() {
    if (favoritesOffset == 0) {
        favoritesOffset = 12;
    } else {
        favoritesOffset += 12;
    }
    searchFavorites(favoritesOffset, true);
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
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

function fillSlides() {
    var url = "https://api.giphy.com/v1/gifs/trending?api_key=uXeIYjblhtWKqef33kir3YfDInqBBfD4&limit=9&offset=0&rating=g";

    fetch(url)
        .then((resp) => resp.json())
        .then(function (response) {
            var images = document.getElementsByClassName("trendingImg");
            for (i = 0; i < images.length; i++) {
                images[i].src = response.data[i].images.downsized.url;
            }
        })

}

function searchFavorites(offset, ifSeeMore) {
    var savedIds = JSON.parse(localStorage.getItem("favorites-gifs-ids"));

    if (savedIds) {
        var concatIds = savedIds.join(',');
        var url = "https://api.giphy.com/v1/gifs?api_key=uXeIYjblhtWKqef33kir3YfDInqBBfD4&ids=" + concatIds + "&limit=12&offset=" + offset + "&rating=r&lang=en";

        fetch(url)
            .then((resp) => resp.json())
            .then(function (response) {
                if (response.data.length > 0) {
                    document.getElementById('noFavoritesDiv').style.display = 'none';

                    // inicializar el html para resultados no guardados en "historial"
                    if (ifSeeMore == false) {
                        document.getElementById('favoritesDiv').innerHTML = '';
                    }

                    document.getElementById('seeMoreFavoritesButton').classList.remove('hiddenButton');

                    response.data.forEach(element => {
                        var url = element.images.downsized.url;
                        var div = document.createElement('div');

                        div.className = 'div-gifs';
                        div.style.backgroundImage = 'url(' + url + ')';
                        div.onmouseover = function () { createImages(div, url, element.id); };
                        div.onmouseleave = function () { removeImages(div); };
                        div.innerHTML = "<div class='img-div'></div>";
                        // asignar gif
                        document.getElementById('favoritesDiv').appendChild(div);
                    });
                }
                else {
                    document.getElementById('favoritesDiv').innerHTML = '';
                    document.getElementById('noFavoritesDiv').style.display = 'inherit';
                }
            })
    }
}

var modal = document.getElementById("myModal");
var imgMax = document.getElementById("imgGifMax")

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



