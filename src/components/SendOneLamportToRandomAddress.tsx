import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import React, { FC, useCallback } from 'react';

const SendOneLamportToRandomAddress: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const onClick = useCallback(async () => {
    if (!publicKey) throw new WalletNotConnectedError();

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: Keypair.generate().publicKey,
        lamports: 1
      })
    );

    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight }
    } = await connection.getLatestBlockhashAndContext();

    const signature = await sendTransaction(transaction, connection, { minContextSlot });

    await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
  }, [publicKey, sendTransaction, connection]);
  return (
    <button onClick={onClick} disabled={!publicKey}>
      Send 1 lamport to a random address!
    </button>
  );
};

export default SendOneLamportToRandomAddress;
