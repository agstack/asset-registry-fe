import { makeRequest } from "../Axios";

const UserService = {
  logout: async (isLoggedIn: boolean) => {
    try {
      const response: any = await makeRequest("/logout", "GET", {
        "Access-Control-Allow-Origin": "*",
      });
      return response.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
  login: async (data: { email: string; password: string }) => {
    try {
      const response: any = await makeRequest(
        "/login",
        "POST",
        {
          "Access-Control-Allow-Origin": "*",
        },
        { ...data }
      );
      return response.data;
    } catch (error: any) {
      throw error?.response?.data;
    }
  },
};

export default UserService;
