import { makeRequest } from "../Axios";

const UserService = {
  fetchToken: async () => {
    try {
      const response: any = await makeRequest("/fetch-session-cookies", "GET", {
        "Access-Control-Allow-Origin": "*",
      });
      return response.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
};

export default UserService;
