import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  Package,
  ShieldCheck,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { ordersApi, paymentsApi } from "@/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";

const statusVariant = (status: OrderStatus) => {
  switch (status) {
    case "PAID":      return "success" as const;
    case "PENDING":   return "secondary" as const;
    case "CANCELLED": return "destructive" as const;
    default:          return "default" as const;
  }
};

function formatCardNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

function getCardBrand(number: string) {
  const n = number.replace(/\s/g, "");
  if (n.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return null;
}

function CardBrandIcon({ brand }: { brand: string | null }) {
  if (brand === "visa") return (
    <span className="text-[10px] font-extrabold tracking-widest text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">VISA</span>
  );
  if (brand === "mastercard") return (
    <span className="flex gap-0.5">
      <span className="h-5 w-5 rounded-full bg-red-500 opacity-90" />
      <span className="h-5 w-5 rounded-full bg-yellow-400 opacity-90 -ml-2.5" />
    </span>
  );
  if (brand === "amex") return (
    <span className="text-[10px] font-extrabold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">AMEX</span>
  );
  return <CreditCard className="h-4 w-4 text-muted-foreground" />;
}

type Step = "payment" | "processing" | "success";

export function CheckoutPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>("payment");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry]         = useState("");
  const [cvv, setCvv]               = useState("");
  const [cardholder, setCardholder] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => ordersApi.getById(orderId!),
    enabled: !!orderId,
  });

  const payMutation = useMutation({
    mutationFn: () => paymentsApi.pay(orderId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      setStep("success");
    },
  });

  // If already paid (e.g. page refresh), jump straight to success
  const isPaid = order?.status === "PAID" || step === "success";

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!cardholder.trim()) errors.cardholder = "Required";
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 16) errors.cardNumber = "Enter a valid 16-digit card number";
    const parts = expiry.split("/");
    if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2)
      errors.expiry = "MM/YY format required";
    if (cvv.length < 3) errors.cvv = "3 or 4 digits required";
    return errors;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    setFieldErrors({});
    setStep("processing");
    setTimeout(() => payMutation.mutate(), 1800);
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
        <div className="h-32 bg-muted rounded-2xl" />
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 space-y-3">
        <Package className="h-14 w-14 mx-auto text-muted-foreground/40" />
        <p className="text-xl font-semibold">Order not found</p>
        <Button asChild variant="outline"><Link to="/">Go home</Link></Button>
      </div>
    );
  }

  /* ── SUCCESS ── */
  if (isPaid) {
    return (
      <div className="max-w-lg mx-auto py-8 space-y-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-14 w-14 text-green-600" />
            </div>
            <span className="absolute inset-0 rounded-full animate-ping bg-green-200 opacity-40" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-green-800">Payment Successful!</h1>
            <p className="text-muted-foreground mt-1">
              Thank you for your purchase. Your order is confirmed.
            </p>
          </div>
        </div>

        <Card className="border-border/60 shadow-md text-left">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Order #{order.id.slice(0, 8).toUpperCase()}</CardTitle>
              <Badge variant="success">PAID</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm py-2 border-b border-border/40 last:border-0">
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-muted-foreground text-xs">{formatPrice(item.unitPrice)} × {item.quantity}</p>
                </div>
                <span className="font-semibold">{formatPrice(Number(item.unitPrice) * item.quantity)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-base pt-3 border-t border-border">
              <span>Total paid</span>
              <span className="text-gradient">{formatPrice(order.totalAmount)}</span>
            </div>
          </CardContent>
        </Card>

        <Button asChild className="w-full gradient-primary border-0 shadow-md h-11">
          <Link to="/">← Continue shopping</Link>
        </Button>
      </div>
    );
  }

  /* ── PROCESSING ── */
  if (step === "processing") {
    return (
      <div className="max-w-lg mx-auto py-20 flex flex-col items-center gap-6 text-center">
        <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center shadow-xl">
          <Loader2 className="h-10 w-10 text-white animate-spin" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Processing payment...</h2>
          <p className="text-muted-foreground mt-1">Please wait, do not close this page.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-green-600" />
          Secured by 256-bit SSL encryption
        </div>
      </div>
    );
  }

  /* ── PAYMENT FORM ── */
  const cardBrand = getCardBrand(cardNumber);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Link to="/cart" className="hover:text-primary transition-colors">Cart</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-semibold text-foreground">Payment</span>
        </div>
        <h1 className="text-3xl font-extrabold">Secure Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Payment form ── */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Card details
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-widest text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">VISA</span>
                  <span className="flex gap-0.5">
                    <span className="h-4 w-4 rounded-full bg-red-500 opacity-90" />
                    <span className="h-4 w-4 rounded-full bg-yellow-400 opacity-90 -ml-2" />
                  </span>
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">AMEX</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePay} className="space-y-4">
                {/* Cardholder */}
                <div className="space-y-1.5">
                  <Label htmlFor="cardholder" className="text-sm font-semibold">Cardholder name</Label>
                  <Input
                    id="cardholder"
                    placeholder="John Smith"
                    value={cardholder}
                    onChange={(e) => setCardholder(e.target.value)}
                    className={`h-11 ${fieldErrors.cardholder ? "border-destructive" : ""}`}
                  />
                  {fieldErrors.cardholder && <p className="text-xs text-destructive">{fieldErrors.cardholder}</p>}
                </div>

                {/* Card number */}
                <div className="space-y-1.5">
                  <Label htmlFor="cardNumber" className="text-sm font-semibold">Card number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className={`h-11 pr-12 font-mono tracking-widest ${fieldErrors.cardNumber ? "border-destructive" : ""}`}
                      inputMode="numeric"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CardBrandIcon brand={cardBrand} />
                    </div>
                  </div>
                  {fieldErrors.cardNumber && <p className="text-xs text-destructive">{fieldErrors.cardNumber}</p>}
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="expiry" className="text-sm font-semibold">Expiry date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      className={`h-11 font-mono ${fieldErrors.expiry ? "border-destructive" : ""}`}
                      inputMode="numeric"
                      maxLength={5}
                    />
                    {fieldErrors.expiry && <p className="text-xs text-destructive">{fieldErrors.expiry}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cvv" className="text-sm font-semibold">CVV</Label>
                    <div className="relative">
                      <Input
                        id="cvv"
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        className={`h-11 font-mono ${fieldErrors.cvv ? "border-destructive" : ""}`}
                        inputMode="numeric"
                        type="password"
                        maxLength={4}
                      />
                    </div>
                    {fieldErrors.cvv && <p className="text-xs text-destructive">{fieldErrors.cvv}</p>}
                  </div>
                </div>

                {/* Security note */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 rounded-lg px-3 py-2.5">
                  <Lock className="h-3.5 w-3.5 text-green-600 shrink-0" />
                  Your payment information is encrypted and never stored.
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gradient-primary border-0 shadow-lg hover:opacity-90 transition-all h-12 text-base font-semibold"
                >
                  <Lock className="h-4 w-4" />
                  Pay {formatPrice(order.totalAmount)}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              SSL Secured
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-blue-600" />
              PCI Compliant
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Buyer Protected
            </div>
          </div>
        </div>

        {/* ── Order summary ── */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Order summary</CardTitle>
                <Badge variant={statusVariant(order.status)} className="text-xs">
                  {order.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm py-2 border-b border-border/40 last:border-0">
                  <div className="min-w-0 mr-2">
                    <p className="font-medium truncate">{item.productName}</p>
                    <p className="text-muted-foreground text-xs">{formatPrice(item.unitPrice)} × {item.quantity}</p>
                  </div>
                  <span className="font-semibold shrink-0">{formatPrice(Number(item.unitPrice) * item.quantity)}</span>
                </div>
              ))}

              <div className="space-y-1.5 pt-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
                <span>Total</span>
                <span className="text-gradient">{formatPrice(order.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
