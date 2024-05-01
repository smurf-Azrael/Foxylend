"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import seiWhiteIcon from "@/public/sei-white.svg"
import { fetchStatistic } from "@/services/common/fetchStatistic"
import { Separator } from "@radix-ui/react-separator"
import { useCosmWasmClient, useWallet } from "@sei-js/react"
import { Search } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const lendData = [
  {
    collection: "Fud Foxes",
    borrowed: "954.54",
    term: "6d remaining",
    interest: "20",
    repayment: "140.5",
  },
  {
    collection: "Fud Foxes",
    borrowed: "954.54",
    term: "6d remaining",
    interest: "20",
    repayment: "140.5",
  },
  {
    collection: "Fud Foxes",
    borrowed: "954.54",
    term: "6d remaining",
    interest: "20",
    repayment: "140.5",
  },
  {
    collection: "Fud Foxes",
    borrowed: "954.54",
    term: "6d remaining",
    interest: "20",
    repayment: "140.5",
  },
]

export default function Loan() {
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
  >([])
  useEffect(() => {
    console.log(accounts)
    if (connectedWallet && queryClient) {
      setIsNFTLoading(true)
      fetchUnsteikCount().then((res: Array<string>) => {
        if (res?.length != 0) {
          const fetchedItems = res?.map((item: string, index: number) => ({
            id: index,
            kind: item,
            title: item,
            selected: false,
          }))
          console.log(fetchedItems, "fetchedItems----")
          setSelectedItems(fetchedItems)
        }
        setIsNFTLoading(false)
      })
    }
    if (!connectedWallet) {
      setIsNFTLoading(false)
      setSelectedItems([])
    }
    setStatisticLoading(true)
    fetchStatistic().then((res: any) => {
      if (res?.length != 0) {
        setTotalStaked(parseInt(res?.total_staked))
        setTotalClaimedPoints(parseInt(res?.total_claimed_points) / 1000000)
        setStatisticLoading(false)
      }
    })
  }, [accounts, connectedWallet, queryClient])
  return (
    <section className="px-16 pb-3 pt-6">
      <h1 className="font-inria mx-auto mb-5 text-left text-4xl text-custom sm:text-5xl md:text-6xl lg:text-7xl">
        MY LOANS
      </h1>
      {/* <div className="flex items-center gap-3">
        <Search color="white" />
        <Input
          placeholder="Search Collections"
          className=" border-0 bg-transparent text-white focus:border-0"
        />
      </div> */}
      <Separator className="mb-2 border" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35%]">Collection</TableHead>
            <TableHead className="w-[12%] text-right">Borrowed</TableHead>
            <TableHead className="w-[12%] text-center">Term</TableHead>
            <TableHead className="w-[12%] text-right">Repayment</TableHead>
            <TableHead className="w-[20%] text-center"></TableHead>
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
                  {item.borrowed}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {item.term}
              </TableCell>
              <TableCell className="text-center ">
                <div className="flex flex-col items-end">
                  <div className="flex items-center justify-end gap-2 text-center text-lg font-bold text-[#76FF6A]">
                    <Image src={seiWhiteIcon} alt="sei" />
                    {item.repayment}
                  </div>
                  <div className="flex items-center text-[10px]">
                    {item.repayment}{" "}
                    <Image src={seiWhiteIcon} alt="sei" className="m-[1px]" />{" "}
                    in interest
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center font-medium">
                <Button
                  className="whitespace-nowrap px-6 py-2 text-lg font-bold md:text-xl"
                  variant={"gray"}
                >
                  Repay
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}
