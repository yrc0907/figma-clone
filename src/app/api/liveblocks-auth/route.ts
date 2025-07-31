import { Liveblocks } from "@liveblocks/node";
import { env } from "~/env";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

const liveblocks = new Liveblocks({ secret: env.LIVEBLOCKS_SECRET_KEY });

export async function POST(req: Request) {
  const userSession = await auth();

  if (!userSession?.user) {
    return new Response("Unauthorized", { status: 403 });
  }

  // Get the users room, and invitations to rooms
  const user = await db.user.findUnique({
    where: { id: userSession.user.id },
    include: {
      ownedRooms: true,
      roomInvites: {
        include: {
          room: true,
        },
      },
    },
  });

  if (!user) {
    return new Response("User not found", { status: 404 });
  }

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.email ?? "Anonymous",
    },
  });

  user.ownedRooms.forEach((room) => {
    session.allow(`room:${room.id}`, session.FULL_ACCESS);
  });

  user.roomInvites.forEach((invite) => {
    session.allow(`room:${invite.room.id}`, session.FULL_ACCESS);
  });

  const { status, body } = await session.authorize();

  return new Response(body, { status });
}
