 import axiosInstance from "../utils/axiosInstance"

export const createShortUrl = async (url, slug) => {
    // Both url and slug should be trimmed to remove extra spaces
    const payload = {
        url: url.trim(),
        slug: slug ? slug.trim() : undefined
    };

    const { data } = await axiosInstance.post("/api/create", payload);
    return data.shortUrl;
}