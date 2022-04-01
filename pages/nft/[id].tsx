import React from 'react'
import TypeWriter from 'react-typewriter'
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react'

function NFTDropPage() {
  // Authentication
  const connectWithMetamask = useMetamask()
  const address = useAddress()
  const disconnect = useDisconnect()
  // ---

  return (
    <div className="flex h-screen flex-col lg:grid lg:grid-cols-10">
      {/* Left */}
      <div className="bg-gradient-to-br from-[#90d5ec] to-[#fc575e] lg:col-span-4">
        <div className="flex flex-col items-center justify-center py-2 lg:min-h-screen">
          <div className="rounded-xl bg-gradient-to-br from-yellow-400 to-purple-600 p-2">
            <img
              className="w-44 rounded-xl object-cover lg:h-96 lg:w-72"
              src="https://links.papareact.com/8sg"
              alt="NFT Drop"
            />
          </div>

          <div className="space-y-2 p-5 text-center">
            <h1 className="text-4xl font-bold text-white">Ape$</h1>
            <h2 className="text-xl text-[#2a2a72]">A collection of Ape$</h2>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-1 flex-col bg-gradient-to-br from-[#93a5ce] to-[#e4eee9] p-12 lg:col-span-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <TypeWriter typing={0.7}>
            <h1 className="w-50 text-xl font-extralight sm:w-80">
              👾 The{' '}
              <span className="font-extrabold underline decoration-purple-500/50">
                LVNFT
              </span>{' '}
              Market Place 👾
            </h1>
          </TypeWriter>

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
            src="https://links.papareact.com/bdy"
            alt="NFT Drops"
          />

          <h1 className="text-3xl font-bold lg:text-5xl lg:font-extrabold">
            The LV Ape Coding Club | NFT Drop
          </h1>

          <p className="pt-2 text-xl text-[#004953] lg:pt-5">
            12/21 NFTs claimed
          </p>
        </div>

        {/* Mint Btn */}
        <button className="btnBoxShadow btnTextStyle btnGradient mt-10 h-16 w-full rounded-full">
          Mint NFT (0.01 ETH)
        </button>
      </div>
    </div>
  )
}
// bg-gradient-to-br from-[#380036] to-[#0cbaba]

export default NFTDropPage
