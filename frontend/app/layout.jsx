import "./globals.css";

export const metadata = {
  title: "Course Directory",
  description: "Browse and add training courses",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
