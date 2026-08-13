 import { getShortUrl } from "../dao/short_url.js"
import { createShortUrlWithoutUser, createShortUrlWithUser } from "../services/short_url.service.js"
import wrapAsync from "../utils/tryCatchWrapper.js"

export const createShortUrl = wrapAsync(async (req, res) => {
    const { url, slug } = req.body;
    
    // Extra spaces clean karein
    const cleanUrl = url ? url.trim() : "";
    const cleanSlug = slug ? slug.trim() : "";

    let shortUrl;
    if (req.user) {
        shortUrl = await createShortUrlWithUser(cleanUrl, req.user._id, cleanSlug);
    } else {  
        shortUrl = await createShortUrlWithoutUser(cleanUrl, cleanSlug);
    }

    // Trailing slash issue handle karne ke liye clean base URL formatting
    const baseUrl = process.env.APP_URL.trim().replace(/\/$/, "");
    res.status(200).json({ shortUrl: `${baseUrl}/${shortUrl.trim()}` });
});

export const redirectFromShortUrl = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const url = await getShortUrl(id.trim());
    if (!url) throw new Error("Short URL not found");

    let targetUrl = (url.full_url || url.url || "").trim();

    // Protocol check: Agar http:// ya https:// na ho toh add karein
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = `https://${targetUrl}`;
    }

    res.redirect(targetUrl);
});

export const createCustomShortUrl = wrapAsync(async (req, res) => {
    const { url, slug } = req.body;
    const cleanUrl = url ? url.trim() : "";
    const cleanSlug = slug ? slug.trim() : "";

    // Variable reference error fixed (customUrl ki jagah cleanSlug)
    const shortUrl = await createShortUrlWithoutUser(cleanUrl, cleanSlug);
    
    const baseUrl = process.env.APP_URL.trim().replace(/\/$/, "");
    res.status(200).json({ shortUrl: `${baseUrl}/${shortUrl.trim()}` });
});