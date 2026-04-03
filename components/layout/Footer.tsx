import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-1">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Green Academy"
                width={480}
                height={108}
                className="h-16 w-auto"
              />
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              A modern learning platform. Discover courses from expert
              instructors and grow your skills.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Platform
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Browse courses", href: "/courses" },
                { label: "Teach on Green Academy", href: "/register" },
                { label: "Pricing", href: "/pricing" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Resources
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Help center", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Community", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
            </h4>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Privacy policy", href: "#" },
                { label: "Terms of service", href: "#" },
                { label: "Cookie policy", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Green Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>Built with Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
