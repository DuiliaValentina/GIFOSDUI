var offset = 0;

fillSlides();

function Search(e) {
    if (e.keyCode === 13) {
        searchPrefetch(0, false);
    }
};

function searchPrefetch(offset, ifSeeMore) {
    var searchText = document.getElementById('searchText').value;
    document.getElementById('searchResults').innerHTML = searchText;
    var url = "https://api.giphy.com/v1/gifs/search?api_key=uXeIYjblhtWKqef33kir3YfDInqBBfD4&q=" + searchText + "&limit=4&offset=" + offset + "&rating=r&lang=en";

    fetch(url)
        .then((resp) => resp.json())
        .then(function (response) {
            // inicializar el html para resultados no guardados en "historial"
            if (ifSeeMore == false) {
                document.getElementById('searchDiv').innerHTML = '';
            }
            response.data.forEach(element => {
                var url = element.images.downsized.url;
                var div = document.createElement('div');
                div.className = 'div-gifs';
                div.innerHTML = '<img src="' + url + '" width="260" height="200">';
                // asignar gif
                document.getElementById('searchDiv').appendChild(div);
            });
        })
}

function seeMore() {
    if (offset == 0) {
        offset = 4;
    } else {
        offset += 4;
    }
    searchPrefetch(offset, true);
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
    var dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active";
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




