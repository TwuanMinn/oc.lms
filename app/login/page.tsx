"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/validations/user";
import { signIn, signUp } from "@/lib/auth-client";
import {
  Loader2,
  Github,
  Globe,
  Check,
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

const PASSWORD_RULES = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "Uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Number", test: (v: string) => /[0-9]/.test(v) },
  { label: "Special character", test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
];

/* ================================================================
   FLOATING PARTICLES - tiny animated dots on the blue panel
   ================================================================ */
function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 6 + 8,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -40, -80],
            x: [0, Math.random() > 0.5 ? 15 : -15, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute rounded-full bg-white/30"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
        />
      ))}
    </div>
  );
}

/* ================================================================
   SUCCESS ANIMATION - checkmark with confetti burst
   ================================================================ */
function SuccessAnimation({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
    >
      {/* Confetti dots */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 1, 0.5],
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
          }}
          transition={{ duration: 1.2, delay: 0.3 + Math.random() * 0.3, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: ["#29b6f6", "#ffd54f", "#ff80ab", "#b2ff59", "#4dd0e1", "#ff8a65"][i % 6],
          }}
        />
      ))}

      {/* Checkmark circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-200"
      >
        <motion.svg
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-12 h-12 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            d="M5 13l4 4L19 7"
          />
        </motion.svg>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute mt-40 text-lg font-semibold text-slate-700"
      >
        Welcome aboard! 🎉
      </motion.p>
    </motion.div>
  );
}

/* ================================================================
   INPUT WITH ICON - focus animations, eye toggle
   ================================================================ */
function IconInput({
  icon: Icon,
  showToggle,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ElementType;
  showToggle?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const resolvedType = showToggle
    ? visible
      ? "text"
      : "password"
    : props.type;

  return (
    <div className="relative group">
      <motion.div
        animate={{
          scale: isFocused ? 1.15 : 1,
          color: isFocused ? "#0ea5e9" : "#94a3b8",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"
      >
        <Icon className="w-4 h-4" />
      </motion.div>
      <input
        {...props}
        type={resolvedType}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className="w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-11 py-2.5 text-sm text-slate-700
                   placeholder:text-slate-400 outline-none transition-all duration-200
                   focus:border-sky-400 focus:ring-2 focus:ring-sky-100 focus:bg-white"
      />
      {showToggle && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible(!visible)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

/* ================================================================
   STAGGER WRAPPER - staggers children entrance
   ================================================================ */
function StaggerContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   SHIMMER BUTTON
   ================================================================ */
function ShimmerButton({
  children,
  isLoading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading: boolean }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      {...(props as React.ComponentProps<typeof motion.button>)}
      className="relative w-full mt-2 rounded-full bg-linear-to-r from-[#29b6f6] to-[#0288d1] py-2.5 text-sm font-bold tracking-widest text-white
                 shadow-lg shadow-sky-400/30 hover:shadow-sky-400/50 transition-all duration-300
                 disabled:opacity-50 cursor-pointer uppercase overflow-hidden"
    >
      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
      />
      <span className="relative z-10">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : children}
      </span>
    </motion.button>
  );
}

/* ================================================================
   MAIN AUTH PAGE
   ================================================================ */
export default function AuthPage() {
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && <SuccessAnimation onComplete={() => setShowSuccess(false)} />}
      </AnimatePresence>

      {/* Background ambience */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-50/30 via-sky-100/20 to-teal-50/30" />
        <motion.div
          animate={{ x: [0, 60, -60, 0], y: [0, -40, 40, 0] }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity }}
          className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-sky-400/8 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -50, 50, 0], y: [0, 50, -50, 0] }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-400/8 blur-[100px]"
        />
      </div>

      {/* Back to home button */}
      <motion.div
        initial={{ opacity: 0, x: -30, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 18 }}
        className="absolute top-6 left-6 z-30"
      >
        <motion.div
          whileHover={{ scale: 1.08, boxShadow: "0 8px 30px rgba(2, 136, 209, 0.25)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="rounded-full bg-linear-to-r from-[#29b6f6] to-[#0288d1] p-[2px]"
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white
                       text-base font-semibold text-slate-700 hover:text-sky-600
                       transition-colors duration-200"
          >
            <motion.svg
              animate={{ x: [0, -4, 0] }}
              transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </motion.svg>
            Home
          </Link>
        </motion.div>
      </motion.div>

      {/* ─── AUTH CARD (Desktop) ─── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        className="relative w-full max-w-[820px] min-h-[540px] rounded-[28px] overflow-hidden shadow-2xl shadow-black/10 hidden md:block"
        style={{ perspective: "1200px" }}
      >
        <div className="relative w-full min-h-[540px] bg-white">
          {/* -- Left half: SIGN IN form -- */}
          <div className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-8 py-8">
            <SignInForm onSuccess={() => setShowSuccess(true)} />
          </div>

          {/* -- Right half: SIGN UP form -- */}
          <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 py-5 overflow-y-auto">
            <SignUpForm onSuccess={() => setShowSuccess(true)} />
          </div>

          {/* ─── SLIDING OVERLAY PANEL ─── */}
          <motion.div
            initial={false}
            animate={{ x: isSignUp ? "-100%" : "0%" }}
            transition={{ type: "spring", stiffness: 200, damping: 28 }}
            className="absolute top-0 right-0 w-1/2 h-full z-20"
          >
            <div className="relative w-full h-full overflow-hidden rounded-l-[22px]">
              <div className="absolute inset-0 bg-linear-to-br from-[#29b6f6] via-[#0288d1] to-[#0277bd]" />

              {/* Floating particles */}
              <FloatingParticles />

              {/* Decorative circles */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full px-10 text-center text-white">
                <AnimatePresence mode="wait">
                  {!isSignUp ? (
                    <motion.div
                      key="go-signup"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col items-center"
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                        className="mb-4"
                      >
                        <Image
                          src="/images/auth-signup.png"
                          alt="Create your account"
                          width={220}
                          height={220}
                          className="w-[200px] h-[200px] object-cover rounded-full drop-shadow-2xl"
                          priority
                        />
                      </motion.div>

                      <h2
                        className="text-3xl font-bold leading-tight mb-3 bg-clip-text text-transparent animate-[colorShift_3s_ease-in-out_infinite]"
                        style={{
                          backgroundImage: "linear-gradient(90deg, #ffffff, #ffd54f, #4dd0e1, #ff80ab, #b2ff59, #ffffff)",
                          backgroundSize: "400% 100%",
                        }}
                      >
                        Create,<br />Account!
                      </h2>
                      <p className="text-sm text-white/80 mb-6 max-w-[200px]">
                        Sign up if you still don&apos;t have an account …
                      </p>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsSignUp(true)}
                        className="px-8 py-2.5 rounded-full border-2 border-white/60 text-sm font-bold tracking-widest text-white
                                   transition-all duration-300 cursor-pointer backdrop-blur-sm uppercase"
                      >
                        Sign Up
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="go-signin"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col items-center"
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity }}
                        className="mb-4"
                      >
                        <Image
                          src="/images/auth-login.png"
                          alt="Welcome back"
                          width={220}
                          height={220}
                          className="w-[200px] h-[200px] object-cover rounded-full drop-shadow-2xl"
                          priority
                        />
                      </motion.div>

                      <h2
                        className="text-3xl font-bold leading-tight mb-3 bg-clip-text text-transparent animate-[colorShift_3s_ease-in-out_infinite]"
                        style={{
                          backgroundImage: "linear-gradient(90deg, #ffffff, #ffd54f, #4dd0e1, #ff80ab, #b2ff59, #ffffff)",
                          backgroundSize: "400% 100%",
                        }}
                      >
                        Log in
                      </h2>
                      <p className="text-sm text-white/80 mb-6 max-w-[200px]">
                        Sign in here if you already have an account
                      </p>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsSignUp(false)}
                        className="px-8 py-2.5 rounded-full border-2 border-white/60 text-sm font-bold tracking-widest text-white
                                   transition-all duration-300 cursor-pointer backdrop-blur-sm uppercase"
                      >
                        Sign In
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ─── MOBILE AUTH CARD ─── */}
      <div className="md:hidden w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Tab switcher */}
          <div className="flex bg-slate-50">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3.5 text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                !isSignUp
                  ? "text-sky-600 border-b-2 border-sky-500 bg-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3.5 text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                isSignUp
                  ? "text-sky-600 border-b-2 border-sky-500 bg-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="px-6 py-8">
            <AnimatePresence mode="wait">
              {!isSignUp ? (
                <motion.div
                  key="mobile-signin"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SignInForm onSuccess={() => setShowSuccess(true)} />
                </motion.div>
              ) : (
                <motion.div
                  key="mobile-signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SignUpForm onSuccess={() => setShowSuccess(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

    </div>
  );
}

/* ================================================================
   SIGN IN FORM
   ================================================================ */
function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [hasError, setHasError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    setHasError(false);
    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Invalid credentials");
        setHasError(true);
      } else {
        onSuccess();
        toast.success("Welcome back!");
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get("callbackUrl");
        if (callbackUrl) {
          setTimeout(() => router.push(callbackUrl), 1800);
        } else {
          const sessionRes = await fetch("/api/auth/get-session", {
            headers: { "Content-Type": "application/json" },
          });
          const session = await sessionRes.json();
          const role = session?.user?.role;

          setTimeout(() => {
            if (role === "ADMIN") router.push("/dashboard/admin");
            else if (role === "TEACHER") router.push("/dashboard/teacher");
            else router.push("/dashboard/student");
          }, 1800);
        }
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      animate={hasError ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => setHasError(false)}
      className="w-full flex flex-col items-center"
    >
      <StaggerContainer className="w-full flex flex-col items-center">
        {/* Brand logo + tagline */}
        <StaggerItem>
          <div className="flex flex-col items-center mb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-sky-500" />
              <span className="text-sm font-bold text-sky-600 tracking-wide">GREEN ACADEMY</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 tracking-widest">Learn · Grow · Succeed</p>
          </div>
        </StaggerItem>

        <StaggerItem>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Sign in</h1>
        </StaggerItem>

        {/* Social icons */}
        <StaggerItem>
          <div className="flex items-center gap-4 mb-3">
            <SocialIcon label="GitHub"><Github className="w-4 h-4" /></SocialIcon>
            <SocialIcon label="Google">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="SSO"><Globe className="w-4 h-4" /></SocialIcon>
          </div>
        </StaggerItem>

        <StaggerItem>
          <p className="text-xs text-slate-400 mb-5">Or sign in using E-Mail Address</p>
        </StaggerItem>

        <StaggerItem className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
            <div>
              <IconInput
                icon={Mail}
                id="signin-email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 pl-4">{errors.email.message}</p>
              )}
            </div>

            <div>
              <IconInput
                icon={Lock}
                id="signin-password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                showToggle
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 pl-4">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    rememberMe
                      ? "bg-sky-500 border-sky-500"
                      : "border-slate-300 group-hover:border-sky-400"
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs text-slate-500 select-none" onClick={() => setRememberMe(!rememberMe)}>Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-sky-500 font-medium hover:text-sky-600 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <ShimmerButton type="submit" disabled={isLoading} isLoading={isLoading}>
              Sign In
            </ShimmerButton>

            {/* Keyboard hint */}
            <p className="text-[10px] text-slate-300 text-center pt-1">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[9px]">Enter</kbd> to submit
            </p>
          </form>
        </StaggerItem>
      </StaggerContainer>
    </motion.div>
  );
}

/* ================================================================
   SIGN UP FORM
   ================================================================ */
function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password") ?? "";
  const confirmValue = watch("confirmPassword") ?? "";
  const passedCount = PASSWORD_RULES.filter((r) => r.test(passwordValue)).length;
  const strengthPercent = (passedCount / PASSWORD_RULES.length) * 100;
  const passwordsMatch = confirmValue.length > 0 && passwordValue === confirmValue;
  const passwordsMismatch = confirmValue.length > 0 && passwordValue !== confirmValue;

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    setHasError(false);
    try {
      const result = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Registration failed");
        setHasError(true);
      } else {
        onSuccess();
        toast.success("Account created! Welcome aboard 🎉");
        setTimeout(() => {
          router.push("/dashboard/student");
          router.refresh();
        }, 1800);
      }
    } catch {
      toast.error("Something went wrong");
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      animate={hasError ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : {}}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => setHasError(false)}
      className="w-full flex flex-col items-center"
    >
      <StaggerContainer className="w-full flex flex-col items-center">
        {/* Brand logo + tagline */}
        <StaggerItem>
          <div className="flex flex-col items-center mb-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-sky-500" />
              <span className="text-sm font-bold text-sky-600 tracking-wide">GREEN ACADEMY</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 tracking-widest">Learn · Grow · Succeed</p>
          </div>
        </StaggerItem>

        <StaggerItem>
          <h1 className="text-2xl font-bold text-slate-800 mb-3">Sign Up</h1>
        </StaggerItem>

        {/* Social icons */}
        <StaggerItem>
          <div className="flex items-center gap-4 mb-2">
            <SocialIcon label="GitHub"><Github className="w-4 h-4" /></SocialIcon>
            <SocialIcon label="Google">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="SSO"><Globe className="w-4 h-4" /></SocialIcon>
          </div>
        </StaggerItem>

        <StaggerItem>
          <p className="text-xs text-slate-400 mb-3">Or use your Email for registration</p>
        </StaggerItem>

        <StaggerItem className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2.5">
            <div>
              <IconInput
                icon={User}
                id="signup-name"
                type="text"
                placeholder="Full Name"
                autoComplete="name"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500 pl-4">{errors.name.message}</p>
              )}
            </div>

            <div>
              <IconInput
                icon={Mail}
                id="signup-email"
                type="email"
                placeholder="Email"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 pl-4">{errors.email.message}</p>
              )}
            </div>

            <div>
              <IconInput
                icon={Lock}
                id="signup-password"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                showToggle
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 pl-4">{errors.password.message}</p>
              )}

              {/* Strength bar */}
              {passwordValue.length > 0 && (
                <div className="mt-1.5 px-4">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${strengthPercent}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className={`h-full rounded-full ${
                        strengthPercent <= 25
                          ? "bg-red-400"
                          : strengthPercent <= 50
                            ? "bg-orange-400"
                            : strengthPercent <= 75
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                      }`}
                    />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                    {PASSWORD_RULES.map((rule) => {
                      const passed = rule.test(passwordValue);
                      return (
                        <span
                          key={rule.label}
                          className={`flex items-center gap-1 text-[10px] transition-colors ${
                            passed ? "text-emerald-500" : "text-slate-300"
                          }`}
                        >
                          {passed ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                          {rule.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password with live match indicator */}
            <div>
              <div className="relative">
                <IconInput
                  icon={ShieldCheck}
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  showToggle
                  {...register("confirmPassword")}
                />
                {/* Live match indicator */}
                {confirmValue.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                      passwordsMatch ? "bg-emerald-100" : "bg-red-100"
                    }`}
                  >
                    {passwordsMatch ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <X className="w-3 h-3 text-red-500" />
                    )}
                  </motion.div>
                )}
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 pl-4">{errors.confirmPassword.message}</p>
              )}
              {passwordsMismatch && !errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400 pl-4">Passwords don&apos;t match</p>
              )}
            </div>

            <ShimmerButton type="submit" disabled={isLoading} isLoading={isLoading}>
              Sign Up
            </ShimmerButton>

            {/* Terms & Privacy */}
            <p className="text-[10px] text-slate-400 text-center leading-relaxed pt-0.5">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-sky-500 hover:underline">Terms</Link>
              {" "}&{" "}
              <Link href="/privacy" className="text-sky-500 hover:underline">Privacy Policy</Link>
            </p>
          </form>
        </StaggerItem>
      </StaggerContainer>
    </motion.div>
  );
}

/* ================================================================
   SOCIAL ICON BUTTON (with tooltip)
   ================================================================ */
function SocialIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative group">
      <motion.button
        type="button"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 text-slate-500
                   hover:border-sky-400 hover:text-sky-500 hover:bg-sky-50/50 transition-all duration-200 cursor-pointer"
      >
        {children}
      </motion.button>
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-800 text-white text-[10px]
                       opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}
