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
  /**
   * `jettonMaster.toRawString()` -> the payment wallet's jetton wallet for
   * that master. These are deterministic for a given (master, owner) pair,
   * so they are resolved once and reused: incoming transfer notifications
   * are validated against them on every verification.
   */
  private readonly paymentJettonWallets = new Map<string, Address>();

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

  /**
   * The payment wallet's own jetton wallet for `jettonMaster`. Only this
   * contract may credit the payment wallet with that jetton, so it is the
   * only legitimate sender of a `transfer_notification` for it.
   */
  async getPaymentJettonWallet(jettonMaster: string): Promise<Address> {
    const master = Address.parse(jettonMaster);
    const key = master.toRawString();

    const cached = this.paymentJettonWallets.get(key);
    if (cached) return cached;

    const wallet = await this.getJettonWalletAddress(
      master,
      Address.parse(env.PAYMENT_WALLET),
    );
    this.paymentJettonWallets.set(key, wallet);

    return wallet;
  }

  async getSupportedWallets(): Promise<string[]> {
    const owner = Address.parse(env.PAYMENT_WALLET);

    const jettonWallets = await Promise.all(
      Object.values(jettonMasters)
        .filter((master): master is string => !!master)
        .map((master) => this.getPaymentJettonWallet(master)),
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
