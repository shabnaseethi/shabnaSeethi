
var country;
var countryDetails;

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

var osm_layer =L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 8,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});
var baseLayers = {
  osm:osm_layer,
  Terrain: Stamen_Terrain,
  imagery: WorldImagery,
};

var map = L.map("map").setView([20.5937, 78.9629], 4);
var markers = []
markers =L.markerClusterGroup();

L.control.layers(baseLayers).addTo(map);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 8,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// -------------------------------------GEOJSON------------------------------------

var data = async (value) =>

  await fetch("./libs/resources/countryBorders.geo.json")
    .then((results) => results.json())
    .then((data) => {
      // clear previous geojson  layer and markers
      markers.clearLayers();
      map.eachLayer(function (layer) {
        if (layer.myTag && layer.myTag === "previousLayer") {
          map.removeLayer(layer);
        }
      });

      // Add geojson

      const geoData = data.features.filter(
        (item) => item.properties.iso_a2 === value
      );

      let geojson = L.geoJSON(geoData, {
        onEachFeature: function (feature, layer) {
          layer.myTag = "previousLayer";
        },
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
    });

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

  data(country);
});

$("document").ready(() => {
  $.ajax({
    url: "libs/php/getCountries.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      var countries = [];

      result.features.forEach((item) =>
        countries.push({
          name: item.properties.name,
          code: item.properties.iso_a2,
        })
      );

      countries.sort((a, b) =>
        a.name < b.name ? -1 : a.name > b.name ? 1 : 0
      );

      countries.forEach((item) =>
        $(".dropdown-menu").append(
          `<a class="dropdown-item" href="#" data-value=${item.code}>` +
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

const handleClose = () => {
  $("#myModal").modal("hide");
  $("#weatherModal").modal("hide");
  $("#holidayModal").modal("hide");
  $("#newsModal").modal("hide");
};

L.easyButton("fa-circle-info", () => {
  $("#myModal").modal("show");
  $(".image-body img").attr(
    "src",
    `https://www.countryflagicons.com/FLAT/64/${country}.png`
  );
  $(".country").text(countryDetails.countryName);
  $(".capital").text(countryDetails.capital);
  $(".area").text(countryDetails.areaInSqKm + " sqkm");
  $(".currency").text(countryDetails.currencyCode);
  $(".continent").text(countryDetails.continentName);
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
      $(".location").text(result.name);
      $(".feels").text(
        "Feels Like: " + Math.floor(result.main.feels_like - 273) + " °C"
      );
      $(".min-max").text(
        Math.floor(result.main.temp_min - 273) +
          " °C / " +
          Math.floor(result.main.temp_max - 273) +
          " °C "
      );
      $(".temp").html(Math.floor(result.main.temp - 273) + " °C");
      $(".desc").text(result.weather[0].description);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}).addTo(map);


L.easyButton("fa-sharp fa-solid fa-plane", () => {
  
  $.ajax({
    url: "libs/php/getAirports.php",
    type: "POST",
    dataType: "json",
    data: {
      country: country,
    },
    success: function (result) {
      
     result.response.map((item,index)=>{
      if(index<10){
      //  markers = L.marker([item.lat,item.lng]);
      // //  console.log(marker._leaflet_id);
      // map.addLayer(markers);
      markers.addLayer(L.marker([item.lat,item.lng]).bindPopup(item.name));
      map.addLayer(markers);
      }
      
  
     })

   
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}).addTo(map);

L.easyButton("fa-solid fa-newspaper", () => {
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
          $(".news").append(
            `<div class="details"><a href=${article.link}><p>${article.title}</p></a>
            <li>${article.pubDate} </li></div><hr/>`
          );
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
        var date = holiday.date;
        date = date.split("-").map((e) => (e[0] == "0" ? e.slice(1) : e));
        date = date[2] + "/" + date[1] + "/" + date[0];

        $(".holidays").append(
          `<div class="details"><h5>${date}</h5>
        <li>${holiday.name} </li></div><hr/>`
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
