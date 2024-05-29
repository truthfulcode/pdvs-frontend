import { Hex, createPublicClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

export const account = privateKeyToAccount(process.env.PK_KEEPER as Hex)
