import { Product } from "@/types/product";

const API_URL = "https://fakestoreapi.com";

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) throw new Error("Erro ao buscar produtos");
  return response.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error("Produto não encontrado");
  return response.json();
}

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao criar produto");
  return response.json();
}

export async function updateProduct(
  id: number,
  data: Omit<Product, "id">
): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erro ao atualizar produto");
  return response.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao deletar produto");
}