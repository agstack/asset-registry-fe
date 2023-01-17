import L from "leaflet";

//find Center point bounders.
export const findCenter = (data: any) => {
  if (data.geometry.type === "Point") {
    return [
      !Array.isArray(data.geometry.coordinates[1])
        ? data.geometry.coordinates[1]
        : 0,
      !Array.isArray(data.geometry.coordinates[0])
        ? data.geometry.coordinates[0]
        : 0,
    ] as L.LatLngExpression;
  } else if (
    data.geometry.type === "LineString" &&
    Array.isArray(data.geometry.coordinates)
  ) {
    if (Array.isArray(data.geometry.coordinates)) {
      let coordinates = data.geometry.coordinates.map((rawPoint: any) => {
        return new L.LatLng(
          Array.isArray(rawPoint)
            ? !Array.isArray(rawPoint[1])
              ? rawPoint[1]
              : 0
            : 0,
          Array.isArray(rawPoint)
            ? !Array.isArray(rawPoint[0])
              ? rawPoint[0]
              : 0
            : 0
        );
      });
      let polyline = L.polyline(coordinates);
      return polyline.getBounds();
    }
  } else {
    if (Array.isArray(data.geometry.coordinates[0])) {
      let coordinates: any = data.geometry.coordinates[0].map((rawPoint) => {
        return new L.LatLng(
          Array.isArray(rawPoint)
            ? !Array.isArray(rawPoint[1])
              ? rawPoint[1]
              : 0
            : 0,
          Array.isArray(rawPoint)
            ? !Array.isArray(rawPoint[0])
              ? rawPoint[0]
              : 0
            : 0
        );
      });

      let polygon = L.polygon(coordinates);
      return polygon.getBounds();
    }
  }
};

//Convert leafletDraw data layer to WKT.
export const toWKT = (layer: any) => {
  let lng,
    lat,
    coords = [];
  if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
    let latlngs = layer.getLatLngs();
    for (var i = 0; i < latlngs.length; i++) {
      let latlngs1 = latlngs[i];
      if (Array.isArray(latlngs1) && latlngs1.length) {
        for (var j = 0; j < latlngs1.length; j++) {
          coords.push(latlngs1[1] + " " + latlngs1[0]);
          if (j === 0) {
            lng = latlngs1[1];
            lat = latlngs1[0];
          }
        }
      } else {
        coords.push(latlngs[i] + " " + latlngs[i]);
        if (i === 0) {
          lng = latlngs[1];
          lat = latlngs[0];
        }
      }
    }
    if (layer instanceof L.Polygon) {
      return "POLYGON((" + coords.join(",") + "," + lng + " " + lat + "))";
    } else if (layer instanceof L.Polyline) {
      return "LINESTRING(" + coords.join(",") + ")";
    }
  } else if (
    layer instanceof L.Marker ||
    layer instanceof L.Circle ||
    layer instanceof L.CircleMarker
  ) {
    return "POINT(" + layer.getLatLng().lng + " " + layer.getLatLng().lat + ")";
  }
};
