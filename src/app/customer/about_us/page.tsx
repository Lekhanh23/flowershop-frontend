import styles from './page.module.css';

export default function AboutPage() {
	return (
		<div>
			<div className={styles.pageWrapper}>
				<div className={styles.aboutCard}>
				<h1 className={styles.heading}>About Flower Shop</h1>

				<div>
					<h2 className={styles.sectionTitle}>Our Story</h2>
					<p className={styles.bodyText}>
						Founded in 2023, Flower Shop was born from a passion for bringing beauty and joy to every occasion.
						We believe flowers are more than just gifts—they are a language of love, celebration, and comfort.
						Our mission is to deliver fresh, stunning arrangements that make every moment memorable.
					</p>
				</div>

				<div>
					<h2 className={styles.sectionTitle}>What We Offer</h2>
					<p className={styles.bodyText}>
						From classic bouquets to modern floral designs, we offer a wide range of flowers for all occasions—
						birthdays, anniversaries, weddings, and more. Our team carefully selects each bloom to ensure quality
						and freshness, and we pride ourselves on fast, reliable delivery.
					</p>
				</div>

				<div>
					<h2 className={styles.sectionTitle}>Meet Our Team</h2>
					<div className={styles.teamGrid}>
						<div className={styles.teamCard}>
							<div className={styles.avatarPlaceholder} />
							<div className={styles.teamName}>Hoang Huong Chi</div>
							<div className={styles.teamRole}>Head Florist</div>
						</div>
						<div className={styles.teamCard}>
							<div className={styles.avatarPlaceholder} />
							<div className={styles.teamName}>Thai Ha Trang</div>
							<div className={styles.teamRole}>Delivery Manager</div>
						</div>
						<div className={styles.teamCard}>
							<div className={styles.avatarPlaceholder} />
							<div className={styles.teamName}>Nguyen Thi Van</div>
							<div className={styles.teamRole}>Customer Care</div>
						</div>
					</div>
				</div>
				</div>
			</div>
		</div>
	);
}
