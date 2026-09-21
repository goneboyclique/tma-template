import { Inject, Injectable } from '@nestjs/common';
import { Address, comment, JettonMaster, TonClient } from '@ton/ton';
import { env } from '@tooling/env/tma';
import { PaymentCreateReqDto } from 'src/common/dto/payment.dto';
import { isJettonCurrency, JettonCurrency } from 'src/common/types/ton.type';
import { buildJettonTransferBody } from 'src/common/utils/ton.utils';
// import { retry } from 'src/common/utils/req.utils';
// import { getNormalizedExtMessageHash } from 'src/common/utils/ton.utils';

// Minimal TON forwarded to the payment wallet's jetton wallet so it emits
// a `transfer_notification` to the payment wallet owner.
const JETTON_FORWARD_TON_AMOUNT = 1n;

// TON attached to a jetton-transfer message to cover the on-chain gas for
// the sender's jetton wallet -> payment wallet's jetton wallet hop.
const JETTON_TRANSFER_GAS_AMOUNT = '50000000'; // 0.05 TON

const jettonMasters: Record<JettonCurrency, string> = {
  USDT: env.USDT_JETTON_MASTER,
};

@Injectable()
export class TonService {
  constructor(
    @Inject('TON_CLIENT')
    private readonly client: TonClient,
  ) {}

  getJettonMaster(currency: JettonCurrency) {
    return jettonMasters[currency.toUpperCase() as JettonCurrency];
  }

  /**
   * Resolves the jetton wallet contract address owned by `owner` for the
   * given jetton master, by calling the master's `get_wallet_address`
   * get-method.
   */
  async getJettonWalletAddress(
    jettonMaster: Address,
    owner: Address,
  ): Promise<Address> {
    const master = this.client.open(JettonMaster.create(jettonMaster));
    return master.getWalletAddress(owner);
  }

  async buildPayment(
    sender: string,
    recipient: string,
    { currency, amount }: PaymentCreateReqDto,
  ) {
    const id = 'future input id from prisma entity';
    const senderAddress = Address.parse(sender);
    const recipientAddress = Address.parse(recipient);

    if (isJettonCurrency(currency)) {
      const jettonMaster = Address.parse(this.getJettonMaster(currency));
      console.log('jettonMaster', jettonMaster)

      // TON Connect `to` = sender's Jetton Wallet
      const senderJettonWallet = await this.getJettonWalletAddress(
        jettonMaster,
        senderAddress,
      );

      const body = buildJettonTransferBody({
        jettonAmount: BigInt(amount),
        toOwnerAddress: recipientAddress,
        responseAddress: senderAddress,
        forwardTonAmount: JETTON_FORWARD_TON_AMOUNT,
        forwardComment: id,
      });

      return {
        id,
        to: senderJettonWallet.toString(),
        payload: body.toBoc().toString('base64'),
        amount: JETTON_TRANSFER_GAS_AMOUNT, // TON attached to transaction,
        currency,
      };
    }

    // Native TON transfer
    return {
      id,
      to: recipient,
      payload: comment(id).toBoc().toString('base64'),
      amount,
      currency,
    };
  }

  //
  // async findTransactionByExternalMessage(inMessageBoc: string) {
  //   const inMessage = loadMessage(Cell.fromBase64(inMessageBoc).beginParse());
  //
  //   if (inMessage.info.type !== 'external-in') {
  //     throw new Error(
  //       `Message must be "external-in", got ${inMessage.info.type}`,
  //     );
  //   }
  //
  //   const account = inMessage.info.dest;
  //
  //   const targetInMessageHash = getNormalizedExtMessageHash(inMessage);
  //
  //   let lt: string | undefined = undefined;
  //   let hash: string | undefined = undefined;
  //
  //   while (true) {
  //     const transactions = await retry(
  //       () =>
  //         this.client.getTransactions(account, {
  //           hash,
  //           lt,
  //           limit: 10,
  //           archival: true,
  //         }),
  //       { delay: 1000, retries: 3 },
  //     );
  //     if (transactions.length === 0) {
  //       // No more transactions found - message may not be processed yet
  //       return undefined;
  //     }
  //     // Step 5. Search for a transaction whose input message matches the normalized hash
  //     for (const transaction of transactions) {
  //       if (transaction.inMessage?.info.type !== 'external-in') {
  //         continue;
  //       }
  //       const inMessageHash = getNormalizedExtMessageHash(
  //         transaction.inMessage,
  //       );
  //       if (inMessageHash.equals(targetInMessageHash)) {
  //         return transaction;
  //       }
  //     }
  //     const last = transactions.at(-1)!;
  //     lt = last.lt.toString();
  //     hash = last.hash().toString('base64');
  //   }
  // }
}
