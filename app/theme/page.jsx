'use client'

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
                            src='/profile.jpg'
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
                    className={`flex gap-10 text-base text-lightgrey font-medium ml-auto ${isMenuOpen ? "block dropdown w-full" : "hidden"} md:flex`}
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
        {hero && (
          <div className="flex cursor-default flex-col gap-5 pt-[150px] lg:pt-[180px] items-start justify-center -mt-20">
            <div className="flex items-center gap-3">
              <span className="dot"></span>
              <span className="text-[var(--lightgrey)] text-sm">
                Available for new opportunities
              </span>
            </div>

            <div className="flex flex-col gap-2 text-4xl font-medium tracking-tight md:text-5xl lg:text6xl lg:leading-[1.1]">
              <h1 className="text-[var(--lightgrey)]">
                Hi there. I&rsquo;m Zoya.
              </h1>
              <h2>Front-end Developer</h2>
            </div>
            <p className="text-[var(--lightgrey)] text-lg leading-relaxed max-w-2xl">
              With a love for minimalism and impactful digital experiences.
              I&rsquo;m here to build products that feel intuitive, timeless,
              and uniquely crafted for every client.
            </p>
            <div className="flex gap-3">
              <Link href="#contact">
                <button className="bg-[var(--purple)] text-white font-medium h-12 py-3 px-8 rounded-full border border-[var(--purple)] inline-flex items-center justify-center hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-white">
                  Hire me
                </button>
              </Link>
              <Link
                href="https://buy.stripe.com/fZe3eN6Ox8TecJGbJ3"
                target="_blank"
              >
                <button className="bg-[var(--button)] text-white font-medium h-12 py-3 px-8 rounded-full border border-[var(--grey)] inline-flex items-center justify-center hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-white">
                  Get Template
                </button>
              </Link>
            </div>
          </div>
        )}
        {/* END Hero Section */}

        {/* About Section */}
        {about && about.about && (
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 py-10 md:py-40">
            <div>
              <h2
                className="text-xl sm:text-2xl font-semibold"
                style={{ color: initialColors.headingColor }}
              >
                About Me
              </h2>

              <p className="mt-4 text-[var(--lightgrey)] max-w-2xl leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. <br />
                <br />
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
                <br />
                <br />
                Excepteur sint occaecat cupidatat non proident anim id est
                laborum.
              </p>
            </div>

            <div>
              <Image
                src="/logo.svg"
                width={300}
                height={300}
                alt="logo"
                className="max-w-full max-h-[450px] w-full h-screen rounded-md border border-[var(--lightgrey)] object-cover"
              />
            </div>
          </div>
        )}
        {/* END About Section */}

        {experience && experience.length > 0 && (
          <div
            className="flex flex-col gap-6 items-start justify-center h-full mb-5 pb-14 sm:border-b"
            style={{ borderColor: initialColors.borderColor }}
          >
            <h2
              className="text-xl sm:text-2xl font-semibold"
              style={{ color: initialColors.headingColor }}
            >
              Experience
            </h2>
            <div className="grid sm:grid-cols-2 gap-x-2 gap-y-3 w-full">
              {experience.map((exp, index) => (
                <div key={index} className="flex flex-row w-full gap-x-4 mt-5">
                  <div className="bg-[var(--button)] border border-[var(--grey)] p-2 py-4 rounded-md flex flex-row items-center gap-4 w-full">
                    {exp.logo && (
                      <div className="w-15 h-10 min-w-10 rounded-full flex items-center justify-center">
                        <Image
                          src={exp.logo}
                          width={200}
                          height={100}
                          alt="logo"
                          className="w-[200px] h-full min-h-[60px] rounded-xl object-cover"
                          style={{
                            backgroundColor: "#000",
                            borderColor: initialColors.borderColor,
                            borderWidth: "1px",
                          }}
                        />
                      </div>
                    )}

                    <div className="flex flex-col">
                      <p
                        className="text-base tracking-tight line-clamp-1 font-medium text-start transition-all leading-normal"
                        style={{ color: initialColors.headingColor }}
                      >
                        {exp.company}
                      </p>
                      <p className="text-sm tracking-tight line-clamp-1 text-start transition-all leading-normal">
                        {exp.period}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
            <div className="flex flex-wrap gap-3">
              {skills[0].skills.map((skill, index) => (
                <span
                  key={index}
                  className="flex items-center justify-center bg-[var(--button)] border border-[var(--lightgrey)] px-8 h-10 min-w-[80px] rounded-md w-fit text-sm font-medium"
                  style={{ borderColor: initialColors.borderColor }}
                >
                  {skill}
                </span>
              ))}
            </div>
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
              Let&apos;s be in touch!
            </h3>
            <p className="text-center text-lightgrey text-lg leading-relaxed max-w-2xl">
              lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad
            </p>
            <div className="flex gap-3">
              <button className="bg-[var(--purple)] text-white font-medium h-12 py-3 px-8 rounded-full border border-[var(--purple)] inline-flex items-center justify-center hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-white">
                Hire me
              </button>
              <Link
                href="https://buy.stripe.com/fZe3eN6Ox8TecJGbJ3"
                target="_blank"
              >
                <button className="bg-[var(--button)] text-white font-medium h-12 py-3 px-8 rounded-full border border-[var(--grey)] inline-flex items-center justify-center hover:bg-[var(--foreground)] hover:text-[var(--background)] hover:border-white">
                  Get Template
                </button>
              </Link>
            </div>
          </div>
        </div>
        {/* END Footer Section */}
      </div>
    </div>
  );

}
