import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(request: NextRequest) {
  const filePathParam = request.nextUrl.searchParams.get("filePath");
  if (!filePathParam) {
    return NextResponse.json(
      { error: "filePath query is required" },
      { status: 400 }
    );
  }

  const normalizedPath = path.normalize(filePathParam);

  if (
    !normalizedPath.startsWith("uploads" + path.sep) &&
    !normalizedPath.startsWith("uploads/")
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const fullPath = path.join(process.cwd(), normalizedPath);

  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Convert Buffer to Uint8Array
  const fileBuffer = await fs.promises.readFile(fullPath);
  const fileArray = new Uint8Array(fileBuffer);

  const ext = path.extname(fullPath).toLowerCase();
  let contentType = "application/octet-stream";
  if (ext === ".jpeg" || ext === ".jpg") contentType = "image/jpeg";
  else if (ext === ".png") contentType = "image/png";
  else if (ext === ".gif") contentType = "image/gif";

  return new NextResponse(fileArray, {
    status: 200,
    headers: { "Content-Type": contentType }
  });
}
