import Link from "next/link";
import React from "react";
import { FaTaxi } from "react-icons/fa";

type Props = {};

export default function ComplexFooter({}: Props) {
  return (
    <div className="w-full bg-foreground/90 text-background mt-[3rem] flex flex-row items-center justify-center">
      <div className="w-[85%] gap-8 py-12 flex flex-row">
        <div className="w-1/4 flex flex-col gap-4">
          <div className="flex flex-row items-center text-4xl gap-4 font-extrabold">
            <FaTaxi className="opacity-85" /> UniRide
          </div>
          <div className="text-background/70 font-medium">
            Making student travel safer, easier and more sustainable.
          </div>
        </div>
        <div className="gap-2 flex flex-col">
          <div className="text-2xl font-semibold pb-2">Quick Links</div>
          <Link href="#home" className="text-xl text-background/70 font-medium">
            Home
          </Link>
          <Link href="#home" className="text-xl text-background/70 font-medium">
            Features
          </Link>
          <Link href="#home" className="text-xl text-background/70 font-medium">
            Safety
          </Link>
          <Link href="#home" className="text-xl text-background/70 font-medium">
            How It Works
          </Link>
          <Link href="#home" className="text-xl text-background/70 font-medium">
            Testimonials
          </Link>
        </div>
        <div className="gap-2 flex flex-col">
          <div className="text-2xl font-semibold pb-2">Contact Us</div>
          <Link
            href="mailto:uniridevit@gmail.com"
            className="text-xl text-background/70 font-medium"
          >
            uniridevit@gmail.com
          </Link>
          <Link href="#home" className="text-xl text-background/70 font-medium">
            Features
          </Link>
          <Link href="#home" className="text-xl text-background/70 font-medium">
            Safety
          </Link>
          <Link href="#home" className="text-xl text-background/70 font-medium">
            How It Works
          </Link>
          <Link href="#home" className="text-xl text-background/70 font-medium">
            Testimonials
          </Link>
        </div>
        <div></div>
      </div>
    </div>
  );
}
