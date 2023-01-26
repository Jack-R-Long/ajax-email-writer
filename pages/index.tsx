import Head from "next/head";
import { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";
import Results from "../components/results";
import ComposeForm from "../components/composeForm";
import ReplyForm from "../components/replyForm";

export default function Home() {

  const [type, setType] = useState("");
  const replyBtn = useRef<HTMLButtonElement>(null);
  const composeBtn = useRef<HTMLButtonElement>(null);;
  const [result, setResult] = useState();

  useEffect(() => {
    setResult(undefined);
    if (replyBtn.current === null || composeBtn.current === null) return;
    if (type === "reply") {
      replyBtn.current.classList.add(styles.active);
      composeBtn.current.classList.remove(styles.active);
    } else if (type === "compose") {
      composeBtn.current.classList.add(styles.active);
      replyBtn.current.classList.remove(styles.active);
    } else {
      replyBtn.current.classList.remove(styles.active);
      composeBtn.current.classList.remove(styles.active);
    }
  }, [type])



  return (
    <div>
      <Head>
        <title>Ajax Email Writer</title>
      </Head>

      <main className={styles.main}>
        <h3>✍️ Ajax Email Writer</h3>
        <div className={styles.buttonGroup}>
          <button className={styles.stateBtn} ref={replyBtn} onClick={() => setType("reply")}>Reply</button>
          <button className={styles.stateBtn} ref={composeBtn} onClick={() => setType("compose")}>Compose</button>
        </div>
        {type === "reply" && <ReplyForm result={result} setResult={setResult} />}
        {type === "compose" && <ComposeForm result={result} setResult={setResult} />}
        <Results data={result} />
      </main>
    </div>
  );
}
