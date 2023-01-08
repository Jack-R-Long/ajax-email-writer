import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="icon" href="/favicon.png" />
                <meta property="og:title" content="Ajax Email Writer" />
                <meta property="og:description"
                    content="AI powered email writer.  Create a new email in seconds!" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://ajaxemail.xyz" />
                <meta property="og:image" content="/ajax_screenshot.png" />

            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}