import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Setiap kali URL (pathname) berubah, paksa scroll ke (0, 0) alias paling atas
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}