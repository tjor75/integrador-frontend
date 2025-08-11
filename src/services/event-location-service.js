import { API_BASE_URL } from "../config/api-config.js";

const getAllAsync = async (jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event-location`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });
    if (!response.ok) {
        throw new Error(`Error fetching event locations: ${response.statusText}`);
    }
    return await response.json();
};

const getByIdAsync = async (id, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event-location/${id}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });
    if (!response.ok) {
        throw new Error(`Error fetching event location with ID ${id}: ${response.statusText}`);
    }
    return await response.json();
};

const createAsync = async (eventLocation, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event-location`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(eventLocation)
    });

    if (!response.ok) {
        throw new Error(`Error creating event location: ${response.statusText}`);
    }

    return await response.json();
};

export {
    getAllAsync,
    getByIdAsync,
    createAsync
};
