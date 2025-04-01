"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button"; // Adjust path if needed
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ColourAvatar from "@/components/colour-avatar";
import { processName } from "@/lib/utils";
import { FaGoogle } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";

export default function AuthButton() {
  const { data: session } = useSession();

  return session ? (
    <Popover>
      <PopoverTrigger>
        <ColourAvatar name={session?.user?.name ?? "Guest"} />
      </PopoverTrigger>
      <PopoverContent className="mr-[1rem] mt-[0.25rem] ">
        <div className="w-full flex h-full justify-end flex-col items-center">
          <div className="flex flex-col text-right">
            <p className="text-lg">
              {processName(session?.user?.name ?? "Guest")}
            </p>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email}
            </p>
          </div>
          <div className="w-full h-[1px] my-2 bg-foreground opacity-45"></div>
          <div className="w-full gap-2 flex flex-col">
            <Button className="w-full" variant={"secondary"}>
              <Link
                href="/user"
                className="w-full flex flex-row items-center justify-center gap-2"
              >
                <CgProfile /> Profile
              </Link>
            </Button>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })} // ✅ Explicitly set redirect
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ) : (
    <Button
      onClick={() => signIn("google")}
      className="flex flex-row items-center justify-center gap-3"
    >
      <FaGoogle />
      Login with VIT Email
    </Button>
  );
}
