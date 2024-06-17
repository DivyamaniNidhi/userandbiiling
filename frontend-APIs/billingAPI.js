import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const createBillingAddress = async (billingData) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.post(
      `${API_URL}/billingAddress`,
      billingData,
      config
    );
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getBillingAddress = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.get(`${API_URL}/billingAddress`, config);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const updateBillingAddress = async (billingData) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await axios.put(
      `${API_URL}/billingAddress`,
      billingData,
      config
    );
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
