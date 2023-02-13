var country;
var countryDetails;
var mapData;

// -----------------Adding  airports---------------------

var marker;
var markers = [];
markers = L.markerClusterGroup();

var myIcon = L.ExtraMarkers.icon({
  shape: "circle",
  markerColor: "blue-dark",
  prefix: "fa",
  icon: "fa-plane",
  iconColor: "#fff",
  iconRotate: 0,
  number: "",
  svg: true,
});

// L.marker([51.941196,4.512291], {icon: redMarker}).addTo(map);

const getAirports = (country) => {
  $.ajax({
    url: "libs/php/getAirports.php",
    type: "POST",
    dataType: "json",
    data: {
      country: country,
    },
    success: function (result) {
      // Clear previous markers

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
var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var osm_layer = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 8,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});
var baseLayers = {
  Street: osm_layer,
  Terrain: Stamen_Terrain,
  Satellite: WorldImagery,
 
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
    data: {
      code: value,
    },

    success: function (result) {
      // clear previous geojson  layer

      map.eachLayer(function (layer) {
        if (layer.myTag && layer.myTag === "previousLayer") {
          map.removeLayer(layer);
        }
      });

      // // Add geojson layer

      const geoData = result.data;

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
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
      console.log(jqXHR);
    },
  });

  // To get the details of the country

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
      $("#sel-country").val(country);
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

$("body").on("change", "#sel-country", function (e) {
  e.preventDefault();
  country = $("#sel-country").val();

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

      // To display countries in alphabetical order

      countries.sort((a, b) => a.name.localeCompare(b.name));

      countries.forEach((item) =>
        $("#sel-country").append(
          `<option id="country-value" value=${item.code}  >${item.name}</option>`
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

// ----------------------------------Country Details----------------------------------------

L.easyButton("fa-circle-info", () => {
  $.ajax({
    url: "libs/php/getPlaces.php",
    type: "POST",
    dataType: "json",
    data: {
      country: country,
    },
    success: function (result) {
      $(".modal-header img").attr(
        "src",
        `https://www.countryflagicons.com/FLAT/64/${country}.png`
      );
      $(".modal-title").text(countryDetails.countryName);

      $(".capital").text(countryDetails.capital);
      $(".area").text(
        Number(countryDetails.areaInSqKm).toLocaleString() + " sqkm"
      );
      $(".currency").text(countryDetails.currencyCode);
      $(".continent").text(countryDetails.continentName);
      $(".population").text(Number(countryDetails.population).toLocaleString());
      $(".places").text(result.join(", "));
      $("#myModal").modal("show");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}).addTo(map);

// --------------------------------------Weather Data-------------------------------------------

L.easyButton("fa-cloud", () => {

  $.ajax({
    url: "libs/php/getWeather.php",
    type: "POST",
    dataType: "json",
    data: {
      capital: countryDetails.capital.replace(" ", "%20"),
    },
    success: function (result) {
     
      $("#weatherModal .weather-capital").html(result.location.name);
      $("#weatherModal .weather-time").html(
        new Date(result.location.localtime).toLocaleString("en-us", {
          day:"numeric",
          weekday: "short",
          hour: "2-digit",
            minute: "2-digit",
        }) 
      );
      $("#weatherModal .temp").html(result.current.feelslike_c + "°C");
      $('.image-desc').empty();
      $('.weather-forecast').empty();
      $('.image-desc').append(`  <img
      class="image"
      src=${result.current.condition.icon}
    />
    <p class="desc">${result.current.condition.text}</p>`)
      // $("#weatherModal .image").attr("src", ` `);
      result.forecast.forecastday.map((item) => {
      if(result.forecast.forecastday.indexOf(item)>0){
        $(".weather-forecast").append(`<div class="col-sm">
        <div class="forecast">
          <h6 class="day">${new Date(item.date).toLocaleString("en-us", {
            weekday: "short",
            day: "numeric",
          })}</h6>
         <div class="desc-temp">
          <img
          class="img"
          src=${item.day.condition.icon}
        />
       <div class="forecast-temp">
        <h6 class="max"><strong>${item.day.maxtemp_c}°</strong></h6>
        <h6 class="min"><strong>${item.day.mintemp_c}°</strong></h6>
       </div>
         </div>
        </div>
      </div>`);
      }
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  $("#weatherModal").modal("show");
}).addTo(map);

// ---------------------------------------------------WIKIPEDIA------------------------------------------

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

// ------------------NEWS-------------------------

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

      if (Array.isArray(result.results)) {
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
              <p>${ new Date(article.pubDate).toLocaleString("en-us", {
                day:"numeric",
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit"
              })}</p>
              
              <hr />`
            );
          }
          if (article.image_url === null) {
            $(".news").append(
              `<a href=${article.link} target="_blank"><h5>
            ${article.title}
            </h5></a>
            <p>${ new Date(article.pubDate).toLocaleString("en-us", {
              day:"numeric",
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit"
            })}</p>
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

// ---------------------------------Holidays-------------------------------------

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

        $(".holidays table").append(
          `<tr>
          <th scope="row">${date} ${month}</th>
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
