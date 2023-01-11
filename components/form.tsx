import { Dispatch, SetStateAction, useState } from "react";
import styles from "./form.module.css";
import { ApiError } from "next/dist/server/api-utils";

interface FormProps {
    result: string | undefined;
    setResult: Dispatch<SetStateAction<undefined>>;
}

export default function Form({ result, setResult }: FormProps) {
    const [recipient, setRecipient] = useState('');
    const [organization, setOrganization] = useState('');
    const [description, setDescription] = useState('');
    const [sentences, setSentences] = useState('6');
    const [loading, setLoading] = useState(false);

    const [recipientError, setRecipientError] = useState('')
    const [organizationError, setOrganizationError] = useState('')
    const [descriptionError, setDescriptionError] = useState('')
    const [sentencesError, setSentencesError] = useState('')
    const [apiError, setAPIError] = useState('')

    const recipientRegex = /^[\w\-']{1,20}( [\w\-']{1,20}){0,5}$/;
    const organizationRegex = /^[\w\-']{1,20}( [\w\-']{1,20}){0,5}$/;
    const descriptionRegex = /^(([^.!?]|[^.!?][^.!?]*[.!?]){3,250}){1,5}$/;

    function validateForm() {
        resetValidation();
        let valid = true;
        if (!recipientRegex.test(recipient)) {
            setRecipientError('Invalid recipient name');
            valid = false;
        }
        if (!organizationRegex.test(organization) && organization.length > 0) {
            setOrganizationError('Invalid organization name');
            valid = false;
        }
        if (!descriptionRegex.test(description)) {
            setDescriptionError('Invalid description');
            valid = false;
        }
        if (isNaN(parseInt(sentences)) || parseInt(sentences) < 1 || parseInt(sentences) > 10) {
            setSentencesError('Invalid number of sentences');
            valid = false;
        }
        return valid;
    }

    function resetValidation() {
        setRecipientError('');
        setOrganizationError('');
        setDescriptionError('');
        setSentencesError('');
        setAPIError('');
    }

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (validateForm()) {
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
                        company: organization,
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
                setAPIError(error.message);
            }
        } else {
            console.log('invalid form');
        }
    }

    return (
        <div className={styles.emailForm}>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    name="recipient"
                    placeholder="Recipient"
                    value={recipient}
                    maxLength={20}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <div className={styles.formError}>{recipientError}</div>
                <input
                    type="text"
                    name="company"
                    placeholder="Organization (optional)"
                    value={organization}
                    maxLength={20}
                    onChange={(e) => setOrganization(e.target.value)}
                />
                <div className={styles.formError}>{organizationError}</div>
                <textarea
                    rows={4}
                    cols={50}
                    name="content"
                    placeholder="Message (2-3 sentences describing the purpose of the email)"
                    value={description}
                    maxLength={250}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className={styles.formError}>{descriptionError}</div>

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
                <div className={styles.formError}>{sentencesError}</div>

                <button type="submit" disabled={loading} >
                    {loading ? <div><span className={styles.loadingIcon}>🤖</span></div> : 'Create email'}
                </button>
                <p className={styles.formError}>{apiError}</p>
                {apiError && <a href="https://status.openai.com/" target="_blank">Check OpenAI status</a>}
            </form>
        </div>
    )
}