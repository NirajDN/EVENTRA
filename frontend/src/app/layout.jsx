import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Eventra",
    description: "Your perfect wedding vendor platform",
};

import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../components/ThemeProvider';

export default function RootLayout({
    children,
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 dark:text-white transition-colors duration-300`}
            >
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Navbar />
                        <main className="min-h-screen dark:bg-gray-900">
                            {children}
                        </main>
                        <Toaster position="top-center" />
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
