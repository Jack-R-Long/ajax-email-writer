import styles from './results.module.css'
import Link from 'next/link'
interface Props {
    data: string | undefined;
}

export default function Results({ data }: Props) {
    if (!data) return null;

    return (
        <div className={styles.results}>
            <pre title="Copy this text" className="results">
                {data}
            </pre>
            <div className={styles.buttonContainer}>
                <button onClick={() => navigator.clipboard.writeText(data || "")}>
                    Copy
                </button>
                <Link href="/feedback" className={styles.feedbackLink}>
                    <button>
                        Provide Feedback 🙏
                    </button>
                </Link>
            </div>
        </div>
    )
}