// frontend/api.js (adjust path/name to match your imports)
export const BACKEND_URL = "http://10.204.117.204:5000"; // your backend base
const BASE_API = `${BACKEND_URL.replace(/\/$/, "")}/api/events`;

// Fetch all events
export const fetchEvents = async () => {
  try {
    const res = await fetch(BASE_API);
    if (!res.ok) throw new Error("Network response was not ok");
    return await res.json(); // server returns array
  } catch (err) {
    console.error("Fetch events error:", err);
    return [];
  }
};

// Create a new event
// payload: { name, startDate, endDate, time, venue, description, category, fileUrl }
export const createEvent = async (payload) => {
  try {
    const res = await fetch(BASE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      const message = data.message || (data.errors ? JSON.stringify(data.errors) : "Failed to create event");
      throw new Error(message);
    }
    return data;
  } catch (err) {
    console.error("Create event error:", err);
    throw err;
  }
};
