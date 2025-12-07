"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { getImageUrl, formatPrice } from "@/lib/utils";

const products = [
  { id: 1, title: 'Red Rose Bouquet', price: '450.000 VND', img: 'https://images.unsplash.com/photo-1520975913201-0f09d6c8a6b6?w=800&q=80' },
  { id: 2, title: 'Romantic Mixed Roses', price: '560.000 VND', img: 'https://images.unsplash.com/photo-1505576391880-5e3fbbd3a5d1?w=800&q=80' },
  { id: 3, title: 'Sunflower Sunshine', price: '390.000 VND', img: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80' },
  { id: 4, title: 'Mixed Tulip Delight', price: '470.000 VND', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80' },
  { id: 5, title: 'Pink Carnation Love', price: '430.000 VND', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80' },
  { id: 6, title: 'Orchid Grace', price: '600.000 VND', img: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80' }
]

export default function Page() {
  return (
    <main className={styles.pageWrapper}>

      <div className={styles.containerTitle}>
        <div className={styles.subtitlePill}>Anniversary Collection</div>
        <h1 className={styles.heroTitle}>EXPLORE OUR FLOWER COLLECTION<br/>FOR BIRTHDAY OCCASIONS</h1>
      </div>

      <section className={styles.grid}>
        {products.map(p => (
          <article key={p.id} className={styles.card}>
            <div className={styles.cardImage}>
              <img src={p.img} alt={p.title} />
            </div>
            <a className={styles.cardTitle} href={`/product/${p.id}`}>{p.title}</a>
            <div className={styles.cardPrice}>{p.price}</div>
          </article>
        ))}
      </section>
    </main>
  )
}
