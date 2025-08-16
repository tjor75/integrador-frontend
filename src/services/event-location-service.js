import { StatusCodes } from "http-status-codes";
import { API_BASE_URL } from "../config/api-config.js";

const getAllAsync = async (jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event-location`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });

    if (!response.ok)
        throw new Error(await response.text());

    return await response.json();
};

const getLocationsAsync = async () => {
    const response = await fetch(`${API_BASE_URL}/api/event-location/locations`);

    if (!response.ok)
        throw new Error(await response.text());

    return await response.json();
};

const getByIdAsync = async (id, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event-location/${id}`, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });
    let result;
    
    switch (response.status) {
        case StatusCodes.OK:
            result = await response.json();
            break;
        case StatusCodes.NOT_FOUND:
            result = null;
            break;
        default:
            throw new Error(await response.text());
    }

    return result;
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
    
    if (!response.ok)
        throw new Error(await response.text());
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
    
    if (!response.ok)
        throw new Error(await response.text());
};

const deleteAsync = async (id, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event-location/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });
    let result;
    
    switch (response.status) {
        case StatusCodes.OK:
            result = true;
            break;
        case StatusCodes.NOT_FOUND:
            result = false;
            break;
        default:
            throw new Error(await response.text());
    }

    return result;
};

export {
    getAllAsync,
    getByIdAsync,
    createAsync,
    updateAsync,
    deleteAsync,
    getLocationsAsync
};
