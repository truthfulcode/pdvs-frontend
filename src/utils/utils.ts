import { Hex, createPublicClient, http } from 'viem'
import { localhost, mainnet } from 'viem/chains'
import { createWalletClient, custom } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addDefaultLocale(en)
// Create formatter (English).
const timeAgo = new TimeAgo('en-US')

require('dotenv').config()

const chain = localhost;
// const chain = chains.sepolia;

export const client = createPublicClient({
  chain,
  transport: http()
})

export const walletClient = createWalletClient({
  chain,
  transport: http()
})

export const formatTime = (time: Date) => {
  return timeAgo.format(time);
}