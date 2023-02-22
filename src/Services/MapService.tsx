import { makeRequest } from "../Axios";

//Dummy geoJson Data
const geoJson = [
  {
    type: "Feature",
    properties: {
      fillColor: "green",
      opacity: 1,
      color: "black", //Outline color
      fillOpacity: 0.6,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [74.320503, 31.481449],
          [74.322241, 31.483018],

          [74.321136, 31.480762],
          [74.320627, 31.48122],
          [74.320503, 31.481449],
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
          [74.320503, 31.481449],
          [74.322241, 31.483018],
          [74.323324, 31.482876],
          [74.324032, 31.481751],
          [74.32259, 31.480021],
          [74.321136, 31.480762],
          [74.320627, 31.48122],
          [74.320503, 31.481449],
        ],
      ],
    },
  },
  {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Point",
      coordinates: [74.3301, 31.4775],
    },
  },
  {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [
            [74.320503, 31.481449],
            [74.322241, 31.483018],
            [74.323324, 31.482876],
            [74.324032, 31.481751],

            [74.320503, 31.481449],
          ],
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
          [74.320906, 31.483416],
          [74.324832, 31.483311],
          [74.32495, 31.482711],
          [74.324687, 31.482263],
          [74.324531, 31.481636],
          [74.320954, 31.482597],
          [74.320906, 31.483416],
        ],
      ],
    },
  },
  {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-71.33, 46.566],
              [-70.33, 46.566],
              [-70.33, 47.566],
              [-71.33, 47.566],
              [-71.33, 46.566],
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
              [-71.33, 46.566],
              [-70.33, 46.566],
              [-70.33, 47.566],
              [-71.33, 47.566],
              [-71.33, 46.566],
            ],
          ],
        },
      },
    ],
  },
];

const MapService = {
  getField: async (unique_id: any) => {
    try {
      const response: any = await makeRequest(
        `/fetch-field/${unique_id}`,
        "GET",
        {
          "Access-Control-Allow-Origin": "*",
        }
      );
      return response.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  getFieldWithPoint: async (
    lat: string,
    lng: string,
    s2_index: string,
    domain: string
  ) => {
    try {
      const response: any = await makeRequest(
        `/fetch-fields-for-a-point`,
        "POST",
        {
          "Access-Control-Allow-Origin": "*",
        },
        { latitude: lat, longitude: lng, s2_index, domain }
      );
      const data = response.data["Fetched fields"]
        .map((e: any) => Object.values(e))
        .map((e: any) => e[0]["Geo JSON"]);
      return { data, json: response.data };
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  getFieldWithRectangle: async (lats: string, lngs: string) => {
    try {
      const response: any = await makeRequest(
        `/fetch-bounding-box-fields`,
        "POST",
        {
          "Access-Control-Allow-Origin": "*",
        },
        { latitudes: lats, longitudes: lngs }
      );
      const data = response.data["message"]
        .map((e: any) => Object.values(e))
        .map((e: any) => e[0]["Geo JSON"]);
      return { data, json: response.data };
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  getOverlappingFields: async (
    wktData: string,
    resolution_level: number,
    threshold: number,
    domain: string,
    s2_index: string
  ) => {
    try {
      const response: any = await makeRequest(
        `/fetch-overlapping-fields`,
        "POST",
        {
          "Access-Control-Allow-Origin": "*",
        },
        {
          wkt: wktData,
          resolution_level,
          threshold,
          domain,
          s2_index,
        }
      );
      const data = response.data["Matched Fields"]
        .map((e: any) => Object.values(e))
        .map((e: any) => e[0]["Geo JSON"]);
      return { data, json: response.data };
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  registerField: async (
    wktData: string,
    resolution_level: number,
    threshold: number,
    s2_index: string
  ) => {
    try {
      const response: any = await makeRequest(
        `/register-field-boundary`,
        "POST",
        {
          "Access-Control-Allow-Origin": "*",
        },
        { wkt: wktData, resolution_level, threshold, s2_index }
      );
      return response.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  getPercentageOverlapFields: async (geojson1: string, geojson2: string) => {
    try {
      const response: any = await makeRequest(
        `/get-percentage-overlap-two-fields`,
        "POST",
        {
          "Access-Control-Allow-Origin": "*",
        },
        {
          geo_id_field_1: geojson1,
          geo_id_field_2: geojson2,
        }
      );
      return response.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
};

export default MapService;
