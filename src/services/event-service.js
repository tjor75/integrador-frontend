import { StatusCodes } from "http-status-codes";
import { API_BASE_URL } from "../config/api-config.js";

export const getAllAsync = async (pageNumber, filters) => {
    const url = new URL(`${API_BASE_URL}/api/event`);
    let response;

    url.searchParams.append("page_number",  pageNumber);
    url.searchParams.append("name",         filters.name ?? "");
    url.searchParams.append("start_date",   filters.startDate ?? "");
    url.searchParams.append("tag",          filters.tag ?? "");

    response = await fetch(url.toString());

    if (!response.ok)
        throw new Error(await response.text());

    return await response.json();
};

export const getByIdAsync = async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/event/${id}`);
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

export const createAsync = async (jwtToken, entity) => {
    const response = await fetch(`${API_BASE_URL}/api/event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(entity)
    });

    if (!response.ok)
        throw new Error(await response.text());
};

export const updateAsync = async (jwtToken, entity) => {
    const response = await fetch(`${API_BASE_URL}/api/event`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(entity)
    });

    if (!response.ok)
        throw new Error(await response.text());
};

export const deleteAsync = async (id, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        }
    });

    if (!response.ok)
        throw new Error(await response.text());
};

export const checkEnrollmentAsync = async (eventId, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event/${eventId}/enrollment`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });
    let result;
    
    switch (response.status) {
        case StatusCodes.CREATED:
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

export const enrollAsync = async (eventId, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event/${eventId}/enrollment`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });

    if (!response.ok)
        throw new Error(await response.text());
};

export const unenrollAsync = async (eventId, jwtToken) => {
    const response = await fetch(`${API_BASE_URL}/api/event/${eventId}/enrollment`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    });

    if (!response.ok)
        throw new Error(await response.text());
};