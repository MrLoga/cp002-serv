<template>
  <q-page padding>
    <q-list>
      <q-item-label header>General</q-item-label>

      <q-item to="/setting/private" clickable v-ripple>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="visibility" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Show seed phrase</q-item-label>
          <q-item-label caption>
            Keep it secret
          </q-item-label>
        </q-item-section>
      </q-item>

    </q-list>
  </q-page>
</template>
