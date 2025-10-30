import { API_BASE_URL } from "@/config";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(`${API_BASE_URL}/auth/login`);
}
