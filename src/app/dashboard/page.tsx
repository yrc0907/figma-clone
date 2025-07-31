"use server";

import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import UserMenu from "~/components/dashboard/UserMenu";
import CreateRoom from "~/components/dashboard/CreateRoom";
import RoomsView from "~/components/dashboard/RoomsView";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const user = await db.user.findUniqueOrThrow({
    where: {
      id: session?.user.id,
    },
    include: {
      ownedRooms: true,
      roomInvites: {
        include: {
          room: true,
        },
      },
    },
  });

  const invitedRooms = user.roomInvites.map((x) => x.room);
  const allRooms = [...user.ownedRooms, ...invitedRooms];

  const uniqueRoomsMap = new Map();
  allRooms.forEach((room) => {
    uniqueRoomsMap.set(room.id, room);
  });
  const uniqueRooms = Array.from(uniqueRoomsMap.values());

  return (
    <div className="flex h-screen w-full">
      <div className="flex h-screen min-w-[264px] flex-col border-r border-gray-200 bg-white p-2">
        <UserMenu email={user.email} />
      </div>
      <div className="flex h-screen w-full flex-col">
        <div className="flex min-h-[50px] items-center border-b border-gray-200 bg-white pl-8">
          <h2 className="text-[13px]">Recents</h2>
        </div>
        <div className="flex h-full flex-col gap-10 p-8">
          <CreateRoom />
          <RoomsView rooms={uniqueRooms} currentUserId={session.user.id} />
        </div>
      </div>
    </div>
  );
}
