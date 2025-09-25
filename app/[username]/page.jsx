"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import {fetchUserData} from "@/lib/userDataServices"

export default function UserProfilePage({ params }) {
  const { username } = use(params);
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchUserData(username);
        
        // Check if profile exists and is published
        if (!data?.profile || !data.profile.isPublished) {
          setIsLoading(false);
          router.replace("/404");
          return;
        }

        setUserData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
        router.replace("/404");
      }
    }

    fetchData();
  }, [username, router]);

  // Show loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show 404 if user not found or not published
  if (!userData || !userData.profile?.isPublished) {
    return notFound();
  }

  // Default colors if not set
  const colors = {
    backgroundColor: "#0d0d0d",
    headingColor: "#ffffff",
    positionColor: "#D5E4FD",
    textColor: "#d1d5db",
    borderColor: "#1e1e1e",
    buttonsColor: "#2563EB",
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className="h-screen page"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div
        className="max-w-4xl mx-auto px-4 py-3 sm:py-5 sm:mt-5"
        style={{ color: colors.textColor }}
      >
        {/* header section */}
        <header>
          <nav className="flex items-center justify-between flex-wrap mobile-menu">
            {userData.profile.imageUrl && (
              <Link href={"/"}>
                <div className="cursor-pointer flex items-center gap-4 cursor-default">
                  <Image
                    src={userData.profile?.imageUrl}
                    width={500}
                    height={500}
                    alt="logo"
                    layout="responsive"
                    objectFit="cover"
                    className="object-cover rounded-full border border-grey max-w-[60px] max-h-[60px] w-full h-full"
                  />
                  <p className="text-lg font-medium">
                    {userData.profile?.name || userData.username}
                  </p>
                </div>
              </Link>
            )}

            <ul
              className={`flex gap-10 text-sm text-lightgrey font-medium ml-auto ${
                isMenuOpen ? "block dropdown w-full" : "hidden"
              } md:flex`}
            >
              <li>
                <Link href="/work" className="hover:text-white">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Journal
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>

            <div
              id="hamburger"
              className={`md:hidden ${isMenuOpen ? "open" : ""}`}
              onClick={toggleMenu}
            >
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </nav>
        </header>
        {/* END header section */}

        {/* Hero Section */}
        {userData.profile && (
          <section
            id="hero"
            className="flex cursor-default flex-col gap-5 pt-[150px] lg:pt-[180px] items-start justify-center -mt-20"
          >
            {userData.profile.available === "true" && (
              <div className="flex items-center gap-3">
                <span className="dot"></span>
                <span className="text-[var(--lightgrey)] text-sm">
                  Available for new opportunities
                </span>
              </div>
            )}

            <div className="flex flex-col gap-2 text-4xl font-medium tracking-tight md:text-5xl lg:text6xl lg:leading-[1.1]">
              <h1 style={{ color: colors.headingColor }}>
                Hi there. I&rsquo;m {userData.profile.name || userData.username}
              </h1>
              <h2>{userData.profile.headline}</h2>
            </div>
            {userData.profile.shortDescription && (
              <p className="text-lg opacity-70 max-w-2xl">
                {userData.profile.shortDescription}
              </p>
            )}
            {userData.Footer.contactUrl && (
              <Link
                href={`mailto:${userData.Footer.contactUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="inline-block bg-[var(--purple)] text-white px-6 py-2 rounded-full text-base">
                  get in touch
                </span>
              </Link>
            )}
          </section>
        )}
        {/* END Hero Section */}

        {/* About Section */}
        {userData.profile?.summary && (
          <section
            id="about"
            className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 py-10 md:py-40"
          >
            <div>
              <h2
                className="text-3xl font-semibold mb-8"
                style={{ color: colors.headingColor }}
              >
                About Me
              </h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-line">
                  {userData.profile.summary}
                </p>
              </div>
            </div>

            {userData.profile.imageUrl && (
              <div>
                <Image
                  src={userData.profile?.imageUrl}
                  width={300}
                  height={300}
                  alt="logo"
                  className="max-w-full max-h-[450px] w-full h-screen rounded-md border border-[var(--grey)] object-cover"
                />
              </div>
            )}
          </section>
        )}
        {/* END About Section */}

        {/* Experience Section */}
        {userData.experiences && userData.experiences.length > 0 && (
          <section
            id="experience"
            className="flex flex-col gap-6 items-start justify-center h-full mb-5 pb-14"
          >
            <h2
              className="text-xl sm:text-2xl font-semibold"
              style={{ color: colors.headingColor }}
            >
              Experience
            </h2>

            <div className="grid sm:grid-cols-2 gap-x-2 gap-y-3 w-full">
              {userData.experiences.map((experience) => (
                <div
                  key={experience.id}
                  className="flex flex-row w-full gap-x-4 mt-5"
                >
                  <div className="bg-[var(--button)] border border-[var(--grey)] p-2 py-4 rounded-md flex flex-row items-center gap-4 w-full">
                    {experience.logo && (
                      <div className="w-15 h-10 min-w-10 rounded-full flex items-center justify-center">
                        <Image
                          src={experience.logo || "/logo.svg"}
                          width={200}
                          height={100}
                          alt="logo"
                          className="w-[200px] h-full min-h-[60px] rounded-xl object-cover"
                        />
                      </div>
                    )}

                    <div className="flex flex-col">
                      <p className="text-base tracking-tight line-clamp-1 font-medium text-start transition-all leading-normal">
                        {experience.company}
                      </p>
                      <p className="text-sm tracking-tight line-clamp-1 text-start transition-all leading-normal">
                        {experience.title} - {experience.duration}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* END Experience Section */}

        {/* Skills Section */}
        {userData.skills && userData.skills.length > 0 && (
          <section className="py-16 ">
            <div>
              <h2
                className="text-xl sm:text-2xl font-semibold"
                style={{ color: colors.headingColor }}
              >
                Skills
              </h2>
              <div className="flex flex-wrap gap-3  mt-5">
                {userData.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="flex items-center justify-center bg-[var(--button)] border border-[var(--grey)] px-8 h-10 min-w-[80px] rounded-md w-fit text-sm font-medium"
                    style={{
                      backgroundColor: colors.borderColor,
                      color: colors.textColor,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Footer Section */}
        <div id="contact" className="py-10">
          <div
            className="bg-[var(--button)] rounded-xl flex flex-col gap-y-5 py-16  justify-center items-center"
            style={{ border: `1px solid ${colors.borderColor}` }}
          >
            <Image
              src={userData.profile?.imageUrl || "/logo.svg"}
              width={50}
              height={50}
              alt="logo"
              className="rounded-full"
              style={{ border: `2px solidf ${colors.borderColor}` }}
            />
            <h3 className="text-white text-3xl md:text-4xl font-medium tracking-tight">
              {userData.Footer.title}
            </h3>
            <p className="text-center text-lightgrey text-lg leading-relaxed max-w-2xl">
              {userData.Footer.description}
            </p>

            {userData.Footer.contactUrl && (
              <Link
                href={`mailto:${userData.Footer.contactUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="inline-block bg-[var(--purple)] text-white px-6 py-2 rounded-full text-base">
                  get in touch
                </span>
              </Link>
            )}
          </div>
        </div>
        {/* END Footer Section */}
      </div>
    </div>
  );
}