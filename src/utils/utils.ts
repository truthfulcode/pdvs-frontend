import { Hex, createPublicClient, http } from 'viem'
import { localhost, mainnet } from 'viem/chains'
import { createWalletClient, custom } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
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

export const account = privateKeyToAccount(process.env.PK_KEEPER as Hex)
