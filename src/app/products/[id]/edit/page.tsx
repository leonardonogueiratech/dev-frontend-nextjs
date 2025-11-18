"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchProduct, updateProduct } from "@/lib/api";
import { Product } from "@/types/product";

type FormData = Omit<Product, "id">;

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditPage({ params }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [id, setId] = useState("");
  const [form, setForm] = useState<FormData>({
    title: "",
    price: 0,
    description: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id))
        .then((product) => {
          setForm({
            title: product.title,
            price: product.price,
            description: product.description,
            category: product.category,
            image: product.image,
          });
        })
        .catch(() => router.push("/products"))
        .finally(() => setLoading(false));
    }
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.description || !form.category || !form.image) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setSubmitting(true);
      await updateProduct(parseInt(id), form);
      router.push(`/products/${id}`);
    } catch (err) {
      alert("Erro ao atualizar");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          href={`/products/${id}`}
          className="text-blue-600 hover:text-blue-700 mb-6 inline-block"
        >
          ← Voltar
        </Link>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Editar Produto
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Título
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preço (R$)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoria
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="">Selecione</option>
                <option value="electronics">Eletrônicos</option>
                <option value="jewelery">Joias</option>
                <option value="men's clothing">Roupas Masculinas</option>
                <option value="women's clothing">Roupas Femininas</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL da Imagem
              </label>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition"
              >
                {submitting ? "Salvando..." : "Salvar"}
              </button>
              <Link
                href={`/products/${id}`}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-3 rounded-lg text-center font-semibold transition"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}