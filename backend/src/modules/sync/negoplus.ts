import { z } from "zod";
import { env, negoPlusHeaders } from "../../config/env.js";

const variantSchema = z.object({ id: z.number().int(), nombre: z.string(), precio: z.coerce.number().finite() });
const groupSchema = z.object({ id: z.number().int(), nombre: z.string(), obligatorio: z.union([z.literal(0), z.literal(1), z.boolean()]), variantes: z.array(variantSchema) });
export const categorySchema = z.object({ id: z.number().int(), nombre: z.string().min(1), descripcion: z.string().nullable().optional() });
export const productSchema = z.object({
  id: z.number().int(), codigo: z.string().nullable().optional(), descripcion: z.string().min(1),
  descripcion_carta: z.string().nullable().optional(), descripcion_larga: z.string().nullable().optional(),
  precio: z.coerce.number().finite().nonnegative(), rubro_id: z.number().int().nullable().optional(), grupos: z.array(groupSchema).default([]),
});
export type NegoProduct = z.infer<typeof productSchema>;

async function getJson(path: string): Promise<unknown> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), env.NEGOPLUS_TIMEOUT_MS);
  try {
    const response = await fetch(new URL(path, env.NEGOPLUS_BASE_URL), { headers: { accept: "application/json", ...negoPlusHeaders }, signal: controller.signal });
    if (!response.ok) throw new Error(`NegoPlus respondió ${response.status}`);
    return response.json();
  } finally { clearTimeout(timeout); }
}

export const negoPlusClient = {
  getCategories: async () => z.array(categorySchema).parse(await getJson(`/magapi/rubros/${env.NEGOPLUS_BRANCH_ID}`)),
  getProducts: async () => z.array(productSchema).parse(await getJson(`/magapi/articulos/${env.NEGOPLUS_BRANCH_ID}`)),
};
