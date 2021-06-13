import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';

type Props = {
  children?: ReactNode;
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  url?: string;
  // og:type
  type?: string;
};

const defaultUrl = 'https://lakhan.me';

const Layout = ({
  children,
  title = 'Lakhan Samani',
  description = `Lakhan Samani | Software Engineer | Digital Work Space`,
  image = `/images/profile.jpg`,
  keywords = `lakhan, profile, digital garden`,
  url = `/`,
  type = 'website',
}: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <link rel="icon" href="favicon.ico" />
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:image" content={image} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={`${defaultUrl}/${url}`} />
      <meta property="twitter:card" content="summary" />
      <meta property="twitter:creator" content="lakhansamani" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
    </Head>
    <main>{children}</main>
  </div>
);

export default Layout;
