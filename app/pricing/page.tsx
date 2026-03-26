"use client";

import { trpc } from "@/lib/trpc/client";
import { useSession } from "@/lib/auth-client";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Check, Zap, Crown, Sparkles, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { AnimatedPage, ScrollReveal } from "@/components/ui/animated";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PricingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: plans, isLoading } = trpc.billing.plans.useQuery();
  const { data: subscription } = trpc.billing.mySubscription.useQuery(
    undefined,
    { enabled: !!session?.user }
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
    if (!session?.user) {
      router.push("/register");
      return;
    }
    subscribeMutation.mutate({ planId });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <AnimatedPage>
        <main className="mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-6">
          <ScrollReveal>
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Simple pricing, unlimited access
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Choose your plan
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
                One subscription unlocks{" "}
                <span className="font-semibold text-foreground">
                  every course
                </span>{" "}
                on the platform. No per-course fees, ever.
              </p>
            </div>
          </ScrollReveal>

          {isLoading ? (
            <div className="mt-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {plans?.map((plan, idx) => {
                const Icon = iconMap[plan.slug] ?? Zap;
                const isActive = subscription?.planSlug === plan.slug;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={`relative rounded-2xl border p-6 transition-shadow ${
                      plan.isPopular
                        ? "border-primary/50 bg-card shadow-xl shadow-primary/5"
                        : "border-border/50 bg-card"
                    }`}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-0.5 text-xs font-semibold text-primary-foreground">
                        Most popular
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          plan.isPopular
                            ? "bg-primary/10"
                            : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            plan.isPopular
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{plan.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight">
                          ${Number(plan.price).toFixed(0)}
                        </span>
                        {plan.interval !== "LIFETIME" && (
                          <span className="text-sm text-muted-foreground">
                            /{plan.interval === "MONTHLY" ? "mo" : "yr"}
                          </span>
                        )}
                        {plan.interval === "LIFETIME" && (
                          <span className="text-sm text-muted-foreground">
                            one-time
                          </span>
                        )}
                      </div>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                          <span className="text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={
                        isActive || subscribeMutation.isPending
                      }
                      className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                        isActive
                          ? "cursor-default border border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                          : plan.isPopular
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20"
                            : "border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* FAQ section */}
          <ScrollReveal>
            <div className="mt-20 text-center">
              <h2 className="text-2xl font-bold">
                Frequently asked questions
              </h2>
              <div className="mx-auto mt-8 grid max-w-2xl gap-4 text-left">
                {[
                  {
                    q: "Do I need to buy each course separately?",
                    a: "No. Any plan gives you access to every course on the platform.",
                  },
                  {
                    q: "Can I cancel anytime?",
                    a: "Yes. Monthly and yearly plans can be cancelled anytime. You keep access until the end of your billing period.",
                  },
                  {
                    q: "What happens after my subscription ends?",
                    a: "You lose access to premium lessons but keep your progress and certificates.",
                  },
                ].map((faq) => (
                  <div
                    key={faq.q}
                    className="rounded-xl border border-border/50 bg-card p-5"
                  >
                    <h4 className="text-sm font-semibold">{faq.q}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </main>
      </AnimatedPage>
      <Footer />
    </div>
  );
}
