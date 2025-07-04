export async function getBmiByUserId() {
  try {
    const response = await fetch(`/client/bmi`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch BMI");
    }

    return data;
  } catch (error) {
    throw new Error(`BMI fetch error: ${error.message}`);
  }
}
// 📁 src/services/bmiService.js

export async function addBmiRecord(bmiData) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_IMAGE_URL}/client/bmi`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bmiData),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add BMI record");
    }

    return data; // contains insertedId and message
  } catch (error) {
    throw new Error(`BMI add error: ${error.message}`);
  }
}
