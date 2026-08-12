"use server";

import { unstable_cache } from "next/cache";
import { parse } from "node-html-parser";
import { getUser } from "@/services/auth";
import type { InventoryEntry } from "@/types/api";

const ZZTOOLS_URL = "https://zzztools.epfl.ch/inventaire/default.aspx";
const HIDDEN_FIELD_REGEX = /<input type="hidden"[^>]* name="([^"]*)"[^>]* value="([^"]*)"[^>]*\/>/g;
const YELLOW_STICKER_CODE_REGEX = /^[A-Z][0-9]+$/;

let hiddenFieldsCache: Record<string, string> | undefined;

async function getHiddenFields(): Promise<Record<string, string>> {
  if (hiddenFieldsCache) return hiddenFieldsCache;

  const response = await fetch(ZZTOOLS_URL);
  const html = await response.text();

  const fields: Record<string, string> = {};
  for (const match of html.matchAll(HIDDEN_FIELD_REGEX)) {
    fields[match[1]] = match[2];
  }

  hiddenFieldsCache = fields;
  return fields;
}

async function queryInventory(yellowStickerCode: string): Promise<string> {
  const payload = {
    ctl00$ContentPlaceHolder1$TextBox1: yellowStickerCode,
    ctl00$ContentPlaceHolder1$Button1: "OK",
    ...(await getHiddenFields()),
  };

  const response = await fetch(ZZTOOLS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams(payload).toString(),
  });

  return await response.text();
}

function parseZztoolsResponse(html: string): InventoryEntry | null {
  if (html.includes("AUCUN EQUIPEMENT NE CORRESPOND")) return null;

  const parsed = parse(html);
  const label1 = parsed.querySelector("#ctl00_ContentPlaceHolder1_Label1");
  const label2 = parsed.querySelector("#ctl00_ContentPlaceHolder1_Label2");

  const header = label1?.childNodes[0]?.childNodes[0]?.rawText;
  const softwareStatus = label2?.childNodes[0]?.childNodes[0]?.childNodes[0]?.rawText;

  const features: Record<string, string> = {};
  let purchaseDate: string | undefined;

  for (const node of label1?.childNodes ?? []) {
    const nodeText = node.toString();
    if (nodeText.startsWith("<")) continue;

    const [rawKey, value] = nodeText.split(" = ");
    if (!value) continue;

    const key = rawKey.replace(/^[ >]*/, "");
    features[key] = value.trim();

    if (key === "ANSDT") {
      const match = value.match(/^(\d{4})(\d{2})(\d{2})$/);
      if (match) {
        purchaseDate = `${match[1]}-${match[2]}-${match[3]}`;
      }
    }
  }

  return { header, softwareStatus, purchaseDate, features };
}

const getCachedInventoryEntry = unstable_cache(
  async (code: string) => {
    const html = await queryInventory(code);
    return parseZztoolsResponse(html);
  },
  ["inventory-by-code"],
  { revalidate: 300 },
);

export async function checkInventory(yellowStickerCode: string): Promise<InventoryEntry | null> {
  await getUser();

  const code = yellowStickerCode.trim().toUpperCase();
  if (!YELLOW_STICKER_CODE_REGEX.test(code)) {
    throw new Error("Bad yellow sticker code");
  }

  try {
    return await getCachedInventoryEntry(code);
  } catch (error) {
    console.error("Error checking inventory:", error);
    return null;
  }
}
