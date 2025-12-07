"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import { getImageUrl, formatPrice } from "@/lib/utils";

const products = [
  { id: 1, title: 'Red Rose Bouquet', price: '450.000 VND', image: 'red-rose.jpg'}, 
  { id: 2, title: 'Romantic Mixed Roses', price: '560.000 VND', image: 'mixed-roses.jpg'}, 
  { id: 3, title: 'Sunflower Sunshine', price: '390.000 VND', image: 'sunflower.jpg'}, 
  { id: 4, title: 'Mixed Tulip Delight', price: '470.000 VND', image: 'tulip.jpg'}, 
  { id: 5, title: 'Pink Carnation Love', price: '430.000 VND', image: 'carnation.jpg'}, 
  { id: 6, title: 'Orchid Grace', price: '600.000 VND', image: 'orchid.jpg'}
]

export default function Page() {
  return (
    <main className={styles.pageWrapper}>

      <div className={styles.containerTitle}>
        <div className={styles.subtitlePill}>Women's Collection</div>
        <h1 className={styles.heroTitle}>EXPLORE OUR FLOWER COLLECTION<br/>FOR WOMEN'S OCCASIONS</h1>
      </div>

      <section className={styles.grid}>
        {products.map(p => (
          <article key={p.id} className={styles.card}>
            <div className={styles.cardImage}>
                <img src={getImageUrl(p.image)} alt={p.title} />
            </div>
            <a className={styles.cardTitle} href={`/product/${p.id}`}>{p.title}</a>
            <div className={styles.cardPrice}>{p.price}</div>
          </article>
        ))}
      </section>
    </main>
  )
}
