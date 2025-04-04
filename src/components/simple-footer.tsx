import Link from "next/link";
import React from "react";
import { FaDev, FaGithub, FaTaxi } from "react-icons/fa";

type Props = {};

export default function SimpleFooter({}: Props) {
  return (
    <div className="flex flex-row justify-center items-center w-full border-t bottom-0">
      <div className="w-full md:w-[85%] py-4 px-2 flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row items-center md:gap-2 mb-4 md:mb-0">
          <FaTaxi className="text-xl opacity-85" />
          <p className="text-xl font-bold opacity-85">UniRide</p>
          <p className="text-sm opacity-65 ml-4">
            © 2025 UniRide. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-8">
          <div className="flex flex-row text-sm opacity-75 gap-3">
            <Link href="/legal/#terms" className="hover:underline">
              Terms
            </Link>
            <p className="block">•</p>
            <Link href="/legal/#privacy" className="hover:underline">
              Privacy
            </Link>
            <p className="block">•</p>
            <Link href="/legal/#support" className="hover:underline">
              Support
            </Link>
          </div>
          <div className="flex flex-row gap-3 text-2xl">
            <Link href="https://github.com/TFM-HITESH/uniride" target="_blank">
              <FaGithub />
            </Link>
            <Link href="/">
              <FaDev />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
