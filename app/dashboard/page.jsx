'use client';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        experiences: {
          orderBy: { createdAt: 'desc' }
        },
        educations: {
          orderBy: { createdAt: 'desc' }
        },
        certifications: {
          orderBy: { createdAt: 'desc' }
        },
        contacts: true
      }
    });

    if (!profile) {
      return NextResponse.json({ 
        message: 'Profile not found',
        hasProfile: false 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      profile,
      hasProfile: true 
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ 
      message: 'Failed to fetch profile',
      error: error.message 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// app/dashboard/page.js - Updated Dashboard Component
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import useAuth from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, isAuthorized, isLoading, handleLogout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('about');
  const router = useRouter();

  useEffect(() => {
    if (isAuthorized) {
      fetchProfile();
    }
  }, [isAuthorized]);

  async function fetchProfile() {
    try {
      const response = await fetch('/api/profile');
      const data = await response.json();
      
      if (response.ok && data.hasProfile) {
        setProfile(data.profile);
        setHasProfile(true);
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setHasProfile(false);
    } finally {
      setProfileLoading(false);
    }
  }

  if (isLoading || profileLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthorized) {
    return null;
  }

  // If no profile exists, show upload prompt
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Profile Found</h2>
          <p className="text-gray-600 mb-6">Upload your LinkedIn PDF to create your portfolio</p>
          <button
            onClick={() => router.push('/onboarding')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Upload LinkedIn Profile
          </button>
        </div>
      </div>
    );
  }

  // Portfolio sections based on your design
  const sections = [
    { id: 'about', label: 'About' },
    { id: 'experiences', label: 'Experiences' },
    { id: 'education', label: 'Education' },
    { id: 'skills', label: 'Skills' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Profile Avatar and Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              {profile?.user?.profileImage ? (
                <Image 
                  src={profile.user.profileImage} 
                  alt={profile.name} 
                  width={40} 
                  height={40} 
                  className="rounded-full"
                />
              ) : (
                <span className="text-sm font-semibold">
                  {profile?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </span>
              )}
            </div>
            <span className="font-semibold text-lg">{profile?.name || user?.username}</span>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`text-sm font-medium transition-colors ${'hover:text-white ' +
                  (activeSection === section.id ? 'text-white' : 'text-gray-400')
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/onboarding')}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Update Profile
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section */}
        {activeSection === 'about' && (
          <section className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-4xl mx-auto">
              {/* Availability Status */}
              <div className="flex items-center space-x-2 mb-8">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-400">Available for new opportunities</span>
              </div>

              {/* Main Heading */}
              <div className="mb-8">
                <h1 className="text-6xl md:text-8xl font-light mb-4">
                  <span className="text-gray-400">Hi there. I'm </span>
                  <span className="text-white">{profile?.name?.split(' ')[0] || 'User'}.</span>
                </h1>
                <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
                  {profile?.headline || 'Professional'}
                </h2>
              </div>

              {/* Summary */}
              <p className="text-xl text-gray-300 max-w-2xl mb-12 leading-relaxed">
                {profile?.summary || "Passionate professional with experience in creating innovative solutions and driving meaningful results."}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-medium transition-all transform hover:scale-105">
                  Hire me
                </button>
                <button className="border border-gray-600 hover:border-white text-white px-8 py-4 rounded-full font-medium transition-all">
                  Download my CV
                </button>
              </div>
            </div>
          </section>
        )}

        {/* About Section */}
        {activeSection === 'about' && (
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-light mb-8">About me</h2>
                <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                  <p>{profile?.summary || "Passionate about creating exceptional digital experiences and solving complex problems through innovative design and development."}</p>
                  <p>Here Are A Few Technologies I've Been Working With Recently:</p>
                </div>
                
                {/* Tech Skills Grid */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {profile?.skills?.slice(0, 6).map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-300">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Profile Image Placeholder */}
              <div className="bg-gray-800 rounded-lg aspect-square flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-300">
                    {profile?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Experience Section */}
        {activeSection === 'experiences' && (
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-light mb-12">Experience</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {profile?.experiences?.map((exp, index) => (
                  <div key={exp.id} className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors">
                    <div className="flex items-start space-x-4">
                      {/* Company Icon Placeholder */}
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold">
                          {exp.company?.charAt(0) || 'C'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-1">{exp.company}</h3>
                        <p className="text-gray-300 mb-2">{exp.title}</p>
                        <p className="text-sm text-gray-500">
                          {exp.duration} {exp.current && '• Present'}
                        </p>
                        {exp.description && (
                          <p className="text-gray-400 text-sm mt-3 line-clamp-3">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Education Section */}
        {activeSection === 'education' && (
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-light mb-12">Education</h2>
              <div className="space-y-6">
                {profile?.educations?.map((edu, index) => (
                  <div key={edu.id} className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{edu.institution}</h3>
                    <p className="text-purple-400 mb-1">{edu.degree}</p>
                    {edu.field && <p className="text-gray-300 mb-2">{edu.field}</p>}
                    <p className="text-gray-500 text-sm">{edu.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl font-light mb-12">Skills</h2>
              <div className="flex flex-wrap gap-3 mb-16">
                {profile?.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-6 py-3 bg-gray-900 hover:bg-gray-800 rounded-full text-white border border-gray-700 hover:border-gray-600 transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Contact CTA */}
              <div className="bg-gray-900 rounded-2xl p-12 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-xl font-semibold">
                    {profile?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <h3 className="text-3xl font-light mb-4">Let's be in touch!</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Ready to bring your ideas to life? Let's discuss your next project and create something amazing together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-full font-medium transition-all">
                    Hire me
                  </button>
                  <button className="border border-gray-600 hover:border-white text-white px-8 py-4 rounded-full font-medium transition-all">
                    Download my CV
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}