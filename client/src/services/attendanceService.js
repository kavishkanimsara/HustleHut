import axios from "axios";

export async function getUserAttendanceByUserId() {
  try {
    const response = await axios.get("/client/attendance", {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch attendance data",
    );
  }
}
