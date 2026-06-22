import { CheckoutForm } from "../../../components/checkout/CheckoutForm";
import { OrderSummary } from "../../../components/checkout/OrderSummary";

export default function CheckoutPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-heading-lg font-heading">Checkout</h1>
        <CheckoutForm />
      </div>
      <OrderSummary />
    </div>
  );
}
