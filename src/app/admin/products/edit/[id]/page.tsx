"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) return;
    api.get(`/admin/products/${id}`).then(res => {
      setProduct(res.data);
    }).catch(console.error);
  }, [id]);

  if (!product) return <div style={{padding: 40, textAlign:'center'}}>Loading product...</div>;

  return <ProductForm initialData={product} isEditMode={true} />;
}