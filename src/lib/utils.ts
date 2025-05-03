import { PrismaClient } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import ColorThief from "colorthief";
import { twMerge } from "tailwind-merge";
import { db } from "./db";
import { Country } from "./types";
import countries from "@/data/countries.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to generate a unique Slug

export const generateUniqueSlug = async (
  baseSlug: string,
  model: keyof PrismaClient,
  field: string = "slug",
  seperator: string = "-"
) => {
  // Check if the slug already exists in the database
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existingRecord = await (db[model] as any).findFirst({
      where: {
        [field]: slug,
      },
    });
    if (!existingRecord) {
      break;
    }
    slug = `${slug}${seperator}${suffix}`;
    suffix++;
  }
  return slug;
};

// Helper function to grid grid classnames dependng on length
export const getGridClassName = (length: number) => {
  switch (length) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-2 grid-rows-2";
    case 4:
      return "grid-cols-2 grid-rows-1";
    case 5:
      return "grid-cols-2 grid-rows-6";
    case 6:
      return "grid-cols-2";
    default:
      return "";
  }
};

// Function to get prominent colors from an image
export const getDominantColors = (imgUrl: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imgUrl;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const colors = colorThief.getPalette(img, 4).map((color) => {
          // Convert RGB array to hex string
          return `#${((1 << 24) + (color[0] << 16) + (color[1] << 8) + color[2])
            .toString(16)
            .slice(1)
            .toUpperCase()}`;
        });
        resolve(colors);
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
  });
};

// Define Helper function to get user country
const DEFAULT_COUNTRY: Country = {
  name: "Egypt",
  code: "EG",
  city: "",
  region: "",
};

export async function getUserCountry(): Promise<Country> {
  let userCountry: Country = DEFAULT_COUNTRY;
  try {
    const res = await fetch(
      `https://ipinfo.io/?token=${process.env.IPINFO_TOKEN}`
    );

    if (res.ok) {
      
      const data = await res.json();
      userCountry = {
        name:
          countries.find((country) => country.code === data.country)?.name ||
          data.country,
        code: data.country,
        city: data.city,
        region: data.region,
      };
    }
  } catch (error) {
    console.log("🚀 ~ getUserCountry ~ error:", error);
  }
  return userCountry;
}
