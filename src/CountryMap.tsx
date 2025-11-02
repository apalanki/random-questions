import React, { useEffect } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

function CountryMap() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA4358Los6FbDJUZIrHN3gUVJs2cepgk14",
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map: any) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  useEffect(() => {
    let geocoder = new google.maps.Geocoder();
    const myMapElement = document.getElementById("myMap");
    if (myMapElement === null) {
      return;
    }
    let location = "England";
    const FRANCE = {
      id: "55",
      long_name: "France",
      short_name: "FR",
      center_lat: "46.227638",
      center_lng: "2.213749",
      sw_lat: 41.342328,
      sw_lng: -5.141228,
      ne_lat: 51.089166,
      ne_lng: 9.560068,
    };

    const myOptions = {
      center: new google.maps.LatLng(
        parseInt(FRANCE.center_lat),
        parseInt(FRANCE.center_lng),
      ),
    };
    var map = new google.maps.Map(myMapElement, myOptions);

    var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(FRANCE.sw_lat, FRANCE.sw_lng),
      new google.maps.LatLng(FRANCE.ne_lat, FRANCE.ne_lng),
    );
    map.fitBounds(bounds);

    geocoder.geocode({ address: location }, function (results, status) {
      if (
        map !== null &&
        results !== undefined &&
        results !== null &&
        results.length > 0 &&
        status == google.maps.GeocoderStatus.OK
      ) {
        (map as any).setCenter(results[0].geometry.location);
      } else {
        alert("Could not find location: " + location);
      }
    });
  });

  const onUnmount = React.useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Child components, such as markers, info windows, etc. */}
      <></>
    </GoogleMap>
  ) : (
    <></>
  );
  // return <div id="myMap"></div>
}

export default React.memo(CountryMap);
