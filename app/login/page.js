"use client";
import { useState } from "react";

export default function AboutPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div>
      <form className="flex flex-col gap-2 sm:max-w-sm w-full items-center mt-[7rem] mx-auto px-4">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome Back</h1>
        <p className="text-sm text-muted mb-3">Enter your email and password</p>
    
        <input
              type="email"
              placeholder="name@gmail.com"
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="email"
              className="w-full border-input outline-none px-3 py-2 rounded-md bg-inherit transition border-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <div className="flex w-full items-center">
              <p className="font-medium mr-1">Creatify.space/</p>
              <input
                type="text"
                placeholder="username"
                value={username}
                className="w-full border-input outline-none px-3 py-2 rounded-md bg-inherit transition border-2 text-sm"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
        {error && (
          <p className="text-red-500 text-sm text-left w-full">{error}</p>
        )}

        <button
          disabled={isSubmitting}
          className="w-full bg-primary hover-bg-btn text-white font-medium text-sm capitalize h-10 px-6 py-2 rounded-md flex gap-2 justify-center items-center"
        >
          {isSubmitting ? (
            <>
              <div className="loadingSpinner"></div>
            </>
          ) : (
            "Send Magic Link"
          )}
        </button>

        {/* GOOGLE Button */}

        {/* Linkedin Button */}
      </form>
    </div>
  );
}
