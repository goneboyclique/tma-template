<script setup lang="ts">
import { computed, watch } from 'vue';
import { TonConnectButton, useTonWallet } from '@/tonconnect';
import AppDisplayData, { type DisplayDataRow } from '@/components/AppDisplayData.vue';
import AppLink from '@/components/AppLink.vue';
import AppPage from '@/components/AppPage.vue';
import { usePaymentsControllerCreatePayments } from '@pkg/api/client/vue';
import { useTonConnectUI } from '@/tonconnect/useTonConnectUI';
import { usePaymentTracking } from '@/composables/usePayment';

const q = usePaymentsControllerCreatePayments()

const { tonConnectUI } = useTonConnectUI()
const { payment, trackPayment, stopTracking } = usePaymentTracking()
const { wallet } = useTonWallet();

const payTon = async () => {
  const { data: payment } = await q.mutateAsync({
    data: {
      currency: 'TON',
      amount: '10000',
    },
  })

  await tonConnectUI.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 300,
    messages: [
      {
        address: payment.to,
        amount: payment.amount,
        payload: payment.payload,
      },
    ],
  });

}

watch(payment, upd => {
  console.log('payment updated', upd)
})

const payJetton = async () => {
  const { data: tx } = await q.mutateAsync({
    data: {
      currency: 'USDT',
      amount: '10000',
    },
  })

  trackPayment(tx.id)

  await tonConnectUI.sendTransaction({
    validUntil: Math.floor(Date.now() / 1000) + 300,
    messages: [
      {
        address: tx.to,
        amount: tx.amount,
        payload: tx.payload,
      },
    ],
  });
}

const walletExtended = computed(() => {
  return wallet.value && 'imageUrl' in wallet.value ? wallet.value : null;
});

const rows = computed<DisplayDataRow[]>(() => {
  return wallet.value ? [
    { title: 'Address', value: wallet.value.account.address },
    { title: 'Chain', value: wallet.value.account.chain },
    { title: 'Public Key', value: wallet.value.account.publicKey },
  ] : [];
});
</script>

<template>
  <AppPage title="TON Connect">
    <p v-if="!wallet">To display the data related to the TON Connect, it is required to connect your wallet.</p>
    <template v-else>
      <div v-if="walletExtended" class="ton-connect-page__provider">
        <img class="ton-connect-page__provider-image" :src="walletExtended.imageUrl" alt="Provider logo" width="60"
          height="60" />
        <div class="ton-connect-page__provider-meta">
          <p class="ton-connect-page__provider-wallet-name">
            {{ walletExtended.name }}&nbsp;
            <span class="ton-connect-page__provider-app-name">
              {{ walletExtended.appName }}
            </span>
          </p>
          <AppLink :to="walletExtended.aboutUrl">
            About connected wallet
          </AppLink>
        </div>
      </div>
      <AppDisplayData :rows />
      <button @click="payTon">payTon</button>
      <button @click="payJetton">payJetton</button>
      <pre>{{ payment }}</pre>
    </template>
    <div class="ton-connect-page__button-container">
      <TonConnectButton />
    </div>
  </AppPage>
</template>

<style scoped>
.ton-connect-page__button-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.ton-connect-page__provider {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 16px;
}

.ton-connect-page__provider-image {
  border-radius: 5px;
}

.ton-connect-page__provider-meta {
  display: flex;
  flex-direction: column;
}

.ton-connect-page__provider-wallet-name {
  font-weight: bold;
  font-size: 20px;
  margin: 0;
}

.ton-connect-page__provider-app-name {
  opacity: .4;
  font-weight: 400;
  font-size: 14px;
  vertical-align: top;
}
</style>
