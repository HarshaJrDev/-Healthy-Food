import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { WebView } from "react-native-webview";
import Geolocation from "@react-native-community/geolocation";
import axios from "axios";
import { API_URL, API_KEY } from "@env";

const MapScreen = () => {
  const [routeData, setRouteData] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [trackingStatus, setTrackingStatus] = useState({
    status: "Preparing Order",
    estimatedDeliveryTime: null,
    currentLocation: null,
    steps: [],
  });

  // Fetch route data from the API
  const fetchRouteData = async () => {
    try {
      const response = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car",
        {
          coordinates: [
            [78.1103, 10.7905], // Starting point (Madurai)
            [78.1166, 10.9625], // Destination (Madurai)
          ],
        },
        {
          headers: {
            Accept:
              "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
            "Content-Type": "application/json",
            Authorization: API_KEY,
          },
        }
      );

      const routeInfo = response.data.routes[0];

      // Prepare tracking status
      setTrackingStatus({
        status: "Order Picked Up",
        estimatedDeliveryTime: Math.round(routeInfo.summary.duration / 60),
        currentLocation: null,
        steps: routeInfo.segments[0].steps.map((step) => step.instruction),
      });

      setRouteData(response.data);
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
  };

  // Fetch delivery boy's current location using Geolocation
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.error("Error getting location", error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      }
    );
  };

  // Update delivery boy location on map every 5 seconds
  useEffect(() => {
    fetchRouteData();
    getCurrentLocation();

    const locationInterval = setInterval(() => {
      getCurrentLocation(); // Update location every 5 seconds
    }, 5000);

    return () => clearInterval(locationInterval);
  }, []);

  // Map HTML content for WebView
  const mapHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"/>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; }
        #map { height: 70vh; width: 100%; }
        #tracking-info { 
          padding: 15px; 
          background-color: #f8f8f8; 
          border-top: 1px solid #e0e0e0;
        }
        .status-badge {
          padding: 5px 10px;
          background-color: #4CAF50;
          color: white;
          border-radius: 15px;
          display: inline-block;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <div id="tracking-info">
        <div id="status-badge" class="status-badge">Status: ${trackingStatus.status}</div>
        <div id="delivery-time">Estimated Delivery: ${trackingStatus.estimatedDeliveryTime} mins</div>
      </div>
      <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
      <script>
        const map = L.map('map').setView([10.7905, 78.1103], 13); // Default to Madurai

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap',
        }).addTo(map);

        // Route coordinates
        const routeCoords = ${JSON.stringify(
          routeData?.routes?.[0]?.geometry?.coordinates?.map(([lng, lat]) => [lat, lng]) || []
        )};

        if (routeCoords.length === 0) {
          console.error("No route data available.");
        } else {
          const polyline = L.polyline(routeCoords, { color: 'blue', weight: 4 }).addTo(map);
          map.fitBounds(polyline.getBounds());

          // Markers
          L.marker(routeCoords[0]).addTo(map).bindPopup("Restaurant").openPopup();
          L.marker(routeCoords[routeCoords.length - 1]).addTo(map).bindPopup("Delivery Location");

          // If current location is available, update marker
          const currentLocation = ${JSON.stringify(currentLocation)};
          if (currentLocation) {
            const deliveryMarker = L.marker([currentLocation.latitude, currentLocation.longitude], {
              icon: L.icon({
                iconUrl: 'https://image.shutterstock.com/image-vector/delivery-icon-truck-isolated-on-260nw-1188430217.jpg',
                iconSize: [40, 40],
              }),
            }).addTo(map);
            deliveryMarker.bindPopup("Delivery Boy").openPopup();
          }
        }
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: mapHTML }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
      <View style={styles.trackingContainer}>
        <Text style={styles.statusText}>Status: {trackingStatus.status}</Text>
        <Text style={styles.timeText}>
          Estimated Delivery: {trackingStatus.estimatedDeliveryTime} mins
        </Text>
        <Text style={styles.stepTitle}>Delivery Steps:</Text>
        {trackingStatus.steps.map((step, index) => (
          <Text key={index} style={styles.stepText}>• {step}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  webview: {
    flex: 2,
  },
  trackingContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
});

export default MapScreen;
