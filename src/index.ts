import "./styles/app";

const form = document.querySelector("form")! as HTMLFormElement;
const addressLat = document.querySelector("#lat")! as HTMLInputElement;
const addressLng = document.querySelector("#lng")! as HTMLInputElement;

function searchAddressHandler(event: Event) {
    event.preventDefault();

    const coordinates = {lat: addressLat.value, lng: addressLng.value};

    document.getElementById("map")!.innerHTML = "";

    new ol.Map({
        target: "map",
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([coordinates.lat, coordinates.lng]),
          zoom: 7
        })
      });
}

form.addEventListener("submit", searchAddressHandler);