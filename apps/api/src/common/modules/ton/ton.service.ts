import { Inject, Injectable } from '@nestjs/common';
import { PaymentType } from '@pkg/db/schemas';
import { Address, comment, JettonMaster, TonClient } from '@ton/ton';
import { env } from '@tooling/env/tma';
import {
  JETTON_FORWARD_TON_AMOUNT,
  JETTON_TRANSFER_GAS_AMOUNT,
  jettonMasters,
} from 'src/common/constants/ton.constants';
import {
  buildJettonTransferBody,
  isJettonCurrency,
} from 'src/common/utils/ton.utils';

@Injectable()
export class TonService {
  constructor(
    @Inject('TON_CLIENT')
    private readonly client: TonClient,
  ) {}

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

  async getSupportedWallets(): Promise<string[]> {
    const owner = Address.parse(env.PAYMENT_WALLET);

    const jettonWallets = await Promise.all(
      Object.values(jettonMasters)
        .filter((master): master is string => !!master)
        .map((master) =>
          this.getJettonWalletAddress(Address.parse(master), owner),
        ),
    );

    return [
      owner.toRawString(),
      ...jettonWallets.map((wallet) => wallet.toRawString()),
    ];
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
