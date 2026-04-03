"use client";

import { trpc } from "@/lib/trpc/client";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Check, Zap, Crown, Sparkles, Loader2, Target, Hexagon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedPage, ScrollReveal, StaggerGrid, StaggerItem, AnimatedShimmerButton } from "@/components/ui/animated";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: plans, isLoading } = trpc.billing.plans.useQuery();
  const { data: subscription } = trpc.billing.mySubscription.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const subscribeMutation = trpc.billing.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Subscription activated! You now have full access 🎉");
      router.push("/courses");
    },
    onError: (err) => toast.error(err.message),
  });

  const iconMap: Record<string, typeof Zap> = {
    monthly: Zap,
    yearly: Crown,
    lifetime: Sparkles,
  };

  function handleSubscribe(planId: string) {
    if (!isAuthenticated) {
      router.push("/register");
      return;
    }
    subscribeMutation.mutate({ planId });
  }

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(225,29,72,0.1),transparent_50%)]" />
      <Navbar />
      <AnimatedPage>
        <main className="mx-auto max-w-6xl flex-1 px-4 py-20 md:py-28 sm:px-6 relative z-10">
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-rose-500/10 blur-[120px]" />
          <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />

          <ScrollReveal>
            <div className="text-center relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary shadow-sm"
              >
                <Sparkles className="h-4 w-4" />
                Simple pricing, unlimited access
              </motion.div>
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
                Choose your{" "}
                <span className="bg-gradient-to-r from-primary to-rose-400 bg-clip-text text-transparent">
                  plan
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                One subscription unlocks{" "}
                <span className="font-semibold text-foreground">
                  every premium course
                </span>{" "}
                on the platform. Zero per-course fees, forever.
              </p>
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="mt-20 flex justify-center">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </div>
          ) : (
            <StaggerGrid className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto items-center">
              {plans?.map((plan, idx) => {
                const Icon = iconMap[plan.slug] ?? Hexagon;
                const isActive = subscription?.planSlug === plan.slug;
                const isPopular = plan.isPopular;

                return (
                  <StaggerItem key={plan.id} scale>
                    <motion.div
                      whileHover={{ y: -8 }}
                      className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border transition-all duration-300 ${
                        isPopular
                          ? "border-primary/50 bg-card shadow-2xl shadow-primary/10 md:scale-105 z-10 p-10"
                          : "border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 p-8"
                      }`}
                    >
                      {/* Popular Glow Background */}
                      {isPopular && (
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
                      )}

                      {/* Popular Badge Container */}
                      {isPopular && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 px-4 py-1.5 rounded-b-xl bg-gradient-to-r from-primary to-rose-500 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-sm">
                          Most popular
                        </div>
                      )}

                      <div className="relative">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 ${
                              isPopular
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 group-hover:scale-110"
                                : "bg-primary/10 text-primary group-hover:bg-primary/20"
                            }`}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mt-1">
                              {plan.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-5xl font-extrabold tracking-tighter">
                              ${Number(plan.price).toFixed(0)}
                            </span>
                            {plan.interval !== "LIFETIME" && (
                              <span className="text-sm font-medium text-muted-foreground">
                                /{plan.interval === "MONTHLY" ? "mo" : "yr"}
                              </span>
                            )}
                            {plan.interval === "LIFETIME" && (
                              <span className="text-sm font-medium text-muted-foreground">
                                one-time
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

                        <ul className="space-y-4">
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-3"
                            >
                              <div className="flex shrink-0 h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15">
                                <Check className="h-3.5 w-3.5 text-emerald-500" strokeWidth={3} />
                              </div>
                              <span className="text-sm font-medium text-muted-foreground leading-tight">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="relative mt-10">
                        {isPopular ? (
                          <AnimatedShimmerButton className="w-full rounded-xl bg-primary shadow-lg shadow-primary/25">
                            <button
                              onClick={() => handleSubscribe(plan.id)}
                              disabled={isActive || subscribeMutation.isPending}
                              className="flex w-full items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-primary-foreground transition-all"
                            >
                              {isActive ? "Current plan" : subscribeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe Now"}
                            </button>
                          </AnimatedShimmerButton>
                        ) : (
                          <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={isActive || subscribeMutation.isPending}
                            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${
                              isActive
                                ? "cursor-default border border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                                : "border-2 border-primary/20 bg-transparent text-primary hover:bg-primary/5 hover:border-primary/40"
                            }`}
                          >
                            {isActive ? (
                              <>
                                <Check className="h-4 w-4" /> Current plan
                              </>
                            ) : subscribeMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Get started"
                            )}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </StaggerItem>
                );
              })}
            </StaggerGrid>
          )}

          {/* FAQ section */}
          <ScrollReveal>
             <div className="mt-32 max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Target className="h-10 w-10 text-primary/40 mx-auto mb-4" />
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Frequently asked questions
                </h2>
                <p className="mt-4 text-muted-foreground text-lg">
                  Everything you need to know about the product and billing.
                </p>
              </div>
              
              <StaggerGrid className="grid gap-6 md:grid-cols-2">
                {[
                  {
                    q: "Do I need to buy each course separately?",
                    a: "No. Any plan gives you access to every single course on the platform, including future updates.",
                  },
                  {
                    q: "Can I cancel my subscription anytime?",
                    a: "Yes. Monthly and yearly plans can be cancelled anytime. You keep access until the end of your billing period.",
                  },
                  {
                    q: "What happens after my subscription ends?",
                    a: "You lose access to premium lessons, but you will forever keep your enrolled progress and earned certificates.",
                  },
                  {
                    q: "Do you offer a student discount?",
                    a: "Yes! We offer a 50% discount for students. Please contact our support team with a valid .edu email address.",
                  }
                ].map((faq, i) => (
                  <StaggerItem key={faq.q} delay={i * 0.1}>
                    <div className="group rounded-2xl border border-border/50 bg-card/40 p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card hover:shadow-lg hover:shadow-primary/5 cursor-default">
                      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{faq.q}</h4>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </div>
          </ScrollReveal>
        </main>
      </AnimatedPage>
      <Footer />
    </div>
  );
}
