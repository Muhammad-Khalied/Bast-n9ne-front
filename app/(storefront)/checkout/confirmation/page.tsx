import OrderConfirmation from "../../../../components/checkout/OrderConfirmation";

export default function ConfirmationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-heading-lg font-heading">Order Confirmed</h1>
      <OrderConfirmation />
    </div>
  );
}
