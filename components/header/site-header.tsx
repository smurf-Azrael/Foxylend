"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import SeiIcon from "@/public/sei.svg"
import {
  WalletConnectButton,
  useCosmWasmClient,
  useSigningCosmWasmClient,
  useWallet,
} from "@sei-js/react"
import { AlignRight } from "lucide-react"
import discordIcon from "public/discord.svg"
import xIcon from "public/twitter.svg"

import { siteConfig } from "@/config/site"
import { Button, buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/header/main-nav"

import MobileMenu from "./mobile-menu"

export function SiteHeader() {
  const marketplace_address =
    "sei1fz28dcd3h8sppels6vg4suwshclyxvd63sxrp5dawshlwe486mrsejx78v"
  const { connectedWallet, accounts } = useWallet()
  const { cosmWasmClient: queryClient } = useCosmWasmClient()
  const { signingCosmWasmClient: signingClient } = useSigningCosmWasmClient()
  const [staked, setStaked] = useState(false)
  const [refresh, setRefresh] = useState(0)

  // const getStakeInfo = async () => {
  //   try {
  //     if (!accounts[0]) return
  //     const response = await queryClient?.queryContractSmart(
  //       marketplace_address,
  //       {
  //         get_staking: {
  //           address: accounts[0]?.address,
  //         },
  //       }
  //     )
  //     if (response === undefined) {
  //       setRefresh(refresh + 1)
  //     }
  //     if (response) setStaked(true)
  //   } catch (err) {
  //     console.log("get stake info error: ", err)
  //   }
  // }

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent px-4 backdrop-blur-lg">
      <div className="flex h-32 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="ml-16 flex items-center space-x-1">
            <div className=" flex w-44 justify-center gap-2 rounded-md bg-[#FBEB5F] px-2 py-1 shadow shadow-black/25 hover:bg-[#FBFB5F] ">
              {connectedWallet ? <Image src={SeiIcon} alt="sei" /> : <></>}
              <WalletConnectButton buttonClassName="text-center text-[20px] text-[#000000]  capitalize  whitespace-nowrap" />
            </div>
            <MobileMenu>
              <Button variant="ghost" size="icon" className="ml-2 lg:hidden">
                <AlignRight className="size-5" />
              </Button>
            </MobileMenu>
          </nav>
        </div>
        <div className="mx-2 flex min-w-24 justify-center gap-2">
          <Link href="/" className="flex items-center space-x-2 ">
            <Image
              src={xIcon}
              alt="Fox Logo"
              className=" size-8 rounded-full bg-white p-1"
            />
          </Link>
          <Link href="/" className="flex items-center space-x-2  ">
            <Image
              src={discordIcon}
              alt="Fox Logo"
              className=" size-8 rounded-full bg-white p-1"
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
