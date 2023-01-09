import styles from './feedback.module.css'
import Link from 'next/link'

export default function Feedback (){
    return (
        <div className={styles.main}>
            <Link href="/">Back to Ajax Email Writer</Link>
            <iframe src="https://forms.gle/H4QXkhpvtky1gszH8" width="640" />
        </div>
    )
}
