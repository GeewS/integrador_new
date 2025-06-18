import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './mapaSenai.module.css';

// Corrige ícone padrão do Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapaSenai() {
  const position = [-22.914103568639096, -47.06824335627237];

  return (
    <div className={styles.container}>
      <MapContainer
        center={position}
        zoom={18}
        scrollWheelZoom={true}
        className={styles.mapa}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="© OpenStreetMap contributors"
        />
        <Marker position={position}>
          <Popup>
            <strong>Senai Roberto Mange</strong><br />
            Av. da Saudade, 125 - Campinas/SP
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
