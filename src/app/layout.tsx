import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crop Doctor | फसल डॉक्टर",
  description: "AI-powered crop disease diagnosis for Indian farmers. Upload a photo and get instant analysis.",
  keywords: "crop disease, plant disease, farming India, फसल रोग, kisan, agriculture AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}