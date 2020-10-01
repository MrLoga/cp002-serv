<template>
  <q-page>
    <div class="text-h6 q-pl-md q-pb-xs q-mt-lg q-mb-sm">
      {{ $t('Auto-Transactions settings') }}
      <span
        v-if="user && user.role.name !== 'Paid'"
        class="text-caption q-ml-md text-grey-7"
        >Disabled</span
      >
    </div>
    <div
      v-if="transactions.length === 0"
      class="text-h7 q-pl-md q-pb-xs q-mt-lg"
    >
      You don't have any transactions
    </div>

    <div v-else>
      <q-card bordered flat>
        <q-card-section>
          <span class="flex items-center">
            <span class="text-h6">Active operations</span>
            <!-- <q-btn
              class="q-ml-auto bg-teal text-white"
              @click="
                restockTransactions(transactions.filter(it => !it.paused))
              "
            >
              Restock
            </q-btn> -->
          </span>
        </q-card-section>
        <q-separator />
        <div v-for="(item, index) in transactions" :key="index">
          <AutoTransactionItem
            v-if="!item.paused"
            :amount="item.amount"
            :coin="item.coin"
            :date-created="new Date(item.createdAt)"
            :description="item.description"
            :from="item.wallet"
            :is-paused="item.paused"
            :only-rewards-and-multisend="item.onlyRewardsAndMultisend"
            :to="item.to"
            :tr-amount-left="item.transactions.length"
            :type="item.type"
            @click:cancel="cancel(item)"
            @click:pause="pause(item)"
            @click:rewards="switchType(item)"
          />
          <q-separator :dark="item.paused" />
        </div>
      </q-card>
      <q-card bordered class="q-mt-lg" flat>
        <q-card-section>
          <span class="flex items-center">
            <span class="text-h6">Paused operations</span>
            <!-- <q-btn
              class="q-ml-auto bg-teal text-white"
              @click="restockTransactions(transactions.filter(it => it.paused))"
            >
              Restock
            </q-btn> -->
          </span>
        </q-card-section>
        <q-separator />
        <div v-for="(item, index) in transactions" :key="index">
          <AutoTransactionItem
            v-if="item.paused"
            :amount="item.amount"
            :coin="item.coin"
            :date-created="new Date(item.createdAt)"
            :description="item.description"
            :from="item.wallet"
            :is-paused="item.paused"
            :only-rewards-and-multisend="item.onlyRewardsAndMultisend"
            :to="item.to"
            :tr-amount-left="item.transactions.length"
            @click:cancel="cancel(item)"
            @click:pause="pause(item)"
            @click:rewards="switchType(item)"
          />
          <q-separator :dark="item.paused" />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import _ from 'lodash'
import axios from 'axios'
import { prepareSignedTx } from 'minter-js-sdk'
import AutoTransactionItem from '../../components/profile/AutoTransactionItem.vue'

export default {
  components: { AutoTransactionItem },
  data() {
    return {
      transactions: [],
      local: {
        id: null,
      },
    }
  },
  computed: {
    user() {
      return this.$store.state.user.user
    },
  },
  async mounted() {
    if (!this.$store.state.user.user) {
      return
    }

    const walletsAddreses = this.$store.state.wallet.wallets.map(
      it => it.address
    )

    const transactionPromises = []

    for (const address of walletsAddreses) {
      const promise = axios
        .create({ baseURL: this.$store.state.user.backendApi })
        .get(`auto-transactions?wallet=${address}`)
        .then(it => it.data)

      transactionPromises.push(promise)
    }

    this.transactions = await Promise.all(transactionPromises).then(_.flatten)
  },
  methods: {
    async pause(item) {
      if (item.paused === true) {
        this.restockTransactions([item])
      }

      await axios
        .create({ baseURL: this.$store.state.user.backendApi })
        .put(`auto-transactions/${item.id}`, { paused: !item.paused })

      item.paused = !item.paused
    },
    async restockTransactions(transactions) {
      for (const item of transactions) {
        const nonce = await this.$store.state.wallet.minterGate.getNonce(
          item.wallet
        )
        const txArr = [...new Array(100)].map((_, it) =>
          prepareSignedTx(
            { ...item.txParams, nonce: nonce + it },
            { privateKey: this.$store.state.wallet.privateKey }
          )
            .serialize()
            .toString('hex')
        )

        const transactions = await axios
          .create({ baseURL: this.$store.state.user.backendApi })
          .post('transactions/create-bunch', {
            transactions: txArr,
            email: item.user.email,
            wallet: item.wallet,
          })
          .then(it => it.data)
        await axios
          .create({ baseURL: this.$store.state.user.backendApi })
          .put(`auto-transactions/${item.id}`, { transactions })

        item.transactions = new Array(100)
      }
    },
    async cancel(item) {
      await axios
        .create({ baseURL: this.$store.state.user.backendApi })
        .delete(`auto-transactions/${item.id}`)

      this.transactions.splice(this.transactions.indexOf(item))
    },
    async switchType(item) {
      await axios
        .create({ baseURL: this.$store.state.user.backendApi })
        .put(`auto-transactions/${item.id}`, {
          onlyRewardsAndMultisend: !item.onlyRewardsAndMultisend,
        })

      item.onlyRewardsAndMultisend = !item.onlyRewardsAndMultisend
    },
  },
}
</script>

<style scoped></style>
