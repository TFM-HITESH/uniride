"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ColourAvatar from "@/components/colour-avatar";
import { processName } from "@/lib/utils";
import { FaGoogle } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FiSettings } from "react-icons/fi"; // Admin icon
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Helper function to check if user is admin
const isAdminUser = (email?: string | null) => {
  if (!email) return false;
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];
  return adminEmails.includes(email);
};

export default function AuthButton() {
  const { data: session } = useSession();
  const isAdmin = isAdminUser(session?.user?.email);

  return session ? (
    <Popover>
      <PopoverTrigger>
        <ColourAvatar name={session?.user?.name ?? "Guest"} />
      </PopoverTrigger>
      <PopoverContent className="mr-[1rem] mt-[0.25rem]">
        <div className="w-full flex h-full justify-end flex-col items-center">
          <div className="flex flex-col text-right w-full">
            <p className="text-lg">
              {processName(session?.user?.name ?? "Guest")}
            </p>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email}
            </p>
            {/* {isAdmin && (
              <Badge variant="outline" className="mt-1 self-end">
                Admin
              </Badge>
            )} */}
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

            {/* Admin Dashboard Button - Only shows for admins */}
            {isAdmin && (
              <Button className="w-full" variant={"outline"}>
                <Link
                  href="/admin"
                  className="w-full flex flex-row items-center justify-center gap-2"
                >
                  <FiSettings /> Admin
                </Link>
              </Button>
            )}

            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
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
