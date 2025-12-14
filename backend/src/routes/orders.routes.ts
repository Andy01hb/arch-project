import { Router } from 'express';
import { createOrder, getOrder, getAllOrders, updateOrderStatus } from '../controllers/orders.controller';

const router = Router();

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;
