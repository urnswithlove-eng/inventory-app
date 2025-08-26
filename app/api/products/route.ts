import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const { sku, description, photo_url, location_id, quantity } = body;

  // Insert product
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert([{ sku, description, photo_url }])
    .select()
    .single();

  if (productError) return NextResponse.json({ error: productError.message }, { status: 400 });

  // Insert product qty/location
  if (location_id && quantity) {
    await supabase.from("product_qty_location").insert([{
      product_id: product.product_id,
      location_id,
      quantity,
    }]);
  }

  return NextResponse.json(product);
}
