"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/lib/validations/user";
import { signUp } from "@/lib/auth-client";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { springBounce } from "@/lib/motion";
import { AnimatedShimmerButton } from "@/components/ui/animated";

const PASSWORD_RULES = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "Uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Number", test: (v: string) => /[0-9]/.test(v) },
  { label: "Special character", test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password") ?? "";
  const passedCount = PASSWORD_RULES.filter((r) => r.test(passwordValue)).length;
  const strengthPercent = (passedCount / PASSWORD_RULES.length) * 100;

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    try {
      const result = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Registration failed");
      } else {
        toast.success("Account created! Welcome aboard 🎉");
        router.push("/dashboard/student");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      {/* Background ambience */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
           animate={{
             x: [0, 50, -50, 0],
             y: [0, -50, 50, 0],
           }}
           transition={{ duration: 15, ease: "linear", repeat: Infinity }}
           className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]"
        />
        <motion.div
           animate={{
             x: [0, -50, 50, 0],
             y: [0, 50, -50, 0],
           }}
           transition={{ duration: 20, ease: "linear", repeat: Infinity }}
           className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-rose-500/5 blur-[100px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-sm"
      >
        <Link href="/" className="mb-8 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={springBounce}
          >
            <Image
              src="/images/logo.png"
              alt="Green Academy"
              width={600}
              height={132}
              className="h-[7.5rem] w-auto"
              priority
            />
          </motion.div>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 20 }}
          className="rounded-xl border border-border/50 bg-card p-6"
        >
          <h1 className="text-center text-xl font-bold">Create account</h1>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Start your learning journey
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="name" className="text-sm font-medium">Full name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register("name")}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition-all focus:ring-2 focus:shadow-lg focus:shadow-primary/5"
              />
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-destructive"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition-all focus:ring-2 focus:shadow-lg focus:shadow-primary/5"
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-destructive"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register("password")}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition-all focus:ring-2 focus:shadow-lg focus:shadow-primary/5"
              />
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-xs text-destructive"
                >
                  {errors.password.message}
                </motion.p>
              )}

              {/* Strength bar */}
              <div className="mt-2.5">
                <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${strengthPercent}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={`h-full rounded-full transition-colors ${
                      strengthPercent <= 25
                        ? "bg-destructive"
                        : strengthPercent <= 50
                          ? "bg-orange-400"
                          : strengthPercent <= 75
                            ? "bg-amber-400"
                            : "bg-emerald-400"
                    }`}
                  />
                </div>
              </div>

              {/* Password rules */}
              <div className="mt-2 space-y-1">
                {PASSWORD_RULES.map((rule, i) => {
                  const passed = rule.test(passwordValue);
                  return (
                    <motion.div
                      key={rule.label}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.05 }}
                      className="flex items-center gap-1.5"
                    >
                      <motion.span
                        initial={false}
                        animate={{ scale: passed ? [1.3, 1] : 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        {passed ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <X className="h-3 w-3 text-muted-foreground/50" />
                        )}
                      </motion.span>
                      <span className={`text-[10px] transition-colors ${passed ? "text-emerald-400" : "text-muted-foreground/50"}`}>
                        {rule.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <AnimatedShimmerButton className="w-full rounded-lg bg-primary shadow-lg shadow-primary/20">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create account
              </button>
            </AnimatedShimmerButton>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
