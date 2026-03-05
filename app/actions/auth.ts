"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) {
    throw new Error("Missing email or password");
  }

  const existingUser = await (db as any).user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await (db as any).user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  });

  return { success: true };
}
