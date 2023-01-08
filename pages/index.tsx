import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import Results from "../components/results";
import Form from "../components/form";

export default function Home() {

  const [result, setResult] = useState();


  return (
    <div>
      <Head>
        <title>Ajax Email Writer</title>        
      </Head>

      <main className={styles.main}>
        <h3>✍️ Ajax Email Writer</h3>
        <Form result={result} setResult={setResult} />

        <Results data={result} />
      </main>
    </div>
  );
}
