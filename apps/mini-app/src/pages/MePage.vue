<script setup lang="ts">
import { computed } from 'vue';
import { initData, useSignal } from '@tma.js/sdk-vue';
import { useUserControllerFindMe } from '@pkg/api/client/vue';
import { toUserFriendlyAddress } from '@tonconnect/ui';
import AppPage from '@/components/AppPage.vue';
import AppDisplayData, { type DisplayDataRow } from '@/components/AppDisplayData.vue';

const { data, isPending, isError, isFetching, refetch } = useUserControllerFindMe();

const tgUser = useSignal(initData.user);

const me = computed(() => data.value?.data);

const fullName = computed(() => {
  const tg = tgUser.value;
  const tgName = tg ? [tg.first_name, tg.last_name].filter(Boolean).join(' ') : '';
  return tgName || 'Unknown user';
});

const initials = computed(() => fullName.value
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0]!.toUpperCase())
  .join(''));

const username = computed(() => tgUser.value?.username);

const accountRows = computed<DisplayDataRow[]>(() => {
  const user = me.value;
  if (!user) {
    return [];
  }
  const rows = [
    { title: 'id', value: user.id || '-' },
    { title: 'username', value: user.username || '-' },
    { title: 'name', value: user.first_name || '-' },
  ];
  if (user.ton_address) rows.push({ title: 'ton address', value: toUserFriendlyAddress(user.ton_address) });
  return rows
});

const telegramRows = computed<DisplayDataRow[]>(() => {
  const tg = tgUser.value;
  if (!tg) {
    return [];
  }
  return [
    { title: 'username', value: tg.username ? `@${tg.username}` : undefined },
    { title: 'language', value: tg.language_code },
    { title: 'premium', value: !!tg.is_premium },
    { title: 'writes to pm', value: !!tg.allows_write_to_pm },
  ];
});
</script>

<template>
  <AppPage title="Me">
    <template #disclaimer>
      Your profile, combined from the API and Telegram init data.
    </template>

    <!-- Loading -->
    <div v-if="isPending" class="me-card me-card--skeleton">
      <div class="me-card__hero">
        <div class="me-skeleton me-skeleton--avatar" />
        <div class="me-card__hero-text">
          <div class="me-skeleton me-skeleton--line me-skeleton--wide" />
          <div class="me-skeleton me-skeleton--line" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="isError || !me" class="me-card me-card--error">
      <span class="me-card__error-icon">⚠️</span>
      <div>
        <div class="me-card__error-title">Could not load your profile</div>
        <div class="me-card__error-text">Check your connection and try again.</div>
      </div>
      <button class="me-button" :disabled="isFetching" @click="refetch()">
        {{ isFetching ? 'Retrying…' : 'Retry' }}
      </button>
    </div>

    <!-- Loaded -->
    <template v-else>
      <div class="me-card">
        <div class="me-card__hero">
          <div class="me-card__avatar">
            <img v-if="tgUser?.photo_url" class="me-card__avatar-img" :src="tgUser.photo_url" :alt="fullName">
            <span v-else class="me-card__avatar-initials">{{ initials }}</span>
          </div>

          <div class="me-card__hero-text">
            <div class="me-card__name">
              {{ fullName }}
              <span v-if="tgUser?.is_premium" class="me-badge me-badge--premium">★ Premium</span>
            </div>
            <div v-if="username" class="me-card__username">@{{ username }}</div>
          </div>
        </div>

        <div class="me-card__stats">
          <div class="me-stat">
            <span class="me-stat__value">#{{ me.id }}</span>
            <span class="me-stat__label">User ID</span>
          </div>
          <div class="me-stat">
            <span class="me-stat__value">{{ me.id ?? '—' }}</span>
            <span class="me-stat__label">Telegram ID</span>
          </div>
          <div class="me-stat">
            <span class="me-stat__value">{{ tgUser?.language_code?.toUpperCase() ?? '—' }}</span>
            <span class="me-stat__label">Language</span>
          </div>
        </div>
      </div>

      <section class="me-section">
        <h2 class="me-section__title">Account</h2>
        <div class="me-section__body">
          <AppDisplayData :rows="accountRows" />
        </div>
      </section>

      <section v-if="telegramRows.length" class="me-section">
        <h2 class="me-section__title">Telegram</h2>
        <div class="me-section__body">
          <AppDisplayData :rows="telegramRows" />
        </div>
      </section>
    </template>
  </AppPage>
</template>

<style scoped>
.me-card {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  padding: 18px;
  background: var(--tg-theme-bg-color, #fff);
  box-shadow: 0 8px 24px rgb(0 0 0 / 8%);
}

.me-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 96px;
  background: linear-gradient(135deg,
      var(--tg-theme-button-color, #2990ff),
      var(--tg-theme-accent-text-color, #6f5cff));
  opacity: 0.9;
}

.me-card__hero {
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 14px;
  padding-top: 48px;
}

.me-card__avatar {
  flex: 0 0 auto;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--tg-theme-secondary-bg-color, #f1f1f4);
  border: 3px solid var(--tg-theme-bg-color, #fff);
  box-shadow: 0 4px 12px rgb(0 0 0 / 15%);
}

.me-card__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.me-card__avatar-initials {
  font-size: 26px;
  font-weight: 700;
  color: var(--tg-theme-accent-text-color, #2990ff);
}

.me-card__hero-text {
  min-width: 0;
  padding-bottom: 4px;
}

.me-card__name {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--tg-theme-text-color, #000);
}

.me-card__username,
.me-card__email {
  font-size: 14px;
  color: var(--tg-theme-hint-color, #8a8a8f);
  word-break: break-word;
}

.me-card__username {
  color: var(--tg-theme-link-color, #2990ff);
}

.me-badge {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 2px 8px;
  border-radius: 999px;
  white-space: nowrap;
}

.me-badge--premium {
  background: linear-gradient(135deg, #ffb43a, #ff7a45);
  color: #fff;
}

.me-card__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 18px;
}

.me-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
  text-align: center;
  padding: 10px 6px;
  border-radius: 12px;
  background: var(--tg-theme-secondary-bg-color, #f1f1f4);
}

.me-stat__value {
  font-size: 14px;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000);
  word-break: break-all;
}

.me-stat__label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--tg-theme-hint-color, #8a8a8f);
}

.me-section {
  margin-top: 16px;
}

.me-section__title {
  margin: 0 0 6px 4px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--tg-theme-hint-color, #8a8a8f);
}

.me-section__body {
  padding: 12px 12px 4px;
  border-radius: 14px;
  background: var(--tg-theme-bg-color, #fff);
}

.me-card--error {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.me-card--error::before {
  display: none;
}

.me-card__error-icon {
  font-size: 22px;
}

.me-card__error-title {
  font-weight: 600;
  color: var(--tg-theme-text-color, #000);
}

.me-card__error-text {
  font-size: 13px;
  color: var(--tg-theme-hint-color, #8a8a8f);
}

.me-button {
  margin-left: auto;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  background: var(--tg-theme-button-color, #2990ff);
  color: var(--tg-theme-button-text-color, #fff);
}

.me-button:disabled {
  opacity: 0.6;
  cursor: default;
}

.me-card--skeleton::before {
  opacity: 0.35;
}

.me-skeleton {
  background: var(--tg-theme-secondary-bg-color, #f1f1f4);
  animation: me-pulse 1.2s ease-in-out infinite;
}

.me-skeleton--avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  flex: 0 0 auto;
  border: 3px solid var(--tg-theme-bg-color, #fff);
}

.me-skeleton--line {
  height: 12px;
  width: 96px;
  border-radius: 6px;
}

.me-skeleton--line+.me-skeleton--line {
  margin-top: 8px;
}

.me-skeleton--wide {
  width: 152px;
  height: 16px;
}

@keyframes me-pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}
</style>

