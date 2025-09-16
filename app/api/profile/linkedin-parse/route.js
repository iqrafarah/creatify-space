export const runtime = "nodejs";

import pdfParse from "pdf-parse";
import prisma from "@/lib/db";
import { verifySessionCookie } from "@/lib/session";
import { mapLinkedInTextToEntities } from "@/lib/linkedin-map";

export async function POST(req) {
  try {
    const userId = verifySessionCookie();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("linkedinPdf");
    if (!file || typeof file === "string") {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);

    // map raw text -> structured objects
    const { profile, experiences, skills } = mapLinkedInTextToEntities(parsed.text || "");

    // save to DB
    await prisma.$transaction(async (tx) => {
      await tx.profile.upsert({
        where: { userId },
        update: profile,
        create: { userId, ...profile },
      });

      await tx.experience.deleteMany({ where: { userId } });
      if (experiences.length) {
        await tx.experience.createMany({
          data: experiences.map((e, i) => ({ userId, ...e, order: i })),
        });
      }

      await tx.skill.deleteMany({ where: { userId } });
      if (skills.length) {
        await tx.skill.createMany({
          data: skills.map((name, i) => ({ userId, name, order: i })),
        });
      }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("parse error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
