"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate"
import { coins } from "@cosmjs/launchpad"
import {
  useCosmWasmClient,
  useSigningCosmWasmClient,
  useWallet,
} from "@sei-js/react"
import toast from "react-hot-toast"

import useContract from "@/hooks/useContract"
import { Button } from "@/components/ui/button"
import NFTContainer from "@/components/common/nft-container"
import NFTContainerSkeleton from "@/components/common/nft-container-skeleton"

export default function Steik() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "steik"
  const { connectedWallet, accounts } = useWallet()
  const { cosmWasmClient: queryClient } = useCosmWasmClient()
  const { signingCosmWasmClient: signingClient } = useSigningCosmWasmClient()
  const { createExecuteMessage } = useContract()
  const [isLoading, setIsLoading] = useState(true)

  const fetchSteikCount = async () => {
    const response = await queryClient?.queryContractSmart(
      process.env.NEXT_PUBLIC_NFT_ADDRESS || "",
      {
        tokens: {
          owner: accounts[0]?.address,
        },
      }
    )
    return response?.tokens
  }
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
  const handleSteik = async () => {
    const checkedItems = selectedItems.filter((item) => item.selected === true)
    console.log(checkedItems, "here")
    // if(checkedItems)
    let transactions: MsgExecuteContractEncodeObject[] = []

    if (checkedItems.length === 1) {
      transactions = [
        createExecuteMessage({
          senderAddress: accounts[0]?.address,
          contractAddress: process.env.NEXT_PUBLIC_NFT_ADDRESS || "",
          message: {
            approve: {
              token_id: checkedItems[0].title,
              spender: process.env.NEXT_PUBLIC_STEIK_ADDRESS,
            },
          },
        }),
        createExecuteMessage({
          senderAddress: accounts[0]?.address,
          contractAddress: process.env.NEXT_PUBLIC_STEIK_ADDRESS || "",
          message: { steik: { token_id: checkedItems[0].title } },
          funds: coins("2000000", "usei"),
        }),
      ]
    } else {
      console.log(
        checkedItems.map((item) => item.title),
        "several case"
      )
      transactions = []
      checkedItems.map((item) => {
        transactions.push(
          createExecuteMessage({
            senderAddress: accounts[0]?.address,
            contractAddress: process.env.NEXT_PUBLIC_NFT_ADDRESS || "",
            message: {
              approve: {
                token_id: item.title,
                spender: process.env.NEXT_PUBLIC_STEIK_ADDRESS,
              },
            },
          })
        )
      })
      transactions.push(
        createExecuteMessage({
          senderAddress: accounts[0]?.address,
          contractAddress: process.env.NEXT_PUBLIC_STEIK_ADDRESS || "",
          message: {
            batch_steik: {
              tokens: checkedItems.map((item) => item.title),
            },
          },
          funds: coins("5000000", "usei"),
        })
      )
    }
    if (!transactions.length) {
      toast.error("Sorry☹️, failed steiking!", {
        position: "top-right",
      })
      return
    }
    const fee = {
      amount: [{ amount: "0.1", denom: "usei" }],
      gas: (checkedItems.length * 700000).toString(),
    }
    signingClient
      ?.signAndBroadcast(accounts[0]?.address, transactions, fee)
      .then((res) => {
        if (res.code !== 0) {
          throw new Error(res.rawLog)
        }
        toast.success("Succeed in steiking. Good👍Luck!!", {
          position: "top-right",
        })
      })
      .catch((e) => {
        console.log("debug error", e, typeof e)
        toast.error("Sorry☹️, failed steiking!", {
          position: "top-right",
        })
      })
      .finally(() => {
        console.log("refetch")
        setIsLoading(true)
        fetchSteikCount().then((res: Array<string>) => {
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
          if (res?.length === 0) {
            setSelectedItems([])
          }
          setIsLoading(false)
        })
      })
  }
  const handleUnsteik = async () => {
    const checkedItems = selectedItems.filter((item) => item.selected === true)
    console.log(checkedItems, "here")
    // if(checkedItems)
    let transactions: MsgExecuteContractEncodeObject[] = []

    if (checkedItems.length === 1) {
      transactions = [
        createExecuteMessage({
          senderAddress: accounts[0]?.address,
          contractAddress: process.env.NEXT_PUBLIC_STEIK_ADDRESS || "",
          message: { un_steik: { token_id: checkedItems[0].title } },
          funds: coins("1000000", "usei"),
        }),
      ]
    } else {
      console.log(
        checkedItems.map((item) => item.title),
        "several case"
      )
      transactions = []
      transactions.push(
        createExecuteMessage({
          senderAddress: accounts[0]?.address,
          contractAddress: process.env.NEXT_PUBLIC_STEIK_ADDRESS || "",
          message: {
            batch_unsteik: {
              tokens: checkedItems.map((item) => item.title),
            },
          },
          funds: coins("2500000", "usei"),
        })
      )
    }
    if (!transactions.length) {
      toast.error("Sorry☹️, failed steiking!", {
        position: "top-right",
      })
      return
    }
    const fee = {
      amount: [{ amount: "0.1", denom: "usei" }],
      gas: (checkedItems.length * 700000).toString(),
    }
    signingClient
      ?.signAndBroadcast(accounts[0]?.address, transactions, fee)
      .then((res) => {
        if (res.code !== 0) {
          throw new Error(res.rawLog)
        }
        toast.success("Succeed in steiking. Good👍Luck!!", {
          position: "top-right",
        })
      })
      .catch((e) => {
        console.log("debug error", e, typeof e)
        toast.error("Sorry☹️, failed steiking!", {
          position: "top-right",
        })
      })
      .finally(() => {
        console.log("refetch")
        setIsLoading(true)
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
          if (res?.length === 0) {
            setSelectedItems([])
          }
          setIsLoading(false)
        })
      })
  }
  const [selectedItems, setSelectedItems] = useState<
    Array<{ id: number; kind: string; title: string; selected: boolean }>
  >([
    // { id: 0, kind: "2", title: "#986", selected: false },
    // { id: 1, kind: "1", title: "#986", selected: false },
    // { id: 2, kind: "2", title: "#986", selected: false },
    // { id: 3, kind: "3", title: "#986", selected: false },
    // { id: 4, kind: "4", title: "#986", selected: false },
    // { id: 5, kind: "0", title: "#986", selected: false },
    // { id: 6, kind: "1", title: "#986", selected: false },
    // { id: 7, kind: "2", title: "#986", selected: false },
    // { id: 8, kind: "3", title: "#986", selected: false },
    // { id: 9, kind: "4", title: "#986", selected: false },
    // Add all other NFTs with their kind and title here, ensuring each has a unique way of identification
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
  useEffect(() => {
    console.log(accounts)
    if (queryClient && connectedWallet) {
      setIsLoading(true)
      mode === "steik"
        ? fetchSteikCount().then((res: Array<string>) => {
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
            setIsLoading(false)
          })
        : fetchUnsteikCount().then((res: Array<string>) => {
            console.log(res, "this is response")
            if (res?.length != 0) {
              const fetchedItems = res?.map((item: string, index: number) => ({
                id: index,
                kind: item,
                title: item,
                selected: false,
              }))
              setSelectedItems(fetchedItems)
            }
            setIsLoading(false)
          })
    }
  }, [accounts, connectedWallet, queryClient])

  return (
    <section className="px-16 pb-3 pt-6">
      <p className=" text-2xl font-bold text-custom sm:text-3xl md:text-4xl xl:text-5xl">
        SELECT NFTS TO {mode === "steik" ? "STEIK" : "UNSTEIK"}
      </p>
      <div className="mt-5 grid w-full grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 ">
        {!isLoading ? (
          selectedItems?.map((item, index) => (
            <NFTContainer
              id={index} // It's better to have a more unique key if possible
              kind={item.kind}
              title={item.title}
              selected={item.selected}
              onClick={() => toggleSelectedItem(index)}
            />
          ))
        ) : (
          <>
            <NFTContainerSkeleton />
            <NFTContainerSkeleton />
            <NFTContainerSkeleton />
            <NFTContainerSkeleton />
            <NFTContainerSkeleton />
          </>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <div className="md:col-span-2 xl:col-span-4"></div>
        <div className="mx-auto mt-6 flex w-36 gap-6 sm:w-48 lg:w-56">
          {mode === "steik" ? (
            <Button
              className="ml-auto h-8 whitespace-nowrap text-lg md:text-xl"
              onClick={handleSteik}
            >
              steik
            </Button>
          ) : (
            <Button
              variant={"gray"}
              className="ml-auto h-8 whitespace-nowrap text-lg md:text-xl"
              onClick={handleUnsteik}
            >
              unsteik
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
