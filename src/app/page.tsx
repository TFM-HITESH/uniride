import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <div className="flex flex-col w-[85%] gap-8">
        <div className="flex flex-col p-4 w-[80%] ">
          <div className="text-[16rem] font-black">UniRide</div>
          <div className="text-wrap text-8xl">
            Safe & Easy Cab Sharing for the VIT Community
          </div>
          <div className="text-2xl py-8">
            Connect with fellow students for hassle-free rides with friends.
            Secure, efficient and exclusively for VIT Vellore.
          </div>
          <div className="text-3xl">
            <Button className="text-2xl p-8">
              Login with your VIT Email to Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
