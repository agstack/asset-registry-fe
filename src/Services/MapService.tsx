import { makeRequest } from "../Axios";

//Dummy geoJson Data
const geoJson = [
  {
    type: "Feature",
    properties: {
      name: "Coors Field",
      amenity: "Baseball Stadium",
      popupContent: "This is where the Rockies play!",
    },
    geometry: {
      type: "LineString",
      coordinates: [
        [-100, 40],
        [-105, 45],
        [-110, 55],
      ],
    },
  },
  {
    type: "Feature",
    properties: {
      name: "Coors Field",
      amenity: "Baseball Stadium",
      popupContent: "This is where the Rockies play!",
    },
    geometry: {
      type: "Point",
      coordinates: [-104.99404, 39.75621],
    },
  },
  {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [74.323149, 31.48224],
          [74.324315, 31.482375],
          [74.324319, 31.481324],
          [74.322801, 31.481108],
          [74.322621, 31.481588],
          [74.323149, 31.48224],
        ],
      ],
    },
  },
];

const MapService = {
  getField: async (unique_id: any) => {
    try {
      // const response: any = await makeRequest(`/fetch-field/${unique_id}`, 'GET');
      return geoJson[2];
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
};

export default MapService;
