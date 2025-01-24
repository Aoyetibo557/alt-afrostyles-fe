import axios from "axios";

const AFTERSHIP_API_KEY = process.env.EXPO_PUBLIC_AFTERSHIP_API_KEY;
const AFTERSHIP_API_URL = "https://api.aftership.com/v4";

// Function to detect carrier from a tracking number
export const detectCarrier = async (trackingNumber: string) => {
  try {
    const response = await axios.post(
      `${AFTERSHIP_API_URL}/couriers/detect`,
      {
        tracking: {
          tracking_number: trackingNumber,
        },
      },
      {
        headers: {
          "aftership-api-key": AFTERSHIP_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.couriers; // Returns an array of detected couriers
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Response data:", error.response.data);
    }
    return [];
  }
};

// Function to validate tracking number format
export const validateTrackingNumber = async (
  trackingNumber: string,
  carrier: string
) => {
  try {
    const response = await axios.post(
      `${AFTERSHIP_API_URL}/trackings`,
      {
        tracking: {
          tracking_number: trackingNumber,
          slug: carrier,
        },
      },
      {
        headers: {
          "aftership-api-key": AFTERSHIP_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data.tracking; // Returns the tracking information if valid
  } catch (error) {
    console.error("Error validating tracking number:", error);
    return null;
  }
};
