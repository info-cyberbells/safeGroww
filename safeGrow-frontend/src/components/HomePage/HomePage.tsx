"use client";

import Navbar from "./Navbar";
import Hero from "./Herosection";
import Ticker from "./Ticker";
import Features from "./Features";
import Security from "./Security";
import CTA from "./CTA";
import Footer from "./Footer";

// --- Main App ---

export default function Homepage() {
    return (
        <div className="min-h-screen selection:bg-primary/30">
            <Navbar />
            <main className="pb-24">
                <Hero />
                <Features />
                <Security />
                <CTA />
            </main>
            <Ticker />
            <Footer />
        </div>
    );
}

