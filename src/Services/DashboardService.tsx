import { makeRequest } from "../Axios";

const DashboardService = {
  getTotalFieldCount: async () => {
    try {
      const response: any = await makeRequest(
        "/fetch-registered-field-count",
        "GET",
        {
          "Access-Control-Allow-Origin": "*",
        }
      );
      return response.data.count;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  getFieldCountByMonth: async () => {
    try {
      const response: any = await makeRequest(
        "/fetch-field-count-by-month",
        "GET",
        {
          "Access-Control-Allow-Origin": "*",
        }
      );
      return response.data.count;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
};

export default DashboardService;