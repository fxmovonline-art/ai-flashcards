"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function saveSession(title: string, content: string, cards: { question: string, answer: string }[]) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // If guest and has reached limit (simplified for now: guest sessions not saved to user history)
    // The user said: "guest allow, but limit usage only one allow with no reord saving in db"
    if (!userId) {
      // For guest, we don't save to the database as requested
      return { id: "guest", title, content, cards };
    }

    const studySession = await (db as any).studySession.create({
      data: {
        title,
        content,
        userId,
        cards: {
          create: cards.map(card => ({
            question: card.question,
            answer: card.answer
          }))
        }
      }
    });
    revalidatePath("/");
    return studySession;
  } catch (error) {
    console.error("Failed to save session:", error);
    throw new Error("Failed to save session");
  }
}

export async function getHistory() {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) return [];

    return await (db as any).studySession.findMany({
      where: { userId },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        title: true,
        createdAt: true
      }
    });
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return [];
  }
}

export async function getSession(id: string) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const studySession = await (db as any).studySession.findUnique({
      where: { id },
      include: {
        cards: true
      }
    });

    if (!studySession) return null;

    // Basic security check: only the owner can view the session
    if (studySession.userId && studySession.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return studySession;
  } catch (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }
}
