"use client"

import { useEffect, useState } from "react"
import { fetchStatistic } from "@/services/common/fetchStatistic"
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate"
import {
  useCosmWasmClient,
  useSigningCosmWasmClient,
  useWallet,
} from "@sei-js/react"

import useContract from "@/hooks/useContract"
import { Button } from "@/components/ui/button"
import StatisticContainer from "@/components/common/statistic-contianer"

export default function Dashboard() {
  const [totalStaked, setTotalStaked] = useState(0)
  const [totalClaimedPoints, setTotalClaimedPoints] = useState(0)
  const [userUnclaimed, setUserUnclaimed] = useState(0)
  const [userClaimed, setUserClaimed] = useState(0)
  const [isCollectionLoading, setIsCollectionLoading] = useState(true)
  const [isUserStatsLoading, setIsUserStatsLoading] = useState(true)
  const { connectedWallet, accounts } = useWallet()
  const { cosmWasmClient: queryClient } = useCosmWasmClient()
  const { signingCosmWasmClient: signingClient } = useSigningCosmWasmClient()

  const { createExecuteMessage } = useContract()

  const fetchUserStatistic = async () => {
    const response = await queryClient?.queryContractSmart(
      process.env.NEXT_PUBLIC_STEIK_ADDRESS || "",
      {
        get_user_info: {
          address: accounts[0]?.address,
        },
      }
    )
    console.log(response, "user statistic response")
    return response
  }
  const fetchAndUpdate = async () => {
    if (connectedWallet && queryClient) {
      setIsUserStatsLoading(true)
      fetchUserStatistic().then((res: any) => {
        if (res?.length !== 0) {
          setUserClaimed(parseInt(res?.claimed_amount) / 1000000)
          setUserUnclaimed(parseInt(res?.pending_reward) / 1000000)
        }
        setIsUserStatsLoading(false)
      })
    }
    fetchStatistic().then((res: any) => {
      if (res?.length !== 0) {
        setTotalStaked(parseInt(res?.total_staked))
        setTotalClaimedPoints(parseInt(res?.total_claimed_points) / 1000000)
        setIsCollectionLoading(false)
      }
    })
  }
  const handleClaim = async () => {
    let transactions: MsgExecuteContractEncodeObject[] = []

    transactions = [
      createExecuteMessage({
        senderAddress: accounts[0]?.address,
        contractAddress: process.env.NEXT_PUBLIC_STEIK_ADDRESS || "",
        message: { claim: {} },
      }),
    ]

    if (!transactions.length) {
      alert("Sorry☹️, failed steiking!")
      return
    }
    const fee = {
      amount: [{ amount: "0.1", denom: "usei" }],
      gas: "700000",
    }
    signingClient
      ?.signAndBroadcast(accounts[0]?.address, transactions, fee)
      .then((res) => {
        if (res.code !== 0) {
          throw new Error(res.rawLog)
        }
        alert("Succeed in claiming. Good👍Luck!!")
      })
      .catch((e) => {
        console.log("debug error", e, typeof e)
        alert("Sorry☹️, failed betting!!")
      })
      .finally(() => {
        console.log("refetch")
        fetchAndUpdate()
        // fetchUnsteikCount().then((res: Array<string>) => {
        //   if (res?.length != 0) {
        //     const fetchedItems = res?.map((item: string, index: number) => ({
        //       id: index,
        //       kind: item.slice(3),
        //       title: item.slice(3),
        //       selected: false,
        //     }))
        //     console.log(fetchedItems, "fetchedItems----")
        //     setSelectedItems(fetchedItems)
        //   }
        //   if (res?.length === 0) {
        //     setSelectedItems([])
        //   }
        // })
      })
  }
  useEffect(() => {
    // Function to fetch and update statistics
    setIsCollectionLoading(true)

    fetchAndUpdate()
      .then(() => {})
      .catch((err) => {})

    // Set up an interval to fetch data every 15 seconds
    const interval = setInterval(fetchAndUpdate, 20000)

    // Clean-up function to clear the interval when the component unmounts or dependencies change
    return () => clearInterval(interval)
  }, [accounts, connectedWallet, queryClient])
  return (
    <section className="px-16 pb-3 pt-6">
      <div className="rounded bg-[#FFFDF1] p-6">
        <p className=" text-2xl  text-custom sm:text-3xl md:text-4xl xl:text-5xl">
          COLLECTION STATS
        </p>
        <div className="mx-auto mt-3 flex flex-wrap items-center justify-center gap-8 sm:mb-4 sm:mt-4 sm:justify-between md:mb-8 md:mt-8 md:max-w-3xl lg:mb-10 lg:mt-10 xl:max-w-5xl">
          <StatisticContainer
            number={totalStaked}
            content={"Foxes staked"}
            loading={isCollectionLoading}
          />
          {/* <StatisticContainer number={15641} content={"Daily points"} /> */}
          <StatisticContainer
            number={totalClaimedPoints}
            content={"Total points"}
            loading={isCollectionLoading}
          />
        </div>
      </div>
      <div className="mt-10 rounded bg-[#FFFDF1] p-6">
        <p className=" text-2xl  text-custom sm:text-3xl md:text-4xl xl:text-5xl">
          MY STATS
        </p>
        <div className="mx-auto mt-3 flex flex-wrap items-center justify-center gap-8 sm:mb-4 sm:mt-4 sm:justify-between md:mb-8 md:mt-8 md:max-w-3xl lg:mb-10 lg:mt-10 xl:max-w-5xl">
          <StatisticContainer
            number={userClaimed + userUnclaimed}
            content={"Total points"}
            loading={isUserStatsLoading}
          />
          <StatisticContainer
            number={userClaimed}
            content={"Claimed points"}
            loading={isUserStatsLoading}
          />
          <StatisticContainer
            number={userUnclaimed}
            content={"Unclaimed points"}
            loading={isUserStatsLoading}
          />
        </div>
        <div className="mt-4 flex w-5/6 justify-end">
          <Button
            className="whitespace-nowrap text-lg md:text-xl"
            onClick={handleClaim}
          >
            claim points
          </Button>
        </div>
      </div>
    </section>
  )
}
