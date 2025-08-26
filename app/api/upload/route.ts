import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("product-photos")
    .upload(fileName, file, { upsert: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data } = supabase.storage.from("product-photos").getPublicUrl(fileName);

  return NextResponse.json({ url: data.publicUrl });
}
