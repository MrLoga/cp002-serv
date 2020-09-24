<template>
  <div class="item-wrapper">
    <div class="item-inner d-contents">
      <q-item v-ripple class="bg-white">
        <!-- @click="openDialog(item)" -->
        <q-item-section avatar>
          <q-icon
            v-if="type === 'SEND'"
            color="light-blue-4"
            name="send"
            size="xs"
          />
          <q-icon
            v-else-if="type === 'DELEGATE' || type === 'UNBOND'"
            color="light-blue-4"
            name="work"
            size="xs"
          />
          <q-icon
            v-else-if="type === 'BUY' || type === 'SELL' || type === 'SELL_ALL'"
            color="light-blue-4"
            name="cached"
            size="xs"
          />
          <q-icon
            v-else-if="type === 'MULTISEND'"
            color="light-blue-4"
            name="playlist_play"
            size="sm"
          />
          <q-icon
            v-else-if="type === 'REDEEM_CHECK'"
            color="light-blue-4"
            name="receipt"
            size="sm"
          />
        </q-item-section>
        <q-item-section class="q-mt-xs">
          <q-item-label class="text-weight-medium" lines="">
            From: {{ wallets.find(it => it.address === from).title }} <br />
            To: {{ to }}
          </q-item-label>
          <q-item-label class="text-grey-9 q-pt-xs">
            {{ type.charAt(0) + type.substring(1).toLowerCase() }}: {{ amount }}
            {{ coin }}
          </q-item-label>
          <q-item-label caption class="text-grey" lines="1">
            <div class="q-mt-xs">
              {{ new Date(dateCreated).toLocaleString() }},
              {{ amountLeft }} transactions left
            </div>
            <!-- <div class="q-mt-xs"></div>
            <div class="q-mt-xs">Coin - {{ coin }}</div>
            <div class="q-mt-xs">Amount - {{ amount }}</div>
            <div v-if="description" class="q-mt-xs">
              {{ description }} -->
            <!-- </div> -->
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="no-border second-item">
        <q-item-section avatar />
        <q-item-section>
          <span>
            <q-btn
              v-if="isPaused"
              class="z-max bg-green text-white q-mr-md"
              @click="$emit('click:pause')"
            >
              Continue
            </q-btn>
            <q-btn
              v-else
              class="pause-toggle z-max bg-light-blue-14 text-white q-mr-md"
              @click="$emit('click:pause')"
            >
              Pause
            </q-btn>
            <q-btn
              class="z-max bg-red text-white q-mr-md"
              @click="$emit('click:cancel')"
            >
              Remove
            </q-btn>
            <q-checkbox
              size="lg"
              :value="onlyRewardsAndMultisend"
              @input="$emit('click:rewards')"
            >
              Use only rewards and multisends
            </q-checkbox>
            <!-- <q-btn label="Cancel"> </q-btn> -->
          </span>
        </q-item-section>
      </q-item>
      <div v-if="isPaused" class="item-outer">
        <!-- <span class="q-mx-auto"> Paused </span> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onlyRewardsAndMultisend: {
      default: false,
      type: Boolean,
    },
    amountLeft: {
      default: 1,
      type: Number,
    },
    dateCreated: {
      default: new Date(0),
      type: Date,
    },
    isPaused: {
      default: false,
      type: Boolean,
    },
    description: {
      default: '',
      type: String,
    },
    from: {
      default: '',
      type: String,
    },
    to: {
      default: '',
      type: String,
    },
    coin: {
      default: '',
      type: String,
    },
    amount: {
      default: 0,
      type: Number,
    },
    type: {
      default: 'SEND',
      type: String,
    },
  },
  computed: {
    wallets() {
      return this.$store.state.wallet.wallets
    },
  },
}
</script>

<style>
.item-outer {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #737373;
  color: #e6e6e6;
  font-size: 3em;
  opacity: 25%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
}

.item-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
}

.d-contents {
  display: contents;
}

.second-item {
  margin-top: -8px;
}

.pause-toggle {
  width: 100px;
}
</style>
