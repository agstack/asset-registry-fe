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
];

const MapService = {
  // return Dummy data.
  getField: async (unique_id: any) => {
    try {
      // const response: any = await makeRequest(
      //   `/fetch-field/${unique_id}`,
      //   "GET",
      //   {
      //     "Access-Control-Allow-Origin": "*",
      //   }
      // );
      return {
        "GEO Id": "e49e5885493e952e262e7f16fcf9a8f42fb1a29b1ecc5c5174104e112a5f29a0",
        "Geo Data": null,
        "Geo JSON": {
            "geometry": {
                "coordinates": [
                    [
                        [
                            74.28474893766473,
                            31.5078004642444
                        ],
                        [
                            74.3044981417944,
                            31.50758093422832
                        ],
                        [
                            74.29960377381441,
                            31.500702065887303
                        ],
                        [
                            74.28474893766473,
                            31.500116606911867
                        ],
                        [
                            74.2823446867272,
                            31.504068383850665
                        ],
                        [
                            74.28474893766473,
                            31.5078004642444
                        ]
                    ]
                ],
                "type": "Polygon"
            },
            "type": "Feature"
        },
        "Message": "Field fetched successfully."
    };
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  // return Dummy data.
  getFieldWithPoint: async (wktData: string) => {
    try {
      const response: any = await makeRequest(
        `/fetch-fields-for-a-point`,
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
  getFieldWithRectangle: async (wktData: string) => {
    try {
      const response: any = await makeRequest(
        `/fetch-bounding-box-fields`,
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
  getOverlappingFields: async (wktData: string) => {
    try {
      const response: any = await makeRequest(
        `/fetch-overlapping-fields`,
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
