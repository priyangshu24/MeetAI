"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const FEATURED_ITEMS = [
  {
    title: "AI-Powered Transcription",
    description: "Get accurate transcriptions of your meetings in real-time with our advanced AI.",
    image: "/placeholder.svg",
    color: "bg-blue-500/10",
  },
  {
    title: "Virtual Assistants",
    description: "Connect with smart virtual assistants that can help you manage your tasks.",
    image: "/placeholder.svg",
    color: "bg-purple-500/10",
  },
  {
    title: "Secure Collaboration",
    description: "Collaborate with your team in a secure and private environment.",
    image: "/placeholder.svg",
    color: "bg-green-500/10",
  },
]

export function HomeCarousel() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Featured Features</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {FEATURED_ITEMS.map((item, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="overflow-hidden border-none shadow-lg">
                  <CardContent className={`flex flex-col p-0 ${item.color} aspect-square`}>
                    <div className="relative flex-1 p-6 flex flex-col justify-end">
                       <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-linear-to-b from-transparent to-black" />
                       <div className="relative z-10">
                          <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                          <p className="text-sm opacity-80">{item.description}</p>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="-left-12" />
          <CarouselNext className="-right-12" />
        </div>
      </Carousel>
    </div>
  )
}
