"use client"

import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"

interface NFTContainerProps {
  id: number
  kind: string
  title: string
  selected: boolean
  onClick: () => void
}

export default function NFTContainer({
  id,
  kind,
  title,
  selected = false,
  onClick,
}: NFTContainerProps) {
  interface ResponsiveImageProps {
    image: string
    alt: string
  }

  const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ image, alt }) => {
    const [screenSize, setScreenSize] = useState<number>(window.innerWidth)

    const handleResize = () => {
      setScreenSize(window.innerWidth)
    }

    useEffect(() => {
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])

    const getWidth = (): number => {
      if (screenSize >= 1024) return 36 // lg size
      if (screenSize >= 640) return 32 // sm size
      return 24 // base size
    }

    // Use the `image` directly in the src
    return (
      <img src={image} alt={alt} className="size-16 sm:size-20 lg:size-24" />
    )
  }
  const PIC_URL =
    "https://arweave.net/LPcSbe29BP10zETqtcCrS_JHuZ0AsiE2g0c4H-8G-eU/"
  return (
    <div
      className={`relative mx-auto flex w-fit cursor-pointer flex-col items-center justify-start rounded-md bg-white transition-transform duration-200 hover:scale-105`}
      onClick={onClick}
    >
      {selected && (
        <CheckCircle className="absolute right-2 top-2 size-5 text-green-500" />
      )}
      <ResponsiveImage
        image={PIC_URL + kind + ".png"}
        alt="Fox Logo"
        // className="size-36 sm:size-48 lg:size-56"
      />
      <div className="my-2 flex items-end ">
        <span className="xl:text-md text-sm !leading-none text-[#000000] md:text-sm ">
          FudFox
        </span>
        <span className="xl:text-md text-end text-xs  !leading-none text-[#000000] md:text-sm">
          {title}
        </span>
      </div>
    </div>
  )
}
