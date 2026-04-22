"use client"

import { Menu } from "lucide-react";
import { useRouter } from "next/navigation"
import Link from "next/link";


export default function Navbar() {
    const router = useRouter();
    return (
        <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 bg-surface-container/80 backdrop-blur-md h-16 border-b border-surface-container-highest">
            <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
                <div className="flex items-center gap-12">
                    <Link href="/">
                        <span className="text-lg font-black tracking-tighter text-on-surface uppercase">safeGrow</span> </Link>
                    <div className="hidden md:flex items-center gap-6">
                        {['Markets', 'Terminal', 'Portfolio', 'Analytics'].map((item) => (
                            <Link
                                key={item}
                                // href={`/${item.toLowerCase()}`}
                                href={`#${item.toLowerCase()}`}
                                className="text-xs font-medium text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/login")}
                        className="px-5 py-2 text-primary hover:bg-primary hover:text-white transition-all duration-300 rounded text-[10px] font-bold uppercase tracking-widest border border-primary/20 hover:border-primary cursor-pointer">
                        Execute Login
                    </button>
                    <button className="md:hidden text-on-surface">
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </nav>
    )
};