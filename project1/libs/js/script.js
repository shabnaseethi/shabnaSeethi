var country;
var countryDetails;
var mapData;

// Add airports

var marker;
var markers = [];
markers = L.markerClusterGroup();

var myIcon = L.icon({
  iconUrl: "./libs/resources/black-plane.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [-20, -20],
});

const getAirports = (country) => {
  $.ajax({
    url: "libs/php/getAirports.php",
    type: "POST",
    dataType: "json",
    data: {
      country: country,
    },
    success: function (result) {
      markers.clearLayers();

      result.response.forEach((item, index) => {
        marker = L.marker([item.lat, item.lng], { icon: myIcon }).bindPopup(
          item.name
        );
        markers.addLayers(marker);
      });
    },

    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

// -------------------------------------------LEAFLET-MAp-------------------------------------------

var WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

var Stamen_Terrain = L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}",
  {
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',

    ext: "png",
  }
);

var osm_layer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 8,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});
var baseLayers = {
  Osm: osm_layer,
  Terrain: Stamen_Terrain,
  imagery: WorldImagery,
};

var map = L.map("map", {
  maxZoom: 18,
  zoom: 17,
  zoomControl: true,
}).setView([20.5937, 78.9629], 4);

var overLayMaps = {
  Airports: markers,
};

L.control.layers(baseLayers, overLayMaps).addTo(map);

var currentBaseLayer = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 8,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }
).addTo(map);

// -------------------------------------GEOJSON------------------------------------

const data = async (value) => {
  
  $.ajax({
    url: "libs/php/getCountriesBorder.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      // clear previous geojson  layer

      map.eachLayer(function (layer) {
        if (layer.myTag && layer.myTag === "previousLayer") {
          map.removeLayer(layer);
        }
      });

      // Add geojson

      const geoData = result.features.filter(
        (item) => item.properties.iso_a2 === value
      );

      var borderStyle = {
        color: "Teal",
        weight: 5,
        opacity: 0.65,
      };

      let geojson = L.geoJSON(geoData, {
        onEachFeature: function (feature, layer) {
          layer.myTag = "previousLayer";
        },
        style: borderStyle,
      })
        .bindPopup(function (layer) {
          return layer.feature.properties.name;
        })
        .addTo(map);

      map.fitBounds(geojson.getBounds());

      $.ajax({
        url: "libs/php/getCountryInfo.php",
        type: "POST",
        dataType: "json",
        data: {
          lang: "en",
          country: country,
        },
        success: function (result) {
          countryDetails = result.geonames[0];
        },
        error: function (jqXHR, textStatus, errorThrown) {
          // your error code
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });
};

// --------------------------------------GEOLOCATION----------------------------------------

const successCallback = (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  $.ajax({
    url: "libs/php/getLocation.php",
    type: "POST",
    dataType: "json",
    data: {
      latitude: latitude,
      longitude: longitude,
    },
    success: function (result) {
      country = result.data;
      getAirports(country);
      data(country);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
};

const errorCallback = (error) => {
  console.log(error);
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

// ---------------------------------------------------ADDING COUNTRIES--------------------

$("body").on("click", ".dropdown-menu .dropdown-item", function (e) {
  e.preventDefault();

  country = $(this).data("value");
  var selText = $(this).text();

  $(this)
    .parents(".dropdown")
    .find("#dropdownMenuButton")
    .html(selText + ' <span class="caret"></span>');
  getAirports(country);
  data(country);
});

$("document").ready(() => {
  $.ajax({
    url: "libs/php/getAllCountries.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
    
      var countries = [];

      result.forEach((item) =>
        countries.push({
          name: item.name,
          code: item.iso_a2,
        })
      );

      countries.sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0
      );

      countries.forEach((item) =>
        $(".dropdown-menu").append(
          `<a class="dropdown-item" href="#" data-value=${item.code} target="_blank">` +
            item.name +
            "</a>"
        )
      );
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });
});

// ----------------------------------LEAFLET- BUTTONS------------------------------------------

$(".btn").click(() => {
  $("#myModal").modal("hide");
  $("#weatherModal").modal("hide");
  $("#holidayModal").modal("hide");
  $("#newsModal").modal("hide");
  $("#wikiModal").modal("hide");
  $("#placesModal").modal("hide");
});

L.easyButton("fa-circle-info", () => {
  $("#myModal").modal("show");
  $(".image-body img").attr(
    "src",
    `https://www.countryflagicons.com/FLAT/64/${country}.png`
  );
  $(".country").text(countryDetails.countryName);
  $(".capital").text(countryDetails.capital);
  $(".area").text(Number(countryDetails.areaInSqKm).toLocaleString() + " sqkm");
  $(".currency").text(countryDetails.currencyCode);
  $(".continent").text(countryDetails.continentName);
  $(".population").text(Number(countryDetails.population).toLocaleString());
}).addTo(map);

L.easyButton("fa-cloud", () => {
  $.ajax({
    url: "libs/php/getWeather.php",
    type: "POST",
    dataType: "json",
    data: {
      capital: countryDetails.capital.replace(" ", "%20"),
    },
    success: function (result) {
      $("#weatherModal").modal("show");
      $(".image").attr(
        "src",
        ` http://openweathermap.org/img/wn/${result.weather[0].icon}.png`
      );
      $(".location").text(result.name + "," + result.sys.country);
      $(".feels").text(Math.floor(result.main.feels_like - 273) + " °C");
      $(".min-temp").text(Math.floor(result.main.temp_min - 273) + " °C");
      $(".max-temp").text(Math.floor(result.main.temp_max - 273) + " °C");
      $(".temperature").html(Math.floor(result.main.temp - 273) + " °C");
      $(".description").text(result.weather[0].description);
      $(".pressure").text(result.main.pressure);
      $(".wind").text(result.wind.speed + "m/s");
      $(".humidity").text(result.main.humidity);
      $(".date").html(new Date().toLocaleDateString());
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}).addTo(map);

L.easyButton("fa-brands fa-wikipedia-w", () => {
  $(".wiki").empty();
  $.ajax({
    url: "libs/php/getWikipedia.php",
    type: "POST",
    dataType: "json",
    data: {
      country: countryDetails.countryName.replace(" ", "%20"),
    },
    success: function (result) {
      $("#wikiModal").modal("show");
      var arr = Object.values(result.query.pages);
      const url = `https://en.wikipedia.org/wiki/${countryDetails.countryName}`;
      $("#wikiModal .modal-title").html(countryDetails.countryName);
      $(".wiki").append(
        `  <p id="wiki-details">${arr[0].extract}</p>
        <a href=${url} target="_blank" id="wiki-link">More>>>></a>`
      );
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}).addTo(map);

L.easyButton("fa-solid fa-newspaper", () => {
  $(".news").empty();
  $.ajax({
    url: "libs/php/getNews.php",
    type: "POST",
    dataType: "json",
    data: {
      country: country,
    },
    success: function (result) {
      $("#newsModal").modal("show");

      if (result.results) {
        result.results.map((article) => {
          if (article.image_url !== null) {
            $(".news").append(
              `<div class="image-wrapper">
                <a href=${article.link} target="_blank"
                  ><img
                    src=${article.image_url}
                /></a>
              </div>
              <h5>
              ${article.title}
              </h5>
              <p>${article.pubDate}</p>
              <hr />`
            );
          }
          if (article.image_url === null) {
            $(".news").append(
              `<a href=${article.link} target="_blank"><h5>
            ${article.title}
            </h5></a>
            <p>${article.pubDate}</p>
            <hr />`
            );
          }
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}).addTo(map);

L.easyButton("fa-solid fa-calendar-days", () => {
  $(".holidays table").empty();
  $.ajax({
    url: "libs/php/getHolidays.php",
    type: "POST",
    dataType: "json",
    data: {
      country: country,
    },
    success: function (result) {
      $("#holidayModal").modal("show");
      result.holidays.map((holiday) => {
        const newDate = new Date(holiday.date);

        const month = newDate.toLocaleString("default", { month: "long" });
        const date = newDate.getDate();
        const year = newDate.getFullYear() + 1;

        $(".holidays table").append(
          `<tr>
          <th scope="row">${date} ${month} ${year}</th>
          <td class="country">${holiday.name}</td>
        </tr>`
        );
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}).addTo(map);

L.easyButton("fa-solid fa-location-dot", () => {
  $(".places table").empty();
  $.ajax({
    url: "libs/php/getPlaces.php",
    type: "POST",
    dataType: "json",
    data: {
      country: country,
    },
    success: function (result) {
      $("#placesModal").modal("show");

      result.map((place) => {
        $(".places table").append(
          `<tr>
           
           <td>${place}</td>
         </tr>`
        );
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}).addTo(map);
