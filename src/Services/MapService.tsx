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
          [74.32219, 31.480934],
          [74.32219, 31.481586],
          [74.32364, 31.481586],
          [74.32364, 31.480934],
          [74.32219, 31.480934],
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
];

const MapService = {
  // return Dummy data.
  getField: async (unique_id: any) => {
    try {
      const response: any = await makeRequest(
        `/fetch-field/${unique_id}`,
        "GET"
      );
      return response.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  // return Dummy data.
  getFieldWithPoint: async (wktData: string) => {
    try {
      // const response: any = await makeRequest(`/fetch-fields-for-a-point`, 'POST',{},{wkt:wktData});
      return geoJson[0];
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  getFieldWithPolygon: async (wktData: string) => {
    try {
      // const response: any = await makeRequest(`/register-field-boundary`, 'POST',{},{wkt:wktData});
      return geoJson[0];
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  getFieldWithRectangle: async (wktData: string) => {
    try {
      // const response: any = await makeRequest(`/fetch-bounding-box-fields`, 'POST',{},{wkt:wktData});
      return geoJson[2];
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  getOverlappingFields: async (wktData: string) => {
    try {
      // const response: any = await makeRequest(`/fetch-overlapping-fields`, 'POST',{},{wkt:wktData});
      return geoJson[3];
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  registerField: async (wktData: string) => {
    try {
      const response: any = await makeRequest(
        `/register-field-boundary`,
        "POST",
        {
          "Access-Control-Allow-Origin": "*",
        },
        { wkt: wktData }
      );
      return response.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
};

export default MapService;
