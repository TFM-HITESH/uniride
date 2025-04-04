import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import React from "react";
import { FaDev, FaGithub, FaTaxi } from "react-icons/fa";

type Props = {};

export default function ComplexFooter({}: Props) {
  return (
    <div className="w-full bg-foreground/90 text-background mt-[3rem] flex flex-row items-center justify-center">
      <div className="w-[85%] gap-8 py-12 flex flex-row justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center text-4xl gap-4 font-extrabold">
            <FaTaxi className="opacity-85" /> UniRide
          </div>
          <div className="text-background/70 font-medium">
            Making student travel safer, easier and more sustainable.
          </div>
        </div>
        <div className="gap-2 flex flex-col">
          <div className="text-2xl font-semibold pb-2">Quick Links</div>
          <ScrollLink
            to="home"
            smooth={true}
            duration={500}
            className="text-xl text-background/70 font-medium cursor-pointer "
          >
            Home
          </ScrollLink>
          <ScrollLink
            to="features"
            smooth={true}
            duration={500}
            className="text-xl text-background/70 font-medium cursor-pointer "
          >
            Features
          </ScrollLink>
          <ScrollLink
            to="safety"
            smooth={true}
            duration={500}
            className="text-xl text-background/70 font-medium cursor-pointer "
          >
            Safety
          </ScrollLink>
          <ScrollLink
            to="how_it_works"
            smooth={true}
            duration={500}
            className="text-xl text-background/70 font-medium cursor-pointer "
          >
            How It Works
          </ScrollLink>
          <ScrollLink
            to="testimonials"
            smooth={true}
            duration={500}
            className="text-xl text-background/70 font-medium cursor-pointer "
          >
            Testimonials
          </ScrollLink>
        </div>
        <div className="  gap-2 flex flex-col">
          <div className="text-2xl font-semibold pb-2">Contact Us</div>
          <Link
            href="mailto:uniridevit@gmail.com"
            className="text-xl text-background/70 font-medium"
          >
            uniridevit@gmail.com
          </Link>
          <div className="text-lg text-background/60 font-medium">
            VIT University
          </div>
          <div className="text-md text-background/60 font-medium">
            Vellore, Tamil Nadu
          </div>
        </div>
        <div className="  gap-2 flex flex-col">
          <div className="text-2xl font-semibold pb-2">Meet The Developers</div>
          <Link
            href="https://github.com/TFM-HITESH/uniride"
            target="_blank"
            className="text-xl text-background/70 font-medium flex flex-row items-center gap-2"
          >
            <FaGithub className="text-2xl" />
            Github
          </Link>
          {/* <Link href="" className="text-xl text-background/70 font-medium">
            LinkedIn
          </Link> */}
          <Link
            href="/profile"
            className="text-xl text-background/70 font-medium flex flex-row items-center gap-2"
          >
            <FaDev className="text-2xl" />
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
