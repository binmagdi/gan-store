import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserCountry } from "./lib/utils";

const isProtectedRoute = createRouteMatcher(["/dashboard", "/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();

  // Creating a basic response
  let response = NextResponse.next();

  /*------------------Handel Country Detection------------------*/
  // Step 1: Check if country is already set in cookies
  const countryCookie = req.cookies.get("userCountry");

  if (countryCookie) {
    // If country is already set, return the response
    response = NextResponse.next();
  } else {
    response = NextResponse.redirect(new URL(req.url));
    // Step 2:get the user country using the helper function
    const userCountry = await getUserCountry();

    // Step 3: Set the country in cookies
    response.cookies.set("userCountry", JSON.stringify(userCountry), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
