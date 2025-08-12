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

const getBaseLocationsAsync = async () => {
    const response = await fetch(`${API_BASE_URL}/api/event-location/base-locations`);
    if (!response.ok) {
        throw new Error(`Error fetching base locations: ${response.statusText}`);
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

const updateAsync = async (id, eventLocationUpdate, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event-location/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(eventLocationUpdate)
    });

    if (!response.ok) {
        throw new Error(`Error updating event location: ${response.statusText}`);
    }

    // Some APIs return the updated entity, others return status only.
    // Try to parse JSON; if empty, return null to signal success without payload.
    try {
        return await response.json();
    } catch (_) {
        return null;
    }
};

const deleteAsync = async (id, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event-location/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error deleting event location: ${response.statusText}`);
    }

    return true;
};

export {
    getAllAsync,
    getByIdAsync,
    createAsync,
    updateAsync,
    deleteAsync,
    getBaseLocationsAsync
};
