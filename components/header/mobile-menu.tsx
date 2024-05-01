"use client"

import React from "react"
import Link from "next/link"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface MobileMenuProps {
  children: React.ReactNode
}

export default function MobileMenu({ children }: MobileMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="py-16">
        {siteConfig.mainNav?.length
          ? siteConfig.mainNav?.map(
              (item, index) =>
                item.href && (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn("mt-5 flex items-center text-lg")}
                  >
                    <p className=" text-3xl text-custom">{item.title}</p>
                  </Link>
                )
            )
          : null}
      </SheetContent>
    </Sheet>
  )
}
