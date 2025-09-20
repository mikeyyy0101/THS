const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function addToCartApi({ userId, productId, size, quantity = 1 }) {
  const res = await fetch(`${API_BASE}/api/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId, size, quantity }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown" }));
    throw new Error(err.error || "Failed to add to cart");
  }
  return res.json(); // { items: [...] }
}
