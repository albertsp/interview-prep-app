import { AuthProvider } from "@/context/AuthContext";
import "@/index.css";

export const metadata = {
  title: "InterviewKit",
  description: "Practica para tu próxima entrevista técnica",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
