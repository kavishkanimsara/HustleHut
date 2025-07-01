export async function getUserAttendanceByUserId(userId) {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_IMAGE_URL}/attendance/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch attendance data');
    }

    return data;
  } catch (error) {
    throw new Error(`Attendance fetch error: ${error.message}`);
  }
}
