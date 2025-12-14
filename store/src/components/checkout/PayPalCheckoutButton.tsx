'use client';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function PayPalCheckoutButton() {
    const { cartTotal, clearCart } = useCart();
    const router = useRouter();

    const initialOptions = {
        clientId: "test", // 'test' works for sandbox/development usually, or user needs to replace
        currency: "USD",
        intent: "capture",
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
                style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                createOrder={(data, actions) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: "USD",
                                    value: cartTotal.toFixed(2),
                                },
                                description: "Compra en ArchStore",
                            },
                        ],
                    });
                }}
                onApprove={async (data, actions) => {
                    if (actions.order) {
                        const order = await actions.order.capture();
                        console.log("Order successful:", order);
                        clearCart();
                        router.push("/checkout/success");
                    }
                }}
                onError={(err) => {
                    console.error("PayPal Checkout Error:", err);
                    alert("Hubo un error al procesar el pago. Por favor intenta de nuevo.");
                }}
            />
        </PayPalScriptProvider>
    );
}
