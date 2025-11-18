"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchProduct, deleteProduct } from "@/lib/api";
import { Product } from "@/types/product";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: Props) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id))
        .then(setProduct)
        .catch(() => router.push("/products"))
        .finally(() => setLoading(false));
    }
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm("Tem certeza?")) return;
    try {
      await deleteProduct(product!.id);
      router.push("/products");
    } catch {
      alert("Erro ao deletar");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Carregando...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Produto não encontrado
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          href="/products"
          className="text-blue-600 hover:text-blue-700 mb-6 inline-block"
        >
          ← Voltar
        </Link>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Image */}
            <div className="bg-gray-100 rounded-lg flex items-center justify-center h-96">
              <Image
                src={product.image}
                alt={product.title}
                width={300}
                height={300}
                className="object-contain"
              />
            </div>

            {/* Info */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h1>

              <p className="text-4xl font-bold text-gray-900">
                R$ {product.price.toFixed(2)}
              </p>

              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Categoria:</span>{" "}
                  <span className="capitalize">{product.category}</span>
                </p>
              </div>

              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description}
              </p>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-center font-semibold transition"
                >
                  Editar
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}