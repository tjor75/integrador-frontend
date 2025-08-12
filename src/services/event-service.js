import { API_BASE_URL } from "../config/api-config.js";

export const getAllAsync = async (pageNumber, filters) => {
    const url = new URL(`${API_BASE_URL}/api/event`);
    let response;

    url.searchParams.append("page_number",  pageNumber);
    url.searchParams.append("name",         filters.name ?? "");
    url.searchParams.append("start_date",   filters.startDate ?? "");
    url.searchParams.append("tag",          filters.tag ?? "");

    response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`Error fetching event: ${response.statusText}`);
    }

    return await response.json();
};

export const getByIdAsync = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/event/${id}`);
    if (!response.ok) {
        throw new Error(`Error fetching with ID ${id}: ${response.statusText}`);
    }
    return await response.json();
};

export const createAsync = async (entity) => {
    const response = await fetch(`${API_BASE_URL}/api/event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(entity)
    });

    if (!response.ok) {
        throw new Error(`Error creating: ${response.statusText}`);
    }

    return await response.json();
};

export const updateAsync = async (id, entity) => {
    const response = await fetch(`${API_BASE_URL}/api/event/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${entity.jwtToken}`
        },
        body: JSON.stringify(entity)
    });

    if (!response.ok) {
        throw new Error(`Error updating with ID ${id}: ${response.statusText}`);
    }

    return await response.json();
};

export const deleteAsync = async (id, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error deleting with ID ${id}: ${response.statusText}`);
    }

    return await response.json();
};

export const checkEnrollmentAsync = async (eventId, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event/${eventId}/enroll`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });

    console.log("Checking enrollment for event ID:", response.ok);

    return response.ok;
};

export const enrollAsync = async (eventId, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event/${eventId}/enroll`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error enrolling in event ${eventId}: ${response.statusText}`);
    }
};

export const unenrollAsync = async (eventId, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event/${eventId}/enroll`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error unenrolling from event ${eventId}: ${response.statusText}`);
    }
};