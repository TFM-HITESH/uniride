"use client";

import { Button } from "@/components/ui/button";
import { FaShieldAlt } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { IoChatbubbles } from "react-icons/io5";
import { TiTick } from "react-icons/ti";
import { toast } from "sonner";

import vitPic from "@/../public/TempImageColour.png";

import Image from "next/image";
import FeedbackCard from "@/components/feedback-card";
import ComplexFooter from "@/components/complex-footer";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <section
        className="flex flex-col w-[85%] gap-8 mb-[4rem] mt-[2rem]"
        id="home"
      >
        <div className="flex flex-col p-4 w-[80%] ">
          <div className="text-[16rem] font-black">UniRide</div>
          {/* <div className="text-nowrap text-8xl flex flex-col">
            <div className="flex flex-row gap-4 transition-all ease-in-out duration-100 justify-start">
              <div className="max-w-[50%] transition-all ease-in-out duration-100">
                <RotateText />
              </div>
              <div>Cab Sharing</div>
            </div> */}

          <div className="text-wrap text-8xl">
            Safe & Easy Cab Sharing for the VIT Community
          </div>
          <div className="text-2xl py-8">
            Connect with fellow students for hassle-free rides with friends.
            Secure, efficient and exclusively for VIT Vellore.
          </div>
          <div className="text-3xl">
            <Button
              className="text-2xl p-8"
              onClick={() =>
                toast.success("Login to the App", {
                  description:
                    "Only VIT Students are allowed to access the app",
                })
              }
            >
              Login with your VIT Email to Get Started
            </Button>
          </div>
        </div>
      </section>
      <section
        className="flex flex-col w-[100%] gap-8 items-center justify-center bg-sidebar-accent my-[4rem] py-[5rem]"
        id="features"
      >
        <div className="w-[85%] flex flex-col items-center justify-center gap-8">
          <div className="pb-[2rem] text-5xl font-bold">
            Why choose Uniride ?
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center justify-center text-center p-2 w-1/3">
              <FaShieldAlt className="text-4xl" />
              <div className="mt-1 text-2xl font-semibold">
                Secure Authentication
              </div>
              <div className="mt-3 text-lg text-accent-foreground/80 font-medium">
                VIT email verification ensures platform exclusivity and user
                safety
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 w-1/3">
              <IoChatbubbles className="text-4xl" />
              <div className="mt-1 text-2xl font-semibold">
                Private Chat Rooms
              </div>
              <div className="mt-3 text-lg text-accent-foreground/80 font-medium">
                Communicate securely without having to share personal contact
                details
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 w-1/3">
              <IoIosNotifications className="text-4xl" />
              <div className="mt-1 text-2xl font-semibold">
                Real-time Updates
              </div>
              <div className="mt-3 text-lg text-accent-foreground/80 font-medium">
                Instant notifications for ride matching and other events
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-[85%] flex flex-row my-[4rem]" id="safety">
        <div className="w-1/2 p-4 gap-y-8 flex flex-col">
          <div className="text-5xl font-bold">Your Safety is our Priority</div>
          <div className="text-accent-foreground/90 font-medium text-wrap w-[90%]">
            Advanced filtering options allow you to sort rides based on gender
            preferences and vehicle type. Our platform ensures a secure
            environment for all our users.
          </div>
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-row items-center justify-start gap-x-4">
              <TiTick className="text-2xl text-accent-foreground/70" />
              <p className="text-lg font-medium text-accent-foreground/70">
                Gender-based filtering
              </p>
            </div>
            <div className="flex flex-row items-center justify-start gap-x-4">
              <TiTick className="text-2xl text-accent-foreground/70" />
              <p className="text-lg font-medium text-accent-foreground/70">
                Verified VIT Community members
              </p>
            </div>
            <div className="flex flex-row items-center justify-start gap-x-4">
              <TiTick className="text-2xl text-accent-foreground/70" />
              <p className="text-lg font-medium text-accent-foreground/70">
                Secure in-app communication
              </p>
            </div>
            <div className="flex flex-row items-center justify-start gap-x-4">
              <TiTick className="text-2xl text-accent-foreground/70" />
              <p className="text-lg font-medium text-accent-foreground/70">
                Access Ride History
              </p>
            </div>
            <div className="flex flex-row items-center justify-start gap-x-4">
              <TiTick className="text-2xl text-accent-foreground/70" />
              <p className="text-lg font-medium text-accent-foreground/70">
                Vehicle-based filtering
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2 p-8 flex flex-row items-center justify-center">
          <div className="relative bg-gray-500/40 w-[90%] h-full rounded-xl">
            <Image
              src={vitPic}
              alt="Picture of the author"
              width={1920}
              height={1080}
              className="object-cover p-4 rounded-[1.5rem]"
            />
          </div>
        </div>
      </section>
      <section
        className="flex flex-col w-[100%] gap-8 items-center justify-center bg-sidebar-accent my-[4rem] py-[5rem]"
        id="how_it_works"
      >
        <div className="w-[85%] flex flex-col items-center justify-center gap-8">
          <div className="pb-[2rem] text-5xl font-bold">How it Works</div>
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="flex flex-col items-center justify-center text-center p-2 w-1/4">
              <div className="text-3xl font-black rounded-full bg-foreground text-background aspect-square p-4">
                1
              </div>
              <div className="mt-4 text-2xl font-semibold">Sign Up</div>
              <div className="mt-3 text-lg text-accent-foreground/80 font-medium text-nowrap">
                Register with your VIT Email
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 w-1/4">
              <div className="text-3xl font-black rounded-full bg-foreground text-background aspect-square p-4">
                2
              </div>
              <div className="mt-4 text-2xl font-semibold">
                Post or Find Rides
              </div>
              <div className="mt-3 text-lg text-accent-foreground/80 font-medium text-nowrap">
                Share your journey or join others
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 w-1/4">
              <div className="text-3xl font-black rounded-full bg-foreground text-background aspect-square p-4">
                3
              </div>
              <div className="mt-4 text-2xl font-semibold">Connect</div>
              <div className="mt-3 text-lg text-accent-foreground/80 font-medium text-nowrap">
                Chat in private rooms
              </div>
            </div>
            <div className="flex flex-col items-center justify-center text-center p-2 w-1/4">
              <div className="text-3xl font-black rounded-full bg-foreground text-background aspect-square p-4">
                4
              </div>
              <div className="mt-4 text-2xl font-semibold">Travel Together</div>
              <div className="mt-3 text-lg text-accent-foreground/80 font-medium text-nowrap">
                Share rides together safely
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="flex flex-col w-[85%] gap-8 mb-[4rem] mt-[2rem]"
        id="testimonials"
      >
        <div className="w-full flex flex-col items-center justify-start">
          <div className="pb-[3rem] text-5xl font-bold">What Students Say</div>
          <div className="w-full grid grid-cols-3  gap-12 items-center justify-center">
            <FeedbackCard
              name="Lorem Ipsum"
              branch="Computer Science"
              year="2025"
              comment="UniRide made my airport trips so much easier and more affordable. Love the economic nature of this app!"
            />
            <FeedbackCard
              name="John Doe"
              branch="Computer Science"
              year="2025"
              comment="No more Whatsapp Group chaos. This platform is exactly what we needed!"
            />
            <FeedbackCard
              name="Jane Doe"
              branch="Computer Science"
              year="2025"
              comment="The gender preference filter makes me feel much safer when sharing rides."
            />
          </div>
        </div>
      </section>
      <ComplexFooter />
    </div>
  );
}
