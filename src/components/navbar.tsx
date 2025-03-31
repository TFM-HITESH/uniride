"use client";

import AuthButton from "@/app/auth/auth-button";
import React from "react";
import { ThemeToggle } from "./theme-toggle";
import { FaTaxi } from "react-icons/fa";
import Link from "next/link";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <div className="w-full flex flex-row py-3 px-5 border-b border-1 shadow-lg justify-between sticky top-0 backdrop-blur-lg z-50">
      <Link
        href="/"
        className="flex flex-row items-center justify-center gap-3"
      >
        <FaTaxi className="text-3xl opacity-85" />
        <p className="text-3xl font-bold opacity-85">UniRide</p>
      </Link>
      <div className="flex flex-row items-center justify-center gap-8">
        <Link
          href="/dashboard"
          className="text-md font-medium transition-colors hover:text-primary relative group"
        >
          Find Rides
          <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-primary transition-all duration-200 group-hover:w-full"></span>
        </Link>
        <Link
          href="/makeride"
          className="text-md font-medium transition-colors hover:text-primary relative group"
        >
          Post Rides
          <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-primary transition-all duration-200 group-hover:w-full"></span>
        </Link>
        <Link
          href="/dashboard"
          className="text-md font-medium transition-colors hover:text-primary relative group"
        >
          My Rides
          <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-primary transition-all duration-200 group-hover:w-full"></span>
        </Link>
        <Link
          href="/chat"
          className="text-md font-medium transition-colors hover:text-primary relative group"
        >
          Messages
          <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-primary transition-all duration-200 group-hover:w-full"></span>
        </Link>
      </div>
      <div className="flex flex-row items-center justify-center gap-3">
        <ThemeToggle />
        <AuthButton />
      </div>
    </div>
  );
}
