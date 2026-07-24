import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "Atlas – lær land, flagg og hovedsteder";
const description =
  "En enkel geografiøvelse med 196 land, ni svaralternativer og tre quizmoduser.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = `${protocol}://${host}/og.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "nb_NO",
      images: [{ url: imageUrl, width: 1730, height: 909, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb">
      <body>{children}</body>
    </html>
  );
}
