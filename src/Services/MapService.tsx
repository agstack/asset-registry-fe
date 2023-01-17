import { makeRequest } from "../Axios";

//Dummy geoJson Data
const geoJson = [
  {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-119.223633, 50.261254],
          [-114.609375, 50.429518],
          [-113.730469, 48.04871],
          [-111.577148, 46.589069],
          [-118.564453, 44.527843],
          [-121.772461, 48.078079],
          [-119.223633, 50.261254],
        ],
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
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [-99.555442, 49.079432],
          [-99.555442, 51.492239],
          [-96.598679, 51.492239],
          [-96.598679, 49.079432],
          [-99.555442, 49.079432],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {},
    geometry: { type: "Point", coordinates: [-89.824219, 49.553726] },
  },
  {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Point",
      coordinates: [-104.99404, 39.75621],
    },
  },
];

const MapService = {
  // return Dummy data.
  getField: async (unique_id: any) => {
    try {
      // const response: any = await makeRequest(`/fetch-field/${unique_id}`, 'GET');
      return geoJson[0];
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  // return Dummy data.
  getFieldWithPoint: async () => {
    try {
      // const response: any = await makeRequest(
      //   `fetch-fields-for-a-point`,
      //   "GET",
      //   {},
      //   {
      //     latitude: 31.47704430446457,
      //     longitude: 74.37510786779589,
      //   }
      // );
      return {
        type: "FeatureCollection",
        features: [
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
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [74.32219, 31.480934],
                  [74.32219, 31.481586],
                  [74.32364, 31.481586],
                  [74.32364, 31.480934],
                  [74.32219, 31.480934],
                ],
              ],
            },
          },
        ],
      };
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
};

export default MapService;
