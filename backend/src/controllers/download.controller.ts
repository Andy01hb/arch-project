import { Request, Response } from "express";
import { generatePresignedDownloadUrl } from "../services/s3.service";
import { OrderService } from "../services/order.service";
import logger from "../utils/logger";

const orderService = new OrderService();

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

export const generateDownloadLink = async (req: Request, res: Response) => {
    try {
        const { orderId, productId } = req.body;

        if (!orderId || !productId) {
            return res.status(400).json({
                error: "Missing required fields: orderId and productId"
            });
        }

        // Verify order exists and is completed
        const order = await orderService.getOrderById(orderId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (order.status !== 'completed') {
            return res.status(403).json({
                error: "Order is not completed. Payment may still be processing."
            });
        }

        // Verify product is in the order
        const productInOrder = order.items.find(
            item => item.productId === productId
        );

        if (!productInOrder) {
            return res.status(403).json({
                error: "Product not found in this order"
            });
        }

        // Generate presigned URL for the product file
        // In production, this should map to actual S3 file keys
        const fileKey = `products/${productId}.dwg`;

        try {
            const downloadUrl = await generatePresignedDownloadUrl(fileKey);

            logger.info(`Download link generated for order ${orderId}, product ${productId}`);

            res.json({
                downloadUrl,
                productName: productInOrder.productName,
                expiresIn: 900 // 15 minutes
            });
        } catch (s3Error) {
            logger.error("S3 error generating download link:", s3Error);
            // If S3 is not configured, return a mock URL for testing
            if (process.env.NODE_ENV === 'development') {
                res.json({
                    downloadUrl: `/mock-download/${productId}`,
                    productName: productInOrder.productName,
                    expiresIn: 900,
                    note: "Mock URL - S3 not configured"
                });
            } else {
                throw s3Error;
            }
        }
    } catch (error) {
        logger.error("Error generating download link:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

