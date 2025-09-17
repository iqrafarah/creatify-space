'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function OnboardingPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    setFileError('');
    if (!selectedFile) return;
    if (selectedFile.type !== 'application/pdf') {
      setFileError('Please upload a PDF file');
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError('File size should be less than 5MB');
      return;
    }
    setFile(selectedFile);
  }

  function handleBoxClick() {
    fileInputRef.current?.click();
  }

async function handleUpload() {
  if (!file) {
    setFileError('Please select a LinkedIn PDF export file');
    return;
  }

  setIsUploading(true);
  setFileError('');

  try {
    // Step 1: Upload PDF to /api/profile/linkedin-upload
    const formData = new FormData();
    formData.append('linkedinPdf', file);

    const uploadRes = await fetch('/api/profile/linkedin-upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      const error = await uploadRes.json();
      throw new Error(error.message || 'Failed to process LinkedIn PDF');
    }

    const { text } = await uploadRes.json();

    if (!text || typeof text !== 'string') {
      throw new Error('No text extracted from PDF');
    }

    // Step 2: Send parsed text to /api/profile/linkedin-parse
    const parseRes = await fetch('/api/profile/linkedin-parse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!parseRes.ok) {
      const error = await parseRes.json();
      throw new Error(error.message || 'Failed to parse LinkedIn data');
    }

    // ✅ Success — redirect to dashboard
    router.push('/dashboard');

  } catch (error) {
    setFileError(error.message || 'Something went wrong. Please try again.');
  } finally {
    setIsUploading(false);
  }
}

  return (
    <div className="py-6 min-h-screen flex flex-col items-center overflow-auto">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.svg" alt="Logo" width={48} height={48} />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Upload your LinkedIn Profile PDF</h1>
        <p className="text-center text-gray-600 mb-6">
          Export your LinkedIn Profile as a PDF and upload it here.
        </p>
        <div 
          onClick={handleBoxClick}
          className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <Image src="/document-icon.png" alt="Upload" width={48} height={48} className="mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Upload PDF</p>
          <p className="text-xs text-gray-400 mb-4">You can only upload maximum of 5mb</p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf"
            id="pdf-upload"
          />
          <div className="inline-block px-4 py-1 bg-black text-white hover:bg-gray-300 rounded-md text-sm font-medium">
            + Add files
          </div>
          {file && (
            <p className="mt-4 text-sm text-gray-600">
              Selected: {file.name}
            </p>
          )}
          {fileError && (
            <p className="mt-2 text-sm text-red-600">
              {fileError}
            </p>
          )}
        </div>
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : "Upload LinkedIn profile"}
        </button>
       <div className="mt-6 border border-gray-200 rounded-md overflow-hidden">
  <details className="group">
    <summary className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer">
      <h3 className="font-medium text-gray-900">How to export your LinkedIn profile</h3>
      <span className="ml-6 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </summary>
            <div className="p-4 border-t border-gray-200 text-sm text-gray-600">
            <ol className="pl-5 list-decimal">
                <li className="mb-2">Go to your LinkedIn profile</li>
                <li className="mb-2">Click on "More" button below your profile header</li>
                <li className="mb-2">Select "Save to PDF"</li>
                <li>Upload the downloaded PDF here</li>
            </ol>
            </div>
        </details>
        </div>
      </div>
    </div>
  );
}