"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Static mock data for the theme preview
const mockUserData = {
  colors: {
    backgroundColor: "#0d0d0d",
    headingColor: "#ffffff",
    positionColor: "#D5E4FD",
    textColor: "#d1d5db",
    borderColor: "#1e1e1e",
    buttonsColor: "#2563EB",
  },
  hero: {
    image: "/logo.svg",
    title: "Jane Doe",
    position: "Full Stack Developer",
    description:
      "Passionate about creating intuitive and functional web applications with modern technologies.",
  },
  about: {
    about:
      "I'm a full stack developer with 5 years of experience building web applications with React, Node.js, and other modern technologies. I love solving complex problems and creating clean, efficient code.",
  },
  experience: [
    {
      company: "Tech Company",
      period: "2020 - Present",
      logo: "/logo.svg",
    },
    {
      company: "Startup Inc",
      period: "2018 - 2020",
      logo: "/logo.svg",
    },
  ],
  skills: [
    {
      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "CSS",
        "HTML",
        "TypeScript",
        "Express",
        "MongoDB",
        "PostgreSQL",
      ],
    },
  ],
  portfolio: [
    {
      href: "https://example.com",
      image: "/logo.svg",
    },
    {
      href: "https://example.com",
      image: "/logo.svg",
    },
    {
      href: "https://example.com",
      image: "/logo.svg",
    },
  ],
  footer: {
    title: "Let's Connect",
    description:
      "I'm always open to discussing new projects and opportunities.",
    email: "jane.doe@example.com",
  },
};

// This is the main page component
export default function ThemePage() {
  const userData = mockUserData;
  const initialColors = userData.colors;
  const { hero, about, experience, skills, portfolio, footer } = userData;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className="h-screen page"
      style={{ backgroundColor: initialColors.backgroundColor }}
    >
      <div
        className="max-w-4xl mx-auto px-4 py-3 sm:py-5 sm:mt-5"
        style={{ color: initialColors.textColor }}
      >
        {/* header section */}
        <header className="">
          <nav className="flex items-center justify-between flex-wrap mobile-menu">
            <Link href={"/"}>
              <div className="cursor-pointer flex items-center gap-4 cursor-default">
                <Image
                  src="/profile.jpg"
                  width={500}
                  height={500}
                  alt="logo"
                  layout="responsive"
                  objectFit="cover"
                  className="object-cover rounded-full border-2 border-grey max-w-[60px] max-h-[60px] w-full h-full"
                />
                <p className="text-xl font-medium">Zoya</p>
              </div>
            </Link>

            <ul
              className={`flex gap-10 text-base text-lightgrey font-medium ml-auto ${
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
              <h1 className="text-[var(--lightgrey)]">
                Hi there. I&rsquo;m {userData.profile.title}
              </h1>
              <h2>{data.position}</h2>
            </div>
            {userData.profile.shortDescription && (
              <p className="text-lg opacity-70 max-w-2xl mx-auto">
                {userData.profile.shortDescription}
              </p>
            )}
            {userData.Footer.contactUrl && (
              <div className="mt-6">
                <Link
                  href={`mailto:${userData.Footer.contactUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="inline-block bg-[var(--purple)] text-white px-6 py-2 rounded-full text-base">
                    get in touch
                  </span>
                </Link>
              </div>
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
                className="text-3xl font-bold mb-8"
                style={{ color: initialColors.headingColor }}
              >
                About Me
              </h2>

              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed whitespace-pre-line">
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

        {userData.experiences && userData.experiences.length > 0 && (
          <section id="experience"
            className="flex flex-col gap-6 items-start justify-center h-full mb-5 pb-14 sm:border-b"
            style={{ borderColor: colors.borderColor }}
          >
            <h2
              className="text-xl sm:text-2xl font-semibold"
              style={{ color: colors.headingColor }}
            >
              Experience
            </h2>

            <div className="grid sm:grid-cols-2 gap-x-2 gap-y-3 w-full">
              {userData.experiences.map((experience) => (
                <div key={experience.id} className="flex flex-row w-full gap-x-4 mt-5">
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
        {skills && skills.length > 0 && skills[0].skills.length > 0 && (
          <div
            className="flex flex-col gap-6 my-8 items-start border-b pb-12"
            style={{ borderColor: initialColors.borderColor }}
          >
            <h2
              className="text-xl sm:text-2xl font-semibold"
              style={{ color: initialColors.headingColor }}
            >
              Skills
            </h2>
          </div>
        )}
        {/* END Skills Section */}

        {/* Footer Section */}
        <div id="contact" className="py-10 md:py-40">
          <div className="bg-[var(--button)] rounded-xl border border-[var(--grey)] flex flex-col gap-y-5 py-16  justify-center items-center">
            <Image
              src="/profile.jpg"
              width={50}
              height={50}
              alt="logo"
              className="bg-white border border-grey rounded-full"
            />
            <h3 className="text-white text-3xl md:text-4xl font-medium tracking-tight">
              {userData.Footer.title}
            </h3>
            <p className="text-center text-lightgrey text-lg leading-relaxed max-w-2xl">
              {userData.Footer.description}
            </p>
          
           {userData.Footer.contactUrl && (
                <a
                  href={userData.Footer.contactUrl}
                  className="inline-block px-8 py-4 rounded-lg font-semibold transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: colors.headingColor,
                    color: colors.backgroundColor,
                  }}
                >
                  Get In Touch
                </a>
              )}
              
          </div>
        </div>
        {/* END Footer Section */}
      </div>
    </div>
  );
}
