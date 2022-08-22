import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>A Cocktail Book</title>
      </Head>
      <main className={styles.main}>
        <h6 className="site-note">
          Just a simple cocktail recipe book for you to search and put down your
          notes.
        </h6>
      </main>
    </div>
  );
}
