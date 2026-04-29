import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import { productsApi, categoriesApi } from "@/api/endpoints";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { getProductImage } from "@/lib/productImages";
import type { ProductFilters } from "@/types";

const ALL = "__ALL__";

export function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 12 });
  const [searchInput, setSearchInput] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.list,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () => productsApi.list(filters),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, q: searchInput || undefined, page: 1 });
  };

  const updateFilter = (key: keyof ProductFilters, value: any) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden gradient-primary px-8 py-10 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" />
        <h1 className="text-4xl font-extrabold tracking-tight mb-1">Products</h1>
        <p className="text-white/70 text-lg">Browse our electronics catalog</p>
      </div>

      {/* Filters */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-1">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" className="gradient-primary border-0 shadow">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</Label>
              <Select
                value={filters.categoryId ?? ALL}
                onValueChange={(v) =>
                  updateFilter("categoryId", v === ALL ? undefined : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All categories</SelectItem>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Brand</Label>
              <Input
                placeholder="e.g. Apple"
                value={filters.brand ?? ""}
                onChange={(e) =>
                  updateFilter("brand", e.target.value || undefined)
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Min price</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Max price</Label>
              <Input
                type="number"
                placeholder="9999"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted" />
              <CardContent className="pt-4 space-y-2">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <Package className="h-14 w-14 mx-auto text-muted-foreground/40" />
          <p className="text-xl font-semibold text-muted-foreground">No products found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{data.items.length}</span> of{" "}
              <span className="font-semibold text-foreground">{data.total}</span> products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.items.map((p) => (
              <Card key={p.id} className="flex flex-col overflow-hidden card-hover border-border/60 group">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  {(() => {
                    const img = getProductImage(p.slug, p.imageUrl, p.category?.slug);
                    return img ? (
                      <img
                        src={img}
                        alt={p.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                        <Package className="h-12 w-12" />
                      </div>
                    );
                  })()}
                  {p.stock === 0 && (
                    <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                      <Badge variant="destructive">Out of stock</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="pt-4 flex-1">
                  <Badge variant="outline" className="mb-2 text-primary border-primary/30 bg-primary/5">
                    {p.brand}
                  </Badge>
                  <h3 className="font-semibold leading-tight mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-between pt-0 pb-4 px-4">
                  <span className="font-bold text-lg text-gradient">{formatPrice(p.price)}</span>
                  <Button
                    asChild
                    size="sm"
                    className="gradient-primary border-0 shadow-sm hover:shadow-md hover:opacity-90 transition-all"
                  >
                    <Link to={`/products/${p.id}`}>View</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {data.pages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-4">
              <Button
                variant="outline"
                disabled={data.page <= 1}
                onClick={() => updateFilter("page", data.page - 1)}
                className="hover:border-primary/50 hover:text-primary"
              >
                ← Previous
              </Button>
              <span className="px-4 py-2 text-sm font-medium bg-secondary rounded-lg">
                {data.page} / {data.pages}
              </span>
              <Button
                variant="outline"
                disabled={data.page >= data.pages}
                onClick={() => updateFilter("page", data.page + 1)}
                className="hover:border-primary/50 hover:text-primary"
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
