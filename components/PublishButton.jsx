import { useState } from "react";
import { togglePublish } from "@/lib/publishService";
import { useRouter } from "next/navigation";

const PublishButton = ({ initialPublishState, onPublishToggle, username }) => {
  const [isPublished, setIsPublished] = useState(initialPublishState);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const data = await togglePublish(isPublished);
      setIsPublished(data.isPublished);
      onPublishToggle?.(data.isPublished);

      if (data.isPublished) {
        window.open(`http://localhost:3000/${username}`, "_blank");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`w-full font-medium text-sm px-4 py-2 rounded-md border ${
        isPublished
          ? "bg-white text-black shadow-sm border-[#e7e5e4] hover:bg-[#f5f5f5]"
          : "bg-[var(--primary)] text-white border-[#e7e5e4] hover:bg-btn"
      }`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : (isPublished ? "Unpublish" : "Publish")}
    </button>
  );
};

export default PublishButton;
