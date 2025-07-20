import { API_BASE_URL } from "../config/api-config.js";

const getAllAsync = async (pageNumber) => {
    const url = new URL(`${API_BASE_URL}/api/event`);
    let response;

    url.searchParams.append('page_number', pageNumber);

    response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`Error fetching event: ${response.statusText}`);
    }
    
    return await response.json();
};

const getByIdAsync = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/event/${id}`);
    if (!response.ok) {
        throw new Error(`Error fetching with ID ${id}: ${response.statusText}`);
    }
    return await response.json();
};

const createAsync = async (entity) => {
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

export { getAllAsync, getByIdAsync, createAsync };