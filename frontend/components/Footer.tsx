'user client'

import Link from "next/link"

export default function Footer() {
    return (
        <footer className="border-t border-gray-700 bg-gray-800 text-gray-400 mt-auto">
            <div className="mx-auto max-w-5xl px-8 py-8 flex flex-col gap-3 text-sm">
                <p className="text-gray-400">
                    A ProtonDB-inspired archive of Linux game compatibility reports, built as a student
                    project by team <span className="text-pink-300 font-medium">retake</span>.
                </p>
                <p className="text-gray-400"> 
                    Contributors: annie, sundae, enis.
                </p>
                <p className="text-gray-400">
                    This site is a non-commercial student project with no affiliation to Valve or Steam.
                </p>
                <p className="text-gray-400">
                    Built with Next.js and Spring Boot.
                </p>
            </div>
        </footer>
    )
}