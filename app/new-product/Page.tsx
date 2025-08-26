"use client";

import { useState, useEffect } from "react";
import Input from "@/components/Input";
import Select from "@/components/Select";

export default function NewProductPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [locationId, setLocationId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then(setLocations);
  }, []);

  async function handleSubmit(e: any) {
    e.preventDefault();

    let photoUrl = "";
    if (photo) {
      // Resize client-side
      const img = await createImageBitmap(photo);
      const canvas = document.createElement("canvas");
      canvas.width = 200; canvas.height = 200;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, 200, 200);
      const resized = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/jpeg")
      );
      const formData = new FormData();
      formData.append("file", new File([resized], photo.name));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const { url } = await res.json();
      photoUrl = url;
    }

    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku, description, photo_url: photoUrl, location_id: locationId, quantity }),
    });

    alert("Product added!");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add New Product</h1>
      <Input label="SKU" value={sku} onChange={(e: any) => setSku(e.target.value)} />
      <Input label="Description" value={description} onChange={(e: any) => setDescription(e.target.value)} />
      <Input label="Photo" type="file" onChange={(e: any) => setPhoto(e.target.files[0])} />
      <Select
        label="Location"
        value={locationId}
        onChange={(e: any) => setLocationId(e.target.value)}
        options={locations.map((loc) => ({ value: loc.location_id, label: loc.name }))}
      />
      <Input label="Quantity" type="number" value={quantity} onChange={(e: any) => setQuantity(e.target.value)} />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg">Save</button>
    </form>
  );
}
