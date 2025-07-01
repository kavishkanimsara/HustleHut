// src/services/progressService.js

import axios from "axios";

const API_URL = import.meta.env.VITE_APP_IMAGE_URL;

export async function uploadProgress(userId, description, images) {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('description', description);
  images.forEach(image => formData.append('images', image));

  const response = await fetch(`${API_URL}/progress`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return await response.json();
}


export async function getUserProgress(userId) {
  try {
    const response = await fetch(`${API_URL}/progress/user/${userId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch progress');
    }
    return data;
  } catch (error) {
    throw new Error(`Progress fetch error: ${error.message}`);
  }
}
export async function getLatestProgressPerUser() {
  try {
    const response = await fetch(`${API_URL}/progress/latest-per-user`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch latest progress');
    }
    return data;
  } catch (error) {
    throw new Error(`Latest progress fetch error: ${error.message}`);
  }
}
export async function getProgressByUserId(userId) {
  try {
    const response = await fetch(`${API_URL}/progress/user/${userId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch user progress');
    }
    return data;
  } catch (error) {
    throw new Error(`User progress fetch error: ${error.message}`);
  }
}

export async function updateTrainerFeedback(progressId, schedule, comments) {
  try {
    // ✅ Await the fetch call
    const response = await fetch(`${API_URL}/progress/${progressId}/feedback`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedule, comments })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update feedback');
    }

    return data;
  } catch (error) {
    throw new Error(`Feedback update error: ${error.message}`);
  }
}

export async function getAllProgressWithUserInfo() {
  const response = await axios.get(`${API_URL}/progress/withUserInfo`);
  return response.data;
}