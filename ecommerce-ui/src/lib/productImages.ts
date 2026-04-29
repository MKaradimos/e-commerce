const imagesBySlug: Record<string, string> = {
  // Headphones
  "airpods-pro-2":     "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80",
  "sony-wh-1000xm5":   "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  // Smartphones
  "galaxy-s24":        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
  "iphone-15-pro":     "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
  // Laptops
  "lenovo-thinkpad-x1":"https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80",
  "dell-xps-15":       "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
  "macbook-pro-14":    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
};

const imagesByCategory: Record<string, string> = {
  headphones:  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
  smartphones: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
  laptops:     "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
};

export function getProductImage(
  slug: string,
  imageUrl: string | null | undefined,
  categorySlug?: string
): string | null {
  if (imageUrl) return imageUrl;
  if (imagesBySlug[slug]) return imagesBySlug[slug];
  if (categorySlug && imagesByCategory[categorySlug]) return imagesByCategory[categorySlug];
  return null;
}
