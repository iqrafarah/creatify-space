import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // Required for file parsing

// Create options for the PDF parser to prevent it from accessing filesystem resources
const DEFAULT_PDF_OPTIONS = {
  // Prevent the library from attempting to load external resources
  disableFontFace: true,
  // Stop the library from trying to access the filesystem
  useSystemFonts: false
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('linkedinPdf');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate that it's a PDF file
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    // Use Buffer.from() instead of the deprecated Buffer constructor
    const buffer = Buffer.from(arrayBuffer);

    // Only proceed if we have actual content
    if (buffer.length === 0) {
      return NextResponse.json({ error: 'Empty PDF file' }, { status: 400 });
    }

    // We can't fix the internal usage of deprecated Buffer in pdf-parse library,
    // but we can use the latest Buffer methods in our own code
    const parsed = await pdfParse(buffer, DEFAULT_PDF_OPTIONS);

    return NextResponse.json({ text: parsed.text });
  } catch (err) {
    console.error('PDF Parse Error:', err);
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
  }
}
