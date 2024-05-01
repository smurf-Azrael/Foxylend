"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import discordIcon from "@/public/discord.svg"
import xIcon from "@/public/x.svg"
import { fetchStatistic } from "@/services/common/fetchStatistic"

import { Button } from "@/components/ui/button"

export default function IndexPage() {
  const [totalStaked, setTotalStaked] = useState(0)
  const [totalClaimedPoints, setTotalClaimedPoints] = useState(0)
  const [statisticLoading, setStatisticLoading] = useState(true)

  useEffect(() => {
    setStatisticLoading(true)
    fetchStatistic().then((res: any) => {
      if (res?.length != 0) {
        setTotalStaked(parseInt(res?.total_staked))
        setTotalClaimedPoints(parseInt(res?.total_claimed_points) / 1000000)
      }
      setStatisticLoading(false)
    })
  }, [])
  return (
    <section className="container pb-3 pt-6 md:py-10">
      <div className="mt-20">
        <h1 className="text-shadow font-inria mx-auto text-center text-5xl text-custom sm:text-6xl md:text-7xl lg:text-9xl">
          BORROW AND LEND AGAINST YOUR NFTS
        </h1>
      </div>
      <div className="mt-20 flex items-center justify-center gap-16 ">
        <Button
          variant={"gray"}
          className="whitespace-nowrap px-12 py-8 text-lg font-bold md:text-xl"
        >
          LEND
        </Button>
        <Button className="whitespace-nowrap px-12 py-8 text-lg font-bold md:text-xl">
          BORROW
        </Button>
        {/* <Link href="/" className="flex items-center space-x-2 ">
          <Image
            src={xIcon}
            alt="Fox Logo"
            className="size-4 md:size-6 lg:size-8"
          />
        </Link>
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={discordIcon}
            alt="Fox Logo"
            className="size-4 md:size-6 lg:size-8"
          />
        </Link> */}
      </div>
    </section>
  )
}
