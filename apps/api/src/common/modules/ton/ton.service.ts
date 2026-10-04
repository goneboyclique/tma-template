import { Inject, Injectable } from '@nestjs/common';
import { PaymentType } from '@pkg/db/schemas';
import { Address, comment, JettonMaster, TonClient } from '@ton/ton';
import { env } from '@tooling/env/tma';
import { isJettonCurrency, JettonCurrency } from 'src/common/types/ton.type';
import { buildJettonTransferBody } from 'src/common/utils/ton.utils';

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
  async buildPayment(payment: PaymentType, sender: string) {
    const senderAddress = Address.parse(sender);
    const recipientAddress = Address.parse(payment.to);

    if (isJettonCurrency(payment.currency)) {
      const jettonMaster = Address.parse(payment.jettonMaster!);

      const senderJettonWallet = await this.getJettonWalletAddress(
        jettonMaster,
        senderAddress,
      );

      const body = buildJettonTransferBody({
        jettonAmount: BigInt(payment.amount),
        toOwnerAddress: recipientAddress,
        responseAddress: senderAddress,
        forwardTonAmount: JETTON_FORWARD_TON_AMOUNT,
        forwardComment: payment.id,
      });

      return {
        id: payment.id,
        to: senderJettonWallet.toString(),
        payload: body.toBoc().toString('base64'),
        amount: JETTON_TRANSFER_GAS_AMOUNT,
        currency: payment.currency,
      };
    }

    return {
      id: payment.id,
      to: payment.to,
      payload: comment(payment.id).toBoc().toString('base64'),
      amount: payment.amount,
      currency: payment.currency,
    };
  }
}
