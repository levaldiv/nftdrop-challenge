import React, { useEffect, useState } from 'react'
import TypeWriter from 'react-typewriter'
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTDrop,
} from '@thirdweb-dev/react'
import { GetServerSideProps } from 'next'
import { sanityClient, urlFor } from '../../sanity'
import { Collection } from '../../typings'
import Link from 'next/link'
import { BigNumber } from 'ethers'
import toast, { Toaster } from 'react-hot-toast'

interface Props {
  collection: Collection
}

function NFTDropPage({ collection }: Props) {
  const [claimedSupply, setClaimedSupply] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const [priceInEth, setPriceInEth] = useState<string>()
  const [loading, setLoading] = useState<boolean>(true)
  const nftDrop = useNFTDrop(collection.address)

  // Authentication
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()
  // ---

  // checking the price
  useEffect(() => {
    if (!nftDrop) return

    const fetchPrice = async () => {
      const claimedConditions = await nftDrop.claimConditions.getAll()
      setPriceInEth(claimedConditions?.[0].currencyMetadata.displayValue)
    }

    fetchPrice()
  }, [nftDrop])

  // Fetching clamied supply from 3rd web
  useEffect(() => {
    // protecting against unauthenticated users
    if (!nftDrop) return

    const fetchNFTDropData = async () => {
      setLoading(true)

      const claimed = await nftDrop.getAllClaimed()
      const total = await nftDrop.totalSupply()

      setClaimedSupply(claimed.length)
      setTotalSupply(total)

      setLoading(false)
    }

    fetchNFTDropData()
  }, [nftDrop])

  // Helper function for the minting btn
  const mintNft = () => {
    if (!nftDrop || !address) return

    const quantity = 1 // how many unique NFTs you want to claim

    setLoading(true)

    const notification = toast.loading('Minting ...', {
      style: {
        background: 'white',
        color: 'green',
        fontWeight: 'bolder',
        fontSize: '17px',
        padding: '20px',
      },
    })

    // address thats logged in & quantity
    // then gets back the transaction data
    nftDrop
      .claimTo(address, quantity)
      .then(async (tx) => {
        const receipt = tx[0].receipt // the transaction receipt
        const claimedTokenId = tx[0].id // id of the NFT claimed
        const claimedNFT = await tx[0].data() // (optional) get the claimed NFT metaData

        toast('SUCCESSFULLY minted NFT #' + claimedTokenId, {
          duration: 8000,
          style: {
            background: 'green',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })

        console.log(receipt)
        console.log(claimedTokenId)
        console.log(claimedNFT)
      })
      .catch((err) => {
        console.log(err)
        toast('Someting went wrong', {
          style: {
            background: 'red',
            color: 'white',
            fontWeight: 'bolder',
            fontSize: '17px',
            padding: '20px',
          },
        })
      })
      .finally(() => {
        setLoading(false)
        toast.dismiss(notification)
      })
  }

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      <Toaster position="bottom-center" />

      {/* Left */}
      <div className="bg-gradient-to-br from-[#90d5ec] to-[#fc575e] lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src={urlFor(collection.previewImage).url()}
              alt="NFT Drop"
            />
          </div>

          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">
              {collection.nftCollectionName}
            </h1>
            <h2 className="text-xl text-[#2a2a72]">{collection.description}</h2>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 flex-col bg-gradient-to-br from-[#93a5ce] to-[#e4eee9] p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href={'/'}>
            <TypeWriter typing={0.7}>
              <h1 className="w-50 text-xl font-extralight sm:w-80">
                👾 The{' '}
                <span className="font-extrabold underline decoration-purple-500/50">
                  LVNFT
                </span>{' '}
                Market Place 👾
              </h1>
            </TypeWriter>
          </Link>

          <button
            onClick={() => (address ? disconnect() : connectWithMetamask())}
            className="rounded-full bg-rose-400 px-4 py-2 text-xs font-bold text-white lg:px-5 lg:py-3 lg:text-base"
          >
            {address ? 'Sign Out' : 'Sign In'}
          </button>
        </header>

        <hr className="my-2 border" />

        {/* Wallet address */}
        {address && (
          <p className="text-center text-sm text-red-600">
            Logged in with {address.substring(0, 4)}...
            {address.substring(address.length - 4)}
          </p>
        )}

        {/* Content */}
        <div className="mt-10 flex flex-1 flex-col items-center space-y-6 text-center lg:justify-center lg:space-y-0">
          <img
            className="w-80 object-cover pb-10 lg:h-40"
            src={urlFor(collection.mainImage).url()}
            alt="NFT Drops"
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            {collection.title}
          </h1>

          {loading ? (
            <p className="animate-pulse pt-2 text-xl text-[#004953] lg:pt-5">
              Loading supply count...
            </p>
          ) : (
            <p className="pt-2 text-xl text-[#004953] lg:pt-5">
              {claimedSupply} / {totalSupply?.toString()} NFTs claimed
            </p>
          )}

          {loading && (
            <img
              className="h-80 w-80 object-contain"
              src="https://cdn.hackernoon.com/images/0*4Gzjgh9Y7Gu8KEtZ.gif"
              alt="Loading..."
            />
          )}
        </div>

        {/* Mint Btn */}
        <button
          onClick={mintNft}
          disabled={
            loading || claimedSupply === totalSupply?.toNumber() || !address
          }
          className="btnBoxShadow btnTextStyle btnGradient mt-10 h-16 w-full rounded-full disabled:bg-gray-400"
        >
          {loading ? (
            <>Loading</>
          ) : claimedSupply === totalSupply?.toNumber() ? (
            <>SOLD OUT</>
          ) : !address ? (
            <>Sign In to Mint</>
          ) : (
            <span>Mint NFT ({priceInEth} ETH)</span>
          )}
        </button>
      </div>
    </div>
  )
}
// bg-gradient-to-br from-[#380036] to-[#0cbaba]

export default NFTDropPage

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const query = `*[_type=='collection' && slug.current == $id][0] {
  _id, 
  title,
  address,
  description,
  nftCollectionName,
  mainImage {
     asset
  },
  previewImage {
    asset
  },
slug {
  current
},
creator -> {
  _id,
  name,
  address,
  slug {
  current
},
},
}`

  const collection = await sanityClient.fetch(query, { id: params?.id })

  if (!collection) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      collection,
    },
  }
}
