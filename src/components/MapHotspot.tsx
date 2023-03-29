import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import styles from "../../styles/Map.module.scss";

const MapHotspot = ({
  coords,
  lastPosition,
  markers,
  latestTimestamp,
}: {
  coords: number[][];
  lastPosition: [number, number];
  markers: [number, number][];
  latestTimestamp: string;
}) => {
  const geoJsonObj: any = [
    {
      type: "LineString",
      coordinates: coords,
    },
  ];
  const mapMarkers = markers.map((latLng, i) => (
  
    <CircleMarker key={i} center={latLng} fillColor="navy" />
  ));

  return (
    <>
      {/* <h2>Route info</h2> */}
      <MapContainer
        center={[-26.1611111, 27.9752222]}
        zoom={12}
        className={styles.container}
      >
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`}
        />
        <Marker position={lastPosition} draggable={true}>
          {/* <Popup>
            Last recorded position:
            <br />
            {lastPosition[0].toFixed(3)}&#176;,&nbsp;
            {lastPosition[1].toFixed(3)}&#176;
            <br />
            {latestTimestamp}
          </Popup>
          <GeoJSON data={geoJsonObj}></GeoJSON> */}
          <CircleMarker key={"target"} center={[-26.1076, 28.0567]} fillColor="red" radius={30} />

          <CircleMarker key={"target"} center={[-26.1611111, 27.9752222]} fillColor="blue" radius={30} />

          <CircleMarker key={"target"} center={[-26.1411111, 27.9652222]} fillColor="orange" radius={30} />
          {/* {mapMarkers} */}
        </Marker>
      </MapContainer>
    </>
  );
};

export default MapHotspot;
