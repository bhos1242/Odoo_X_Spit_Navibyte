import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import Image from "next/image";

interface HeroSectionProps {
  session: any;
}

export function HeroSection({ session }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]"></div>
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        <div className="aspect-1155/678 w-288.75 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-6">
        <div className="inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm font-medium text-muted-foreground backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
          New: Advanced Analytics Dashboard
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.1]">
          Master Your Inventory <br className="hidden sm:inline" />
          <span className="bg-linear-to-r from-primary to-violet-500 bg-clip-text text-transparent">
            Optimize Your Growth
          </span>
        </h1>

        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
          The all-in-one platform to manage warehouses, track stock movements, and forecast demand with precision. Built for modern businesses.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
          <Link href={session ? "/dashboard" : "/sign-up"}>
            <Button
              size="lg"
              className="w-full sm:w-auto gap-2 h-11 px-8 text-base rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
            >
              {session ? "Go to Dashboard" : "Start Free Trial"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-11 px-8 text-base rounded-full hover:bg-secondary/50"
            >
              View Demo
            </Button>
          </Link>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-12 relative w-full max-w-4xl mx-auto rounded-xl border bg-background/50 p-2 shadow-2xl backdrop-blur-sm lg:rounded-2xl lg:p-3">
          <div className="rounded-lg border bg-background overflow-hidden aspect-video relative">
             <Image 
               src="/hero.png" 
               alt="Dashboard Preview" 
               fill 
               className="object-cover"
               priority
             />
          </div>
        </div>
      </div>
    </section>
  );
}
