"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Sun,
  Moon,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";

const PASSWORD_RULES = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "Uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Number", test: (v: string) => /[0-9]/.test(v) },
  { label: "Special character", test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
];

/* ================================================================
   FLOATING PARTICLES
   ================================================================ */
function FloatingParticles() {
  // Deterministic values to avoid hydration mismatch (no Math.random during render)
  const particles = [
    { id: 0, size: 3, x: 12, y: 18, duration: 10, delay: 0.5, drift: 15 },
    { id: 1, size: 5, x: 35, y: 45, duration: 12, delay: 1.2, drift: -15 },
    { id: 2, size: 2, x: 68, y: 22, duration: 9, delay: 2.0, drift: 15 },
    { id: 3, size: 4, x: 82, y: 70, duration: 14, delay: 0.8, drift: -15 },
    { id: 4, size: 3, x: 25, y: 85, duration: 11, delay: 3.0, drift: 15 },
    { id: 5, size: 6, x: 55, y: 10, duration: 13, delay: 1.5, drift: -15 },
    { id: 6, size: 2, x: 90, y: 40, duration: 8, delay: 2.5, drift: 15 },
    { id: 7, size: 4, x: 15, y: 60, duration: 10, delay: 3.5, drift: -15 },
    { id: 8, size: 3, x: 45, y: 90, duration: 12, delay: 0.3, drift: 15 },
    { id: 9, size: 5, x: 72, y: 55, duration: 9, delay: 1.8, drift: -15 },
    { id: 10, size: 2, x: 50, y: 30, duration: 11, delay: 2.8, drift: 15 },
    { id: 11, size: 4, x: 8, y: 75, duration: 13, delay: 3.2, drift: -15 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -40, -80],
            x: [0, p.drift, 0],
          }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full bg-white/30"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
        />
      ))}
    </div>
  );
}

/* ================================================================
   SUCCESS ANIMATION
   ================================================================ */
function SuccessAnimation({ message, onComplete }: { message: string; onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Deterministic confetti positions
  const confetti = Array.from({ length: 20 }, (_, i) => ({
    x: ((i * 37 + 13) % 300) - 150,
    y: ((i * 53 + 7) % 300) - 150,
    delay: 0.3 + (i * 0.02),
    color: ["#29b6f6", "#ffd54f", "#ff80ab", "#b2ff59", "#4dd0e1", "#ff8a65"][i % 6],
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-900/80"
    >
      {confetti.map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [1, 1, 0],
            scale: [0, 1, 0.5],
            x: c.x,
            y: c.y,
          }}
          transition={{ duration: 1.2, delay: c.delay, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: c.color }}
        />
      ))}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-200"
      >
        <motion.svg
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
        className="absolute mt-40 text-lg font-semibold text-slate-700 dark:text-white"
      >
        {message}
      </motion.p>
    </motion.div>
  );
}

/* ================================================================
   TYPEWRITER TEXT
   ================================================================ */
function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayed("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayed((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [index, text]);

  return (
    <span className={className}>
      {displayed}
      {index < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-white/80 ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

/* ================================================================
   LOADING BAR - thin progress bar at top of card
   ================================================================ */
function LoadingBar({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;
  return (
    <div className="absolute top-0 left-0 right-0 h-[3px] z-30 overflow-hidden rounded-t-[28px]">
      <motion.div
        className="h-full bg-linear-to-r from-sky-400 via-cyan-400 to-sky-400"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: "60%" }}
      />
    </div>
  );
}

/* ================================================================
   CAPS LOCK DETECTOR
   ================================================================ */
function useCapsLock() {
  const [capsLock, setCapsLock] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (typeof e.getModifierState === "function") {
        setCapsLock(e.getModifierState("CapsLock"));
      }
    };
    window.addEventListener("keydown", handler);
    window.addEventListener("keyup", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keyup", handler);
    };
  }, []);

  return capsLock;
}

/* ================================================================
   INPUT WITH ICON
   ================================================================ */

const IconInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    icon: React.ElementType;
    showToggle?: boolean;
    showCapsWarning?: boolean;
  }
>(function IconInput({ icon: Icon, showToggle, showCapsWarning, ...props }, ref) {
  const [visible, setVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const capsLock = useCapsLock();

  const resolvedType = showToggle ? (visible ? "text" : "password") : props.type;

  return (
    <div className="relative group">
      <motion.div
        animate={{ scale: isFocused ? 1.15 : 1, color: isFocused ? "#0ea5e9" : "#94a3b8" }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10"
      >
        <Icon className="w-4 h-4" />
      </motion.div>
      <input
        {...props}
        ref={ref}
        type={resolvedType}
        onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
        className="w-full rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700
                   pl-11 pr-11 py-2.5 text-sm text-slate-700 dark:text-slate-200
                   placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-200
                   focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:focus:ring-sky-900 focus:bg-white dark:focus:bg-slate-600"
      />
      {/* Caps Lock warning */}
      {showCapsWarning && capsLock && isFocused && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-8 left-4 flex items-center gap-1 px-2 py-1 rounded bg-amber-500 text-white text-[10px] font-medium shadow-md"
        >
          <AlertTriangle className="w-3 h-3" />
          Caps Lock is ON
        </motion.div>
      )}
      {showToggle && (
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible(!visible)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
});

/* ================================================================
   STAGGER WRAPPER
   ================================================================ */
function StaggerContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
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
   PARALLAX TILT CARD
   ================================================================ */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 200, damping: 30 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ================================================================
   MAIN AUTH PAGE
   ================================================================ */
export default function AuthPage() {
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [existingUser, setExistingUser] = useState<string | null>(null);
  const router = useRouter();

  // Session persistence check
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/get-session", {
          headers: { "Content-Type": "application/json" },
        });
        const session = await res.json();
        if (session?.user?.name) {
          setExistingUser(session.user.name);
        }
      } catch {
        // No existing session
      }
    }
    checkSession();
  }, []);

  function handleSuccess(msg: string) {
    setSuccessMsg(msg);
    setShowSuccess(true);
  }

  function handleRedirectExisting() {
    router.push("/dashboard/student");
    router.refresh();
  }

  // Animated background gradient hue shift
  const bgHue = useMotionValue(190);
  useEffect(() => {
    let frame: number;
    let time = 0;
    function animate() {
      time += 0.003;
      bgHue.set(190 + Math.sin(time) * 15);
      frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [bgHue]);

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="flex min-h-screen items-center justify-center px-4 py-8 bg-white dark:bg-slate-900 transition-colors duration-500">

        {/* Success overlay */}
        <AnimatePresence>
          {showSuccess && <SuccessAnimation message={successMsg} onComplete={() => setShowSuccess(false)} />}
        </AnimatePresence>

        {/* Animated background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg,
                hsl(190, 80%, 95%) 0%,
                hsl(200, 70%, 93%) 50%,
                hsl(170, 60%, 94%) 100%)`,
            }}
          />
          <motion.div
            animate={{ x: [0, 60, -60, 0], y: [0, -40, 40, 0] }}
            transition={{ duration: 18, ease: "linear", repeat: Infinity }}
            className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-sky-400/8 dark:bg-sky-400/5 blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, -50, 50, 0], y: [0, 50, -50, 0] }}
            transition={{ duration: 22, ease: "linear", repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-400/8 dark:bg-teal-400/5 blur-[100px]"
          />
          {/* Dark mode overlay */}
          <div className="absolute inset-0 bg-transparent dark:bg-slate-900/70 transition-colors duration-500" />
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
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white dark:bg-slate-800
                         text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-600
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

        {/* Dark mode toggle */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 18 }}
          className="absolute top-6 right-6 z-30"
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDark(!isDark)}
            className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center
                       text-slate-600 dark:text-yellow-400 hover:shadow-lg transition-all duration-200 cursor-pointer
                       border border-slate-200 dark:border-slate-600"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <Sun className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Moon className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>

        {/* Returning user banner */}
        <AnimatePresence>
          {existingUser && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-30"
            >
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-sky-100 dark:border-slate-600">
                <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                  <User className="w-4 h-4 text-sky-600" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Welcome back, <strong className="text-sky-600">{existingUser}</strong>!
                </span>
                <button
                  onClick={handleRedirectExisting}
                  className="px-3 py-1 rounded-full bg-sky-500 text-white text-xs font-bold hover:bg-sky-600 transition-colors cursor-pointer"
                >
                  Continue →
                </button>
                <button
                  onClick={() => setExistingUser(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── AUTH CARD (Desktop) with parallax tilt ─── */}
        <TiltCard className="relative w-full max-w-[820px] min-h-[540px] rounded-[28px] overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40 hidden md:block">
          {/* Loading progress bar */}
          <LoadingBar isLoading={isFormLoading} />

          <div className="relative w-full min-h-[540px] bg-white dark:bg-slate-800 transition-colors duration-500">
            {/* Left half: SIGN IN */}
            <div className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-8 py-8">
              <SignInForm onSuccess={(msg) => handleSuccess(msg)} onLoadingChange={setIsFormLoading} />
            </div>

            {/* Right half: SIGN UP */}
            <div className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 py-5 overflow-y-auto">
              <SignUpForm onSuccess={(msg) => handleSuccess(msg)} onLoadingChange={setIsFormLoading} />
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
                <FloatingParticles />
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/5" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5" />

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

                        <h2 className="text-3xl font-bold leading-tight mb-3 bg-clip-text text-transparent animate-[colorShift_3s_ease-in-out_infinite]"
                          style={{
                            backgroundImage: "linear-gradient(90deg, #ffffff, #ffd54f, #4dd0e1, #ff80ab, #b2ff59, #ffffff)",
                            backgroundSize: "400% 100%",
                          }}
                        >
                          <TypewriterText text="Create Account!" />
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

                        <h2 className="text-3xl font-bold leading-tight mb-3 bg-clip-text text-transparent animate-[colorShift_3s_ease-in-out_infinite]"
                          style={{
                            backgroundImage: "linear-gradient(90deg, #ffffff, #ffd54f, #4dd0e1, #ff80ab, #b2ff59, #ffffff)",
                            backgroundSize: "400% 100%",
                          }}
                        >
                          <TypewriterText text="Welcome Back!" />
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
        </TiltCard>

        {/* ─── MOBILE AUTH CARD ─── */}
        <div className="md:hidden w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden transition-colors duration-500"
          >
            <div className="flex bg-slate-50 dark:bg-slate-700">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-3.5 text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                  !isSignUp
                    ? "text-sky-600 border-b-2 border-sky-500 bg-white dark:bg-slate-800"
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
                    ? "text-sky-600 border-b-2 border-sky-500 bg-white dark:bg-slate-800"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Sign Up
              </button>
            </div>
            <div className="px-6 py-8">
              <AnimatePresence mode="wait">
                {!isSignUp ? (
                  <motion.div key="m-signin" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                    <SignInForm onSuccess={(msg) => handleSuccess(msg)} onLoadingChange={setIsFormLoading} />
                  </motion.div>
                ) : (
                  <motion.div key="m-signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                    <SignUpForm onSuccess={(msg) => handleSuccess(msg)} onLoadingChange={setIsFormLoading} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

/* ================================================================
   SIGN IN FORM
   ================================================================ */
function SignInForm({ onSuccess, onLoadingChange }: { onSuccess: (msg: string) => void; onLoadingChange: (v: boolean) => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [hasError, setHasError] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  // Auto-focus email on mount
  useEffect(() => { emailRef.current?.focus(); }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch("email") ?? "";
  const { ref: emailFormRef, ...emailRest } = register("email");

  async function onSubmit(data: LoginInput) {
    setIsLoading(true);
    onLoadingChange(true);
    setHasError(false);
    try {
      const result = await signIn.email({ email: data.email, password: data.password });
      if (result.error) {
        toast.error(result.error.message ?? "Invalid credentials");
        setHasError(true);
      } else {
        onSuccess("Welcome back! 🎉");
        toast.success("Signed in successfully");
        const params = new URLSearchParams(window.location.search);
        const callbackUrl = params.get("callbackUrl");
        if (callbackUrl) {
          setTimeout(() => router.push(callbackUrl), 1800);
        } else {
          const sessionRes = await fetch("/api/auth/get-session", { headers: { "Content-Type": "application/json" } });
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
      onLoadingChange(false);
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
        <StaggerItem>
          <div className="flex flex-col items-center mb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-sky-500" />
              <span className="text-sm font-bold text-sky-600 tracking-wide">GREEN ACADEMY</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 tracking-widest">Learn · Grow · Succeed</p>
          </div>
        </StaggerItem>

        <StaggerItem>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Sign in</h1>
        </StaggerItem>

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
                ref={(e) => {
                  emailFormRef(e);
                  emailRef.current = e;
                }}
                {...emailRest}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500 pl-4">{errors.email.message}</p>}
            </div>

            <div>
              <IconInput
                icon={Lock}
                id="signin-password"
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                showToggle
                showCapsWarning
                {...register("password")}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500 pl-4">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    rememberMe ? "bg-sky-500 border-sky-500" : "border-slate-300 group-hover:border-sky-400"
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 select-none" onClick={() => setRememberMe(!rememberMe)}>Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-xs text-sky-500 font-medium hover:text-sky-600 hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>

            <ShimmerButton type="submit" disabled={isLoading} isLoading={isLoading}>
              {emailValue ? `Sign in as ${emailValue.split("@")[0]}` : "Sign In"}
            </ShimmerButton>

            <p className="text-[10px] text-slate-300 dark:text-slate-600 text-center pt-1">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-mono text-[9px]">Enter</kbd> to submit
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
function SignUpForm({ onSuccess, onLoadingChange }: { onSuccess: (msg: string) => void; onLoadingChange: (v: boolean) => void }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

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

  const { ref: nameFormRef, ...nameRest } = register("name");

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    onLoadingChange(true);
    setHasError(false);
    try {
      const result = await signUp.email({ name: data.name, email: data.email, password: data.password });
      if (result.error) {
        toast.error(result.error.message ?? "Registration failed");
        setHasError(true);
      } else {
        onSuccess("Account created! 🎉");
        toast.success("Welcome aboard!");
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
      onLoadingChange(false);
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
        <StaggerItem>
          <div className="flex flex-col items-center mb-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-sky-500" />
              <span className="text-sm font-bold text-sky-600 tracking-wide">GREEN ACADEMY</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 tracking-widest">Learn · Grow · Succeed</p>
          </div>
        </StaggerItem>

        <StaggerItem>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Sign Up</h1>
        </StaggerItem>

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
                ref={(e) => {
                  nameFormRef(e);
                  nameRef.current = e;
                }}
                {...nameRest}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500 pl-4">{errors.name.message}</p>}
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
              {errors.email && <p className="mt-1 text-xs text-red-500 pl-4">{errors.email.message}</p>}
            </div>

            <div>
              <IconInput
                icon={Lock}
                id="signup-password"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                showToggle
                showCapsWarning
                {...register("password")}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500 pl-4">{errors.password.message}</p>}

              {passwordValue.length > 0 && (
                <div className="mt-1.5 px-4">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-600">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${strengthPercent}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      className={`h-full rounded-full ${
                        strengthPercent <= 25 ? "bg-red-400" : strengthPercent <= 50 ? "bg-orange-400" : strengthPercent <= 75 ? "bg-amber-400" : "bg-emerald-400"
                      }`}
                    />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                    {PASSWORD_RULES.map((rule) => {
                      const passed = rule.test(passwordValue);
                      return (
                        <span key={rule.label} className={`flex items-center gap-1 text-[10px] transition-colors ${passed ? "text-emerald-500" : "text-slate-300 dark:text-slate-600"}`}>
                          {passed ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                          {rule.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="relative">
                <IconInput
                  icon={ShieldCheck}
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  showToggle
                  showCapsWarning
                  {...register("confirmPassword")}
                />
                {confirmValue.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center ${
                      passwordsMatch ? "bg-emerald-100 dark:bg-emerald-900" : "bg-red-100 dark:bg-red-900"
                    }`}
                  >
                    {passwordsMatch ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-red-500" />}
                  </motion.div>
                )}
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500 pl-4">{errors.confirmPassword.message}</p>}
              {passwordsMismatch && !errors.confirmPassword && <p className="mt-1 text-xs text-red-400 pl-4">Passwords don&apos;t match</p>}
            </div>

            <ShimmerButton type="submit" disabled={isLoading} isLoading={isLoading}>
              Sign Up
            </ShimmerButton>

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
   SOCIAL ICON BUTTON
   ================================================================ */
function SocialIcon({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative group">
      <motion.button
        type="button"
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 dark:border-slate-600
                   text-slate-500 dark:text-slate-400 hover:border-sky-400 hover:text-sky-500 hover:bg-sky-50/50
                   dark:hover:bg-sky-900/30 transition-all duration-200 cursor-pointer"
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
