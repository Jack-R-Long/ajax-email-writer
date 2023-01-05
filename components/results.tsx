import styles from './results.module.css'
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
            <button onClick={() => navigator.clipboard.writeText(data || "")}>
                Copy
            </button>
        </div>
    )
}