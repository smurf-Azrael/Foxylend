"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import foxIcon from "@/public/foxylend-logo.svg"
import seiWhiteIcon from "@/public/sei-white.svg"
import { fetchStatistic } from "@/services/common/fetchStatistic"
import { Separator } from "@radix-ui/react-separator"
import { useCosmWasmClient, useWallet } from "@sei-js/react"
import { Search } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import NFTContainer from "@/components/common/nft-container"

const lendData = [
  {
    collection: "Fud Foxes",
    pool: "954.54",
    offer: "98.5",
    interest: "26.343",
    duration: "14D",
  },
  {
    collection: "Fud Foxes",
    pool: "8.54",
    offer: "98.5",
    interest: "26.343",
    duration: "14D",
  },
  {
    collection: "Fud Foxes",
    pool: "94.54",
    offer: "98.5",
    interest: "26.343",
    duration: "14D",
  },
  {
    collection: "Fud Foxes",
    pool: "8854.54",
    offer: "98.5",
    interest: "26.343",
    duration: "14D",
  },
]

export default function Borrow() {
  const [openModal, setOpenModal] = useState(false)

  const [totalStaked, setTotalStaked] = useState(0)
  const [totalClaimedPoints, setTotalClaimedPoints] = useState(0)
  const [isNFTLoading, setIsNFTLoading] = useState(true)
  const [statisticLoading, setStatisticLoading] = useState(true)
  const fetchUnsteikCount = async () => {
    const response = await queryClient?.queryContractSmart(
      process.env.NEXT_PUBLIC_STEIK_ADDRESS || "",
      {
        get_steiker_info: { address: accounts[0]?.address, limit: 30 },
      }
    )
    console.log(accounts, "accounts")
    console.log(response, "response")
    return response?.steik_info?.map((item: any) => item?.token_id)
  }

  const { connectedWallet, accounts } = useWallet()
  const { cosmWasmClient: queryClient } = useCosmWasmClient()
  const [selectedItems, setSelectedItems] = useState<
    Array<{ id: number; kind: string; title: string; selected: boolean }>
  >([
    { id: 1, kind: "1", title: "1", selected: false },
    { id: 2, kind: "2", title: "2", selected: false },
    { id: 3, kind: "3", title: "3", selected: false },
  ])
  const toggleSelectedItem = (id: number) => {
    const updatedItems = selectedItems.map((item) => {
      if (item.id === id) {
        return { ...item, selected: !item.selected }
      }
      return item
    })
    setSelectedItems(updatedItems)
  }
  // useEffect(() => {
  //   console.log(accounts)
  //   if (connectedWallet && queryClient) {
  //     setIsNFTLoading(true)
  //     fetchUnsteikCount().then((res: Array<string>) => {
  //       if (res?.length != 0) {
  //         const fetchedItems = res?.map((item: string, index: number) => ({
  //           id: index,
  //           kind: item,
  //           title: item,
  //           selected: false,
  //         }))
  //         console.log(fetchedItems, "fetchedItems----")
  //         setSelectedItems(fetchedItems)
  //       }
  //       setIsNFTLoading(false)
  //     })
  //   }
  //   if (!connectedWallet) {
  //     setIsNFTLoading(false)
  //     setSelectedItems([])
  //   }
  //   setStatisticLoading(true)
  //   fetchStatistic().then((res: any) => {
  //     if (res?.length != 0) {
  //       setTotalStaked(parseInt(res?.total_staked))
  //       setTotalClaimedPoints(parseInt(res?.total_claimed_points) / 1000000)
  //       setStatisticLoading(false)
  //     }
  //   })
  // }, [accounts, connectedWallet, queryClient])
  return (
    <section className="px-16 pb-3 pt-6">
      <h1 className="font-inria mx-auto mb-5 text-left text-4xl text-custom sm:text-5xl md:text-6xl lg:text-7xl">
        BORROW AGAINST YOUR NFTS
      </h1>
      <div className="flex items-center gap-3">
        <Search color="white" />
        <Input
          placeholder="Search Collections"
          className=" border-0 bg-transparent text-white focus:border-0"
        />
      </div>
      <Separator className="mb-2 border" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35%]">Collection</TableHead>
            <TableHead className="w-[12%] text-right">Available pool</TableHead>
            <TableHead className="w-[12%] text-right">Best offer</TableHead>
            <TableHead className="w-[12%] text-center">Interest</TableHead>
            <TableHead className="w-[12%] text-center">Duration</TableHead>
            <TableHead className="w-[12%] text-center"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lendData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {item.collection}
                </div>
              </TableCell>
              <TableCell className="font-medium ">
                <div className="flex items-center justify-end gap-2 text-right">
                  <Image src={seiWhiteIcon} alt="sei" />
                  {item.pool}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                <div className="flex items-center justify-end gap-2 text-right">
                  <Image src={seiWhiteIcon} alt="sei" />
                  {item.offer}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2 text-center text-lg font-bold text-[#76FF6A]">
                  <Image src={seiWhiteIcon} alt="sei" />
                  {item.interest}
                </div>
              </TableCell>
              <TableCell className="text-center font-medium">
                {item.duration}
              </TableCell>
              <TableCell className="text-center font-medium">
                <Button
                  className="whitespace-nowrap px-6 py-2 text-lg font-bold md:text-xl"
                  onClick={() => {
                    setOpenModal(true)
                  }}
                >
                  BORROW
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog
        open={openModal}
        onOpenChange={(open) => {
          setOpenModal(open)
        }}
      >
        <DialogContent className="flex flex-col items-center bg-[#181616] sm:max-w-[425px]">
          <Image src={foxIcon} alt="collection" />
          <div className="flex w-full justify-between px-10">
            <div className="flex flex-col items-center gap-2">
              <p className=" text-lg font-extralight">APY</p>
              <p className="text-xl font-bold text-[#76FF6A]">180%</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className=" text-lg font-extralight">Duration</p>
              <p className="text-xl font-bold">14D</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className=" text-lg font-extralight">FLOOR</p>
              <div className="flex items-center justify-end gap-1 text-right">
                <Image src={seiWhiteIcon} alt="sei" />
                23.5
              </div>
            </div>
          </div>
          <Separator className="mb-2 w-full border-[1px]" />
          <div className="flex w-full justify-between">
            {selectedItems?.map((item, index) => (
              <NFTContainer
                id={item.id} // It's better to have a more unique key if possible
                kind={item.kind}
                title={item.title}
                selected={item.selected}
                onClick={() => toggleSelectedItem(item.id)}
              />
            ))}
          </div>
          <p>1 NFT Selected</p>
          <div className=" flex items-center justify-end gap-1 text-right">
            <Image src={seiWhiteIcon} alt="sei" />
            <b className="text-lg">20.5</b>
          </div>
          <Button className="whitespace-nowrap px-3 py-1 text-lg font-bold md:text-xl">
            Borrow
          </Button>
          <div className=" flex items-center justify-end gap-1 text-right">
            Repay
            <b className="text-lg">36.08</b>
            <Image src={seiWhiteIcon} alt="sei" />
            in 14 days.
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
