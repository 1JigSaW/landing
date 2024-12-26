import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const createLink = async () => {
    try {
        const response = await apiClient.post("create-link/");
        return response.data;
    } catch (error) {
        console.error("Error creating link:", error);
        throw new Error("Failed to create link");
    }
};

export const generateReview = async (uniqueLink, tags, language) => {
    try {
        const response = await apiClient.post("generate-review/", {
            tags,
            language,
        });
        return response.data;
    } catch (error) {
        console.error("Error generating review:", error);
        throw new Error("Failed to generate review");
    }
};


export const fetchLanguages = async () => {
    try {
        const response = await apiClient.get("languages/");
        return response.data;
    } catch (error) {
        console.error("Error fetching languages:", error);
        throw new Error("Failed to fetch languages");
    }
};

export const fetchTags = async () => {
    try {
        const response = await apiClient.get("tags/");
        return response.data;
    } catch (error) {
        console.error("Error fetching tags:", error);
        throw new Error("Failed to fetch tags");
    }
};
