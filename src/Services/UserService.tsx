import { makeRequest } from "../Axios";

const UserService = {
  logout: async () => {
    try {
      const response: any = await makeRequest("/logout", "GET", {
        "Access-Control-Allow-Origin": "*",
      });
      return response.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
};

export default UserService;
