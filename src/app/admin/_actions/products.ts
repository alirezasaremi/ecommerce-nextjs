"use server";
import { z } from "zod";
import fs from "fs/promises";
import db from "@/db/db";
import { redirect } from "next/navigation";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addProductSchema = z.object({
  name: z.string().min(1),
  describition: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(formData: FormData) {
  const result = addProductSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  // rename and save file
  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${data.file.name}`;
  fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  // rename and save image
  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `/products/${crypto.randomUUID()}-${data.image.name}`;
  fs.writeFile(
    `public${imagePath}`,
    Buffer.from(await data.image.arrayBuffer())
  );

  //save product into database
  await db.product.create({
    data: {
      name: data.name,
      description: data.describition,
      priceInCents: data.priceInCents,
      filePath,
      imagesPath: imagePath
    },
  });

  redirect("/admin/products")
}
