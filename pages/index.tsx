import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import Results from "../components/results";
import { loadStaticPaths } from "next/dist/server/dev/static-paths-worker";

export default function Home() {
  const [recipient, setRecipient] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [sentences, setSentences] = useState("6");
  const [result, setResult] = useState();
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      setResult(undefined)
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: recipient,
          company: company,
          description: description,
          sentences: sentences,
        }),
      });

      const data = await response.json();
      setLoading(false);
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
    } catch (error) {
      // TODO - better error handling
      console.error(error);
      // @ts-ignore
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Ajax Writer</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3>✍️ Ajax Writer</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="recipient"
            placeholder="Recipient (Mr. Tim Long)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="text"
            name="company"
            placeholder="Company (Smart Caregiver)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <textarea
            rows={4}
            cols={50}
            name="content"
            placeholder="Purpose (I am writing to apply for the position of Senior Software Engineer)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="sentences">{sentences} sentences</label>
          <input
            type="range"
            id="sentences"
            name="sentences"
            min={2}
            max={10}
            step={1}
            value={sentences}
            onChange={(e) => setSentences(e.target.value)}
          />
          <input type="submit" value={loading ? 'loading' : 'Create email'} disabled={loading}/>
        </form>
        {/* <div className={styles.result}>{result}</div> */}
        <Results data={result} />

      </main>
    </div>
  );
}
