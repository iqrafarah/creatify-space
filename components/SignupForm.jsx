"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateEmail, validateUsername } from "@/lib/validators";
import Link from "next/link";
import Image from "next/image";
import Toast from "./Notifications/Toast";
import { signupWithEmail } from "@/lib/authService";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateEmail(email))
      return setError("Please enter a valid email address.");
    if (!validateUsername(username))
      return setError(
        "Username should be at least 2 characters long and contain only letters."
      );

    setError("");
    setIsSubmitting(true);

    const result = await signupWithEmail(email, username);

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setShowNotification(true);
    setTimeout(() => {
      router.push("/login");
    }, 3000);

    setIsSubmitting(false);
  }

  return (
    <div className="h-screen flex items-center">
      {showNotification && (
        <Toast
          id="magic-link-sent"
          message="Account created! login to continue."
          duration={3000}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 sm:max-w-sm w-full items-center mx-auto px-4"
      >
        <Image
          src="/logo.svg"
          alt="Logo"
          width={48}
          height={48}
          className="mb-4"
        />

        <h1 className="text-2xl font-semibold tracking-tight">
          Create Account
        </h1>
        <p className="text-sm text-muted mb-3">
          Enter your details to get started
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

        <div className="flex w-full items-center">
          <p className="font-medium mr-1">Creatify.space/</p>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border-gray-300 outline-none px-3 py-2 rounded-md bg-inherit transition border text-sm"
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm text-left w-full">{error}</p>
        )}

        <button
          disabled={isSubmitting}
          type="submit"
          aria-invalid={error ? "true" : "false"}
          className="w-full bg-[var(--primary)] hover:bg-[var(--btn)] text-white font-medium text-sm capitalize h-10 px-6 py-2 rounded-md flex gap-2 justify-center items-center"
        >
          {isSubmitting ? (
            <>
              <div className="loadingSpinner"></div>
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <p className="text-sm mt-2">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--primary)] hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}