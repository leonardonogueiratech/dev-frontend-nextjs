"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts, deleteProduct } from "@/lib/api";
import { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Deletar este produto?")) return;

    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert("Erro ao deletar");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Produtos</h1>
          <Link
            href="/products/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            + Novo
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 text-gray-500">Carregando...</div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
              >
                {/* Image */}
                <div className="bg-gray-100 h-48 relative">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-gray-900 line-clamp-2">
                    {product.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-gray-900">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <p className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded capitalize">
                      {product.category}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded text-center text-sm font-medium transition"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-center text-sm font-medium transition"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm font-medium transition"
                    >
                      Deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}