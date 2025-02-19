"use client";
import Link from "next/link"
import { Globe } from "lucide-react"

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Documentation", "Updates"]
  },
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Press"]
  },
  {
    title: "Resources",
    links: ["Support", "Contact", "Privacy", "Terms"]
  }
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Globe className="h-6 w-6" />
              <span className="text-xl font-bold text-white">Taskdrawer</span>
            </Link>
            <p className="text-sm">
              Making workflow management easier and more efficient for teams worldwide.
            </p>
          </div>
          {footerLinks.map((column, index) => (
            <div key={index}>
              <h3 className="font-semibold text-white mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href="#" className="hover:text-white transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Taskdrawer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}