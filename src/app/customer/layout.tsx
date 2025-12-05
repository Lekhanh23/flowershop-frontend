import { HeaderCustomer } from "@/components/HeaderCustomer";
import { Footer } from "@/components/Footer";
import React from "react";

export default function CustomerLayout ({
    children,
} : {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <HeaderCustomer></HeaderCustomer>
            <main className="flex-grow">
                {children}
            </main>
            <Footer></Footer>
        </div>
    )
}