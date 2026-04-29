import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ShoppingCart, Package, Minus, Plus } from "lucide-react";
import { cartApi, productsApi } from "@/api/endpoints";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth";
import { formatPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/productImages";

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getById(id!),
    enabled: !!id,
  });

  const addToCart = useMutation({
    mutationFn: () => cartApi.addItem(product!.id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      navigate("/cart");
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message ?? "Failed to add to cart");
    },
  });

  const handleAddToCart = () => {
    if (!user) { navigate("/login"); return; }
    setError(null);
    addToCart.mutate();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        <div className="aspect-square bg-muted rounded-2xl" />
        <div className="space-y-4 pt-4">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="h-10 bg-muted rounded w-2/3" />
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 space-y-3">
        <Package className="h-14 w-14 mx-auto text-muted-foreground/40" />
        <p className="text-xl font-semibold">Product not found</p>
        <Button asChild variant="outline"><Link to="/">Back to products</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="hover:bg-primary/10 hover:text-primary -ml-2"
      >
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-muted border border-border/60 shadow-sm flex items-center justify-center">
          {(() => {
            const img = getProductImage(product.slug, product.imageUrl, product.category?.slug);
            return img ? (
              <img src={img} alt={product.name} className="object-cover w-full h-full" />
            ) : (
              <Package className="h-24 w-24 text-muted-foreground/30" />
            );
          })()}
        </div>

        {/* Info */}
        <div className="space-y-5 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
              {product.brand}
            </Badge>
            {product.category && (
              <Badge variant="secondary">{product.category.name}</Badge>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-3">{product.name}</h1>
            <p className="text-4xl font-bold text-gradient">{formatPrice(product.price)}</p>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">Availability:</span>
            {product.stock > 0 ? (
              <Badge variant="success" className="font-medium">
                ✓ {product.stock} in stock
              </Badge>
            ) : (
              <Badge variant="destructive">Out of stock</Badge>
            )}
          </div>

          {product.stock > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">Quantity:</span>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-40"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold min-w-[3rem] text-center border-x border-border">
                    {quantity}
                  </span>
                  <button
                    className="px-3 py-2 hover:bg-muted transition-colors disabled:opacity-40"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <Button
                className="w-full gradient-primary border-0 shadow-lg hover:shadow-xl hover:opacity-90 transition-all h-12 text-base font-semibold"
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
              >
                <ShoppingCart className="h-5 w-5" />
                {addToCart.isPending ? "Adding to cart..." : "Add to cart"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
