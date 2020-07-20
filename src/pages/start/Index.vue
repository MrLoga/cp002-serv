<template>
  <q-page class="flex justify-between flex-center">
    <div class="full-width text-center">
      <div class="text-h3 text-weight-thin">Welcome to</div>
      <div class="text-h2 text-weight-light">&nbsp;</div>
      <div class="text-h2 text-weight-light" style="height: 128px">
        <q-img src="~assets/icon-256.png" width="128px" />
      </div>
      <div class="text-h2 text-weight-light">&nbsp;</div>
      <div class="text-h2 text-weight-light">Reef</div>
      <div class="text-h2 text-weight-light">wallet</div>
    </div>
    <div class="full-width q-pa-lg">
      <q-btn rounded class="bg-light-blue-14 text-white full-width" size="1.2em" to="/start/quick">{{ $t('Quick start') }}</q-btn>
      <q-btn rounded class="bg-white full-width q-mt-lg" size="1.2em" to="/start/login">{{ $t('Sign In') }}</q-btn>
    </div>
  </q-page>
</template>
