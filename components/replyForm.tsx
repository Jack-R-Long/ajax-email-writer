import { Dispatch, SetStateAction, useState } from "react";
import styles from "./form.module.css";

interface FormProps {
    result: string | undefined;
    setResult: Dispatch<SetStateAction<undefined>>;
}

export default function ComposeForm({ result, setResult }: FormProps) {
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(false);

    const [replyError, setReplyError] = useState('')
    const [apiError, setAPIError] = useState('')

    function validateForm() {
        resetValidation();
        let valid = true;
        if (reply.length === 0 || reply.length > 500) {
            setReplyError('Invalid email');
            valid = false;
        }
        return valid;
    }

    function resetValidation() {
        setReplyError('');
        setAPIError('');
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (validateForm()) {
            try {
                setLoading(true);
                setResult(undefined)
                const response = await fetch("/api/reply", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        reply: reply,
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
                setAPIError(error.message);
            }
        } else {
            console.log('invalid form');
        }
    }

    return (
        <div className={styles.emailForm}>
            <form onSubmit={onSubmit}>
            <textarea
                    rows={20}
                    cols={200}
                    name="replyEmail"
                    placeholder="Paste the email you want to reply to here"
                    value={reply}
                    maxLength={500}
                    onChange={(e) => setReply(e.target.value)}
                />
                <div className={styles.formError}>{replyError}</div>

                <button type="submit" disabled={loading} >
                    {loading ? <div><span className={styles.loadingIcon}>🤖</span></div> : 'Create email'}
                </button>
                <p className={styles.formError}>{apiError}</p>
                {apiError && <a href="https://status.openai.com/" target="_blank">Check OpenAI status</a>}
            </form>
        </div>
    )
}