// frontend/app/api.js
export const BASE_URL = "http://192.168.1.43:5000/api/events"; 
export const BACKEND_URL = "http://192.168.1.43:5000";
// your PC LAN IP

export const fetchEvents = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return await res.json();
  } catch (err) {
    console.error("Fetch events error:", err);
    return [];
  }
};

export const createEvent = async (formData) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return await res.json();
  } catch (err) {
    console.error("Create event error:", err);
    throw err;
  }
};
