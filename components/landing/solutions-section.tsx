import { Zap, Layers, CheckCircle2 } from "lucide-react";

export function SolutionsSection() {
  return (
    <section id="solutions" className="bg-muted/30 py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Why choose IMS?
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-none">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Zap className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Lightning Fast Performance</h3>
                  <p className="text-muted-foreground mt-1">
                    Built on Next.js 14, our platform delivers instant page loads and real-time updates, ensuring your team never waits.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Layers className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Seamless Integration</h3>
                  <p className="text-muted-foreground mt-1">
                    Connects easily with your existing ERP, accounting software, and e-commerce platforms via our robust API.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg">99.9% Accuracy</h3>
                  <p className="text-muted-foreground mt-1">
                    Eliminate human error with barcode scanning support and automated validation checks for all stock moves.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-tr from-primary/20 to-transparent rounded-2xl blur-2xl"></div>
            <div className="relative rounded-2xl border bg-background p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <h4 className="font-semibold">Recent Activity</h4>
                  <span className="text-xs text-muted-foreground">Live</span>
                </div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                      <div className="h-3 w-1/2 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
