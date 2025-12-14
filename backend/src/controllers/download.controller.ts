import { Request, Response } from "express";
import { generatePresignedDownloadUrl } from "../services/s3.service";

export const getDownloadLink = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        // TODO: Verify if user has purchased the product (Check DB/Orders)
        // const userId = req.user.id;
        // const hasPurchased = await checkPurchase(userId, productId);
        // if (!hasPurchased) return res.status(403).json({ error: "Forbidden" });

        // Mock file key for now (in real app, get from DB based on productId)
        const fileKey = `products/${productId}.dwg`;

        const url = await generatePresignedDownloadUrl(fileKey);
        res.json({ url });
    } catch (error) {
        console.error("Error generating download link:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
