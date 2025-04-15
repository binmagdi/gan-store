import { verifyWebhook } from "@clerk/nextjs/webhooks";
import {
  type WebhookEvent,
  type UserJSON,
  clerkClient,
  DeletedObjectJSON,
} from "@clerk/nextjs/server";
import { User } from "@/generated/prisma";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const evt = (await verifyWebhook(req)) as WebhookEvent;

    console.log(
      `Received webhook with ID ${evt.data.id} and event type of ${evt.type}`
    );

    // When user is created or updated, we want to update the user in our database
    if (evt.type === "user.created" || evt.type === "user.updated") {
      const data = evt.data as UserJSON;
      const user: Partial<User> = {
        id: data.id,
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        fullName: `${data.first_name} ${data.last_name}`.trim(),
        email: data.email_addresses[0]?.email_address,
        picture: data.image_url,
      };
      if (!user) return;

      const dbUser = await db.user.upsert({
        where: {
          email: user.email,
        },
        update: user,
        create: {
          id: user.id!,
          firstName: user.firstName!,
          lastName: user.lastName!,
          fullName: user.fullName!,
          email: user.email!,
          picture: user.picture!,
          role: user.role || "USER",
        },
      });

      const client = await clerkClient();
      await client.users.updateUserMetadata(data.id, {
        privateMetadata: {
          role: dbUser.role || "USER",
        },
      });
    }

    // When user is deleted, we want to delete the user in our database
    if (evt.type === "user.deleted") {
      const data = evt.data as DeletedObjectJSON;
      await db.user.delete({
        where: {
          id: data.id,
        },
      });
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
