import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PublicKey, PublicKeyInitData, Transaction } from '@solana/web3.js'
import { AUCTION_HOUSE_PROGRAM_ID, SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID, toPublicKey } from '../ids'
import { BigNumber } from '@metaplex-foundation/js'
import {
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  TokenDelegateRole
} from '@metaplex-foundation/mpl-token-metadata'
import { programIds } from '../programIds'
import { INFTInBag } from '../../types/nft_details'
import * as anchor from '@project-serum/anchor'

export class Pda extends PublicKey {
  /** The bump used to generate the PDA. */
  public readonly bump: number

  constructor(value: PublicKeyInitData, bump: number) {
    super(value)
    this.bump = bump
  }

  static find(programId: PublicKey, seeds: Array<Buffer | Uint8Array>): Pda {
    const [publicKey, bump] = PublicKey.findProgramAddressSync(seeds, programId)

    return new Pda(publicKey, bump)
  }
}

export const findAssociatedTokenAccountPda = (
  mint: PublicKey,
  owner: PublicKey,
  tokenProgramId: PublicKey = TOKEN_PROGRAM_ID,
  associatedTokenProgramId: PublicKey = ASSOCIATED_TOKEN_PROGRAM_ID
): Pda => Pda.find(associatedTokenProgramId, [owner.toBuffer(), tokenProgramId.toBuffer(), mint.toBuffer()])

/** @group Pdas */
export const findAuctionHouseBuyerEscrowPda = (
  auctionHouse: PublicKey,
  buyer: PublicKey,
  programId: PublicKey = toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
): Pda => Pda.find(programId, [Buffer.from('auction_house', 'utf8'), auctionHouse.toBuffer(), buyer.toBuffer()])

export const findAuctionHouseTradeStatePda = (
  auctionHouse: PublicKey,
  wallet: PublicKey,
  treasuryMint: PublicKey,
  tokenMint: PublicKey,
  buyPrice: BigNumber,
  tokenSize: BigNumber,
  tokenAccount?: PublicKey,
  programId: PublicKey = toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
): Pda =>
  Pda.find(programId, [
    Buffer.from('auction_house', 'utf8'),
    wallet.toBuffer(),
    auctionHouse.toBuffer(),
    ...(tokenAccount ? [tokenAccount.toBuffer()] : []),
    treasuryMint.toBuffer(),
    tokenMint.toBuffer(),
    buyPrice.toArrayLike(Buffer, 'le', 8),
    tokenSize.toArrayLike(Buffer, 'le', 8)
  ])

export type Signer = KeypairSigner | IdentitySigner

export type KeypairSigner = {
  publicKey: PublicKey
  secretKey: Uint8Array
}

export type IdentitySigner = {
  publicKey: PublicKey
  signMessage(message: Uint8Array): Promise<Uint8Array>
  signTransaction(transaction: Transaction): Promise<Transaction>
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>
}

export const isSigner = (input: Signer | any): input is Signer =>
  typeof input === 'object' && 'publicKey' in input && ('secretKey' in input || 'signTransaction' in input)

export const findBidReceiptPda = (
  tradeState: PublicKey,
  programId: PublicKey = toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
): Pda => Pda.find(programId, [Buffer.from('bid_receipt', 'utf8'), tradeState.toBuffer()])

export const findMetadataPda = (mint: PublicKey): Pda => {
  const PROGRAM_IDS = programIds()
  const programId = toPublicKey(PROGRAM_IDS.metadata)
  return Pda.find(programId, [Buffer.from('metadata', 'utf8'), programId.toBuffer(), mint.toBuffer()])
}

export const getMagicEdenTokenAccount = async (item: INFTInBag | any): Promise<[PublicKey, number]> => {
  const tokenAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
    [
      toPublicKey(item.wallet_key).toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      toPublicKey(item.mint_address).toBuffer()
    ],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  )
  return tokenAccount
}

export const findTokenRecordPda = (mint: PublicKey, token: PublicKey): PublicKey =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from('token_record'),
      token.toBuffer()
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0]

export const getAtaForMint = async (mint: PublicKey, buyer: PublicKey): Promise<[PublicKey, number]> =>
  await PublicKey.findProgramAddress(
    [buyer.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  )

export const getEditionDataAccount = async (mint: PublicKey): Promise<[PublicKey, number]> =>
  await PublicKey.findProgramAddress(
    [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from('edition')],
    TOKEN_METADATA_PROGRAM_ID
  )

export const findDelegateRecordPda = (
  mint: PublicKey,
  role: TokenDelegateRole,
  authority: PublicKey,
  delegate: PublicKey
): PublicKey =>
  PublicKey.findProgramAddressSync(
    [
      Buffer.from('metadata'),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      new anchor.BN(role).toArrayLike(Buffer, 'le', 4),
      authority.toBuffer(),
      delegate.toBuffer()
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0]
