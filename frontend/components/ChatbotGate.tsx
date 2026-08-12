'use client'

import { usePathname } from "next/navigation";
import Chatbot from "./Chatbot";

const HIDDEN_ROUTES = ['/login', '/register'];

export default function ChatbotGate() {
    const pathname = usePathname();

    if (HIDDEN_ROUTES.includes(pathname)) return null;
    return <Chatbot/>
}