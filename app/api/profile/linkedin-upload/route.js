import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // Required for file parsing

// Safe options for PDF parsing - prevents filesystem access
const DEFAULT_PDF_OPTIONS = {
  disableFontFace: true,  // No external font loading
  useSystemFonts: false   // No system font access
};

// Handles LinkedIn PDF resume uploads
export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('linkedinPdf');

    // Basic file validation
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Convert file to buffer safely
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Verify file has content
    if (buffer.length === 0) {
      return NextResponse.json({ error: 'Empty PDF file' }, { status: 400 });
    }

    // Parse PDF content
    const parsed = await pdfParse(buffer, DEFAULT_PDF_OPTIONS);

    return NextResponse.json({ text: parsed.text });
  } catch (err) {
    console.error('PDF Parse Error:', err);
    return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
  }
}