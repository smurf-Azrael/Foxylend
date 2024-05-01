import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import foxLogoSVG from "@/public/foxylend-logo.svg"

import { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils"

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex w-full gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src={foxLogoSVG}
          alt="Fox Logo"
          className="m-10 size-24 sm:size-32"
        />
      </Link>
      {items?.length ? (
        <nav className="ml-auto mr-20 hidden gap-6 lg:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg  text-custom",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
