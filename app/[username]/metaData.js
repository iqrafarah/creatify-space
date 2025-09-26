import prisma from "@/lib/db";

// Creates page info like titles and descriptions for user profiles
export async function generateMetadata({ params: { username } }) {
  try {
    // Get user data and their profile from database
    const userData = await prisma.user.findUnique({
      where: { username },
      include: { profile: true },
    });

    if (!userData || !userData.profile) {
      return {
        title: "User Not Found",
        description: "The requested user profile could not be found.",
      };
    }

    return {
      // Use profile name or username for the title
      title: userData.profile.name
        ? `${userData.profile.name} - Portfolio`
        : `@${userData.username}`,
      description:
        userData.profile.shortDescription ||
        userData.profile.headline ||
        `Check out ${userData.username}'s portfolio`,

      // Social media preview data
      openGraph: {
        title: userData.profile.name || userData.username,
        description:
          userData.profile.shortDescription || userData.profile.headline,
        images: userData.profile.imageUrl ? [userData.profile.imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Metadata generation error:", error);
    return {
      title: "User Profile",
      description: "User portfolio page",
    };
  }
}
