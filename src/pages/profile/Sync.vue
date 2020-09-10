<template>
  <div class="text-h6 q-pl-md q-pb-xs q-mt-lg">
    {{ $t("Settings") }}
    <span
      v-if="user && user.role.name !== 'Paid'"
      class="text-caption q-ml-md text-grey-7"
      >Disabled</span
    >
  </div>
  <q-card flat bordered>
    <q-card-section>
      <div class="q-gutter-sm">
        <q-checkbox
          v-model="syncContacts"
          :disable="user && user.role.name !== 'Paid'"
          :label="$t('Sync contacts')"
        />
      </div>
      <div class="q-gutter-sm">
        <q-checkbox
          v-model="syncWallets"
          :disable="user && user.role.name !== 'Paid'"
          :label="$t('Sync wallets')"
        />
      </div>
      <div class="q-gutter-sm">
        <q-checkbox
          v-model="syncObservers"
          :disable="user && user.role.name !== 'Paid'"
          :label="$t('Sync observers')"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {};
</script>

<style></style>
