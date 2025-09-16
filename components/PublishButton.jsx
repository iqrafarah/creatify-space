import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const PublishButton = ({
  username,
  email,
  initialPublishState,
  onPublishToggle,
}) => {
  const [isPublished, setIsPublished] = useState(initialPublishState);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Client-side code
      const savedState = localStorage.getItem(`publishState_${username}`);
      if (savedState !== null) {
        setIsPublished(JSON.parse(savedState));
      }
    }
  }, [username]);

  useEffect(() => {
    async function fetchPublishStatus() {
      try {
        const response = await fetch(
          `/api/togglePublish?username=${encodeURIComponent(username)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setIsPublished(data.isPublished);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              `publishState_${username}`,
              JSON.stringify(data.isPublished)
            );
          }
        } else {
          console.error("Failed to fetch publish status");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchPublishStatus();
  }, [username]);

  const handleClick = async () => {
    try {
      // First, check if the user has access
      const accessResponse = await fetch(
        `/api/check-access?email=${encodeURIComponent(email)}`
      );
      if (!accessResponse.ok) {
        throw new Error(`HTTP error! status: ${accessResponse.status}`);
      }
      const accessData = await accessResponse.json();

      if (!accessData.hasAccess) {
        // User doesn't have access, redirect to upgrade page
        router.push("/upgrade");
        return;
      }

      // User has access, proceed with publish toggle
      const response = await fetch("/api/togglePublish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, isPublished: !isPublished }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsPublished(data.isPublished);
        if (typeof window !== "undefined") {
          localStorage.setItem(
            `publishState_${username}`,
            JSON.stringify(data.isPublished)
          );
        }
        onPublishToggle(data.isPublished);
      } else {
        console.error("Failed to toggle publish status");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="">
      <button
        type="button"
        className={`w-full font-medium text-[15px] px-4 py-2 rounded-md border ${
          isPublished
            ? "bg-white text-black shadow-sm border border-[#e7e5e4] hover:bg-[#f5f5f5]"
            : "bg-primary text-white border-[#e7e5e4] hover:bg-btn"
        }`}
        onClick={handleClick}
      >
        {isPublished ? "Unpublish page" : "Publish page"}
      </button>
      <p className="text-muted text-sm my-2 text-center">
        {isPublished ? "" : "Your page isn't visible to the public."}
      </p>
    </div>
  );
};

export default PublishButton;