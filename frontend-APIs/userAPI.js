import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const signupUser = async (userData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${API_URL}/user/signup`,
      userData,
      config
    );

    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `${API_URL}/user/login`,
      userData,
      config
    );

    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
