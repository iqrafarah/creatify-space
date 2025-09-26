"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateEmail } from "@/lib/validators";
import Link from "next/link";
import Toast from "./Notifications/Toast";
import Image from "next/image";
import { loginWithEmail } from "@/lib/authService";

// Login form component for magic link authentication
export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateEmail(email))
      return setError("Please enter a valid email address.");

    setError("");
    setIsSubmitting(true);

    // Call login API via helper function
    const result = await loginWithEmail(email);

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setShowNotification(true);
    setIsSubmitting(false);
  }

  const isButtonDisabled = isSubmitting || !email.trim();

  return (
    <div className="h-screen flex items-center">
      {showNotification && (
        <Toast 
          id="magic-link-sent" 
          message="Magic link sent to your email!" 
          duration={3000} 
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 sm:max-w-sm w-full items-center  mx-auto px-4"
      >
        <Image src="/logo.svg" alt="Logo" width={48} height={48} className="mb-4"/>

        <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
        <p className="text-sm text-muted mb-3">
          Enter your email to receive a magic link
        </p>

        <input
          type="email"
          placeholder="name@gmail.com"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="email"
          className="w-full border-gray-300 outline-none px-3 py-2 rounded-md bg-inherit transition border text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />

        {error && (
          <p className="text-red-500 text-sm text-left w-full">{error}</p>
        )}

        <button
          disabled={isButtonDisabled}
          type="submit"
          aria-invalid={error ? "true" : "false"}
          className={`w-full bg-[var(--primary)] hover:bg-[var(--btn)] text-white font-medium text-sm capitalize h-10 px-6 py-2 rounded-md flex gap-2 justify-center items-center ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <div className="loadingSpinner"></div>
            </>
          ) : (
            "Send Magic Link"
          )}
        </button>

        {/* Link to signup page */}
        <p className="text-sm mt-2">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-[var(--primary)] hover:underline"
          >
            Sign up
          </Link>
        </p>
        {/* 
        // Social login section (commented out)
        <div className="w-full flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500">or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button 
          type="button"
          disabled={isSubmitting}
          className="w-full bg-white hover:bg-gray-100 text-gray-800 font-medium text-sm capitalize h-10 px-6 py-2 rounded-md flex gap-2 justify-center items-center border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="/google-icon.svg" alt="Google" className="h-5 w-5" />
          Continue with Google
        </button> */}
      </form>
    </div>
  );
}