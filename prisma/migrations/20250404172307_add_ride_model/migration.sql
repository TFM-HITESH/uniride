-- CreateTable
CREATE TABLE "Ride" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "car_class" TEXT NOT NULL,
    "car_model" TEXT NOT NULL,
    "seats_left" INTEGER NOT NULL,
    "ride_cost" INTEGER NOT NULL,
    "gender_pref" TEXT NOT NULL,
    "air_conditioning" BOOLEAN NOT NULL,
    "desc_text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Ride_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
