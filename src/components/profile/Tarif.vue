<template>
  <div>
    <q-dialog v-model="rootDialog" @hide="onRootDialogHide" full-width transition-show="scale" transition-hide="scale">
      <q-card v-if="user && address && address.length" class="dialog-min300">
        <q-card-section v-if="user.role.name === 'Authenticated'">
          <div class="text-h5 text-center">{{ $t('Please') }}</div>
          <div class="text-h5 text-center q-ma-none">{{ $t('select a subscription plan') }}</div>
        </q-card-section>
        <q-card-section v-else>
          <div class="text-h5 text-center q-mt-md q-mb-none">{{ $t('Renew your subscription plan') }}</div>
        </q-card-section>
        <q-card-section v-if="tariff">
          <q-card flat bordered class="q-mb-sm">
            <q-card-section v-ripple clickable @click="selectTariff('month')">
              <div class="row items-center no-wrap">
                <div class="col-9">
                  <div class="text-h6 text-positive">1 {{ $t('month') }}</div>
                  <div class="text-caption text-grey-7">{{ $t('Billed monthly') }}</div>
                </div>
                <div class="col text-center">
                  <div class="text-h6">{{ tariff.month }}$</div>
                  <div class="text-subtitle2">{{ Big(tariff.month).div(tariff.currency).round(0, 3).toString() }} bip</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="q-mb-sm">
            <q-card-section v-ripple clickable @click="selectTariff('year')">
              <div class="row items-center no-wrap">
                <div class="col-9">
                  <div class="text-h6 text-positive">1 {{ $t('year') }}</div>
                  <div class="text-caption text-grey-7">{{ $t('Billed yearly') }}</div>
                </div>
                <div class="col text-center">
                  <div class="text-h6">{{ tariff.year }}$</div>
                  <div class="text-subtitle2">{{ Big(tariff.year).div(tariff.currency).round(0, 3).toString() }} bip</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="q-mb-sm">
            <q-card-section v-ripple clickable @click="selectTariff('forever')">
              <div class="row items-center no-wrap">
                <div class="col-9">
                  <div class="text-h6 text-positive">1 {{ $t('Forever') }}</div>
                  <div class="text-caption text-grey-7">{{ $t('Billed once') }}</div>
                </div>
                <div class="col text-center">
                  <div class="text-h6">{{ tariff.forever }}$</div>
                  <div class="text-subtitle2">{{ Big(tariff.forever).div(tariff.currency).round(0, 3).toString() }} bip</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-card-section>
        <q-card-section v-else class="text-center">
          <q-skeleton height="68px" class="q-mb-xs" />
          <q-skeleton height="68px" class="q-mb-xs" />
          <q-skeleton height="68px" class="q-mb-xs" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="payTariffDialog" @hide="onPayTariffDialogHide" full-width transition-show="scale" transition-hide="scale">
      <q-card v-if="address && address.length" class="dialog-min300">
        <q-card-section class="text-center">
          <q-icon name="stars" size="lg" color="positive" class="q-mb-sm" />
          <div class="text-h5 q-mb-md">{{ $t('Pay for a subscription?') }}</div>
          <div class="text-subtitle1">{{ $t('Wallet') }}: <b>{{ findWallet(address).title }}</b></div>
          <div class="text-subtitle1" v-if="selectedTariff !== null">{{ $t('Cost') }}: <b>{{ Big(tariff[selectedTariff]).div(tariff.currency).round(0, 3).toString() }} bip</b></div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-md">
          <q-btn color="red" flat :label="$t('Cancel')" v-close-popup />
          <q-btn color="positive" :loading="loadingTariffDialog" :label="$t('Pay')" @click="payTariff" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="paidDialog" full-width transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300">
        <q-card-section class="text-center">
          <q-icon name="stars" size="lg" color="positive" class="q-mb-sm" />
          <div class="text-h5 q-mb-md">{{ $t('Congratulations, the tariff has been successfully paid') }}</div>
          <div class="text-subtitle1">{{ $t('Tariff ends') }} <b>{{ user.endTariff }}</b></div>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-md">
          <q-btn color="positive" :label="$t('Excellent')" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Big from 'big.js'
export default {
  name: 'Tarif',
  props: {
    rootDialog: Boolean
  },
  data () {
    return {
      payTariffDialog: false,
      loadingTariffDialog: false,
      paidDialog: false,
      selectedTariff: null,
      tariff: null
    }
  },
  created () {
    this.$store.dispatch('GET_HELPER').then(data => {
      this.tariff = data
    })
  },
  methods: {
    Big: (val) => Big(val),
    onPayTariffDialogHide () {
      this.selectedTariff = null
    },
    selectTariff (name) {
      if (this.address && this.address.length) {
        this.$emit('update:rootDialog', false)
        this.payTariffDialog = true
        this.selectedTariff = name
      }
    },
    onRootDialogHide () {
      this.$emit('update:rootDialog', false)
    },
    async payTariff () {
      this.loadingTariffDialog = true
      const nonce = ((new Date().getTime() - 1596493228437) / 1000).toFixed(0)
      const paidData = await this.$store.dispatch('PAY_TARIFF', {
        tariff: this.selectedTariff,
        privateKey: this.privateKey,
        password: this.user.id,
        nonce: nonce,
        coin: 'BIP',
        // value: 1,
        value: Big(this.tariff[this.selectedTariff]).div(this.tariff.currency).round(0, 3).toString(),
        gasCoin: 'BIP',
        dueBlock: 9999999
      })
      if (paidData && !paidData.message) {
        this.$store.dispatch('GET_USER_PROFILE').then(data => {
          this.paidDialog = true
          this.payTariffDialog = false
          this.loadingTariffDialog = false
          this.selectedTariff = null
          this.$store.dispatch('SYNC_USER_CONTACTS')
        })
      } else {
        console.log(paidData.message)
        this.loadingTariffDialog = false
        this.payTariffDialog = false
        this.selectedTariff = null
      }
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      privateKey: state => state.wallet.privateKey,
      user: state => state.user.user
    }),
    ...mapGetters([
      'findWallet',
      'balanceSelect',
      'balanceObj',
      'coinsInfo'
    ])
  }
}
</script>
