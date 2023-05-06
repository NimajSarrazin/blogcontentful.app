import { Html, Head, Main, NextScript } from 'next/document'


export const metadata = {
  title: "Readit_APP",
};

export default function Document() {
  return (
    <Html lang="fr">
      <Head />
      <title> Readit | App</title>
      <meta name="description" content="Blog app by benjamin on Nextjs" />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
