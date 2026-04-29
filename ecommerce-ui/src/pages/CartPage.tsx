import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, ArrowLeft, ShoppingBag, Minus, Plus } from "lucide-react";
import { cartApi, ordersApi } from "@/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/productImages";
import { useState } from "react";

export function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.get,
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.updateItem(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: (err: any) =>
      setError(err.response?.data?.error?.message ?? "Update failed"),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => cartApi.removeItem(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const checkoutMutation = useMutation({
    mutationFn: ordersApi.checkout,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      navigate(`/checkout/${order.id}`);
    },
    onError: (err: any) =>
      setError(err.response?.data?.error?.message ?? "Checkout failed"),
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 bg-muted rounded-xl" />
        ))}
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <div className="h-24 w-24 rounded-full bg-muted mx-auto flex items-center justify-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
        </div>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground">Add some products to get started</p>
        <Button asChild className="gradient-primary border-0 shadow-md mt-2">
          <Link to="/">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary -ml-2">
          <Link to="/"><ArrowLeft className="h-4 w-4" /> Continue shopping</Link>
        </Button>
      </div>

      <h1 className="text-3xl font-extrabold">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {cart.items.map((item) => (
            <Card key={item.id} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="h-20 w-20 bg-muted rounded-xl flex-shrink-0 overflow-hidden">
                    {(() => {
                      const img = getProductImage(item.product.slug, item.product.imageUrl);
                      return img ? (
                        <img src={img} alt={item.product.name} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs">
                          No img
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="font-semibold hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">{item.product.brand}</p>
                    <p className="font-bold text-gradient">{formatPrice(item.product.price)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeMutation.mutate(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        className="px-2 py-1.5 hover:bg-muted transition-colors disabled:opacity-40"
                        onClick={() => {
                          if (item.quantity > 1)
                            updateMutation.mutate({ productId: item.productId, quantity: item.quantity - 1 });
                        }}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold border-x border-border min-w-[2.5rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2 py-1.5 hover:bg-muted transition-colors disabled:opacity-40"
                        onClick={() => {
                          if (item.quantity < item.product.stock)
                            updateMutation.mutate({ productId: item.productId, quantity: item.quantity + 1 });
                        }}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit sticky top-20 border-border/60 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate mr-2 max-w-[60%]">
                    {item.product.name} ×{item.quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    {formatPrice(Number(item.product.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-lg pt-3 border-t border-border">
              <span>Total</span>
              <span className="text-gradient">{formatPrice(cart.total)}</span>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              className="w-full gradient-primary border-0 shadow-lg hover:shadow-xl hover:opacity-90 transition-all h-11 font-semibold"
              onClick={() => checkoutMutation.mutate()}
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending ? "Processing..." : "Proceed to Checkout →"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
