import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel='stylesheet' type='text/css' href='/css/light-theme.css' />
        <link rel='stylesheet' type='text/css' href='/css/index.css' />
        <link rel='stylesheet' type='text/css' href='/css/nprogress.css' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
