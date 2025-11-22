import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Box } from "lucide-react";
import { Session } from "next-auth"; // Assuming next-auth types, or I can use any if not strict

interface SiteHeaderProps {
  session: any; // Using any for now to avoid type issues if Session type isn't readily available in context
}

export function SiteHeader({ session }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Box className="h-5 w-5" />
          </div>
          <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            IMS
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            href="#features"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#solutions"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Solutions
          </Link>
          <Link
            href="#pricing"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          {session && (
            <Link
              href="/dashboard"
              className="text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {session ? (
            <Link href="/dashboard">
              <Button size="sm" className="rounded-full px-6">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="rounded-full px-6 shadow-lg shadow-primary/20">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
