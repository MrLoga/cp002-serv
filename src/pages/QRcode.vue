<template>
  <q-page padding>
    <!-- <div class="text-h5 gray q-mt-sm">{{ $t('Scan QR Code') }}</div> -->
    <div v-if="showCamera" class="q-mt-lg">
      <qrcode-stream @init="onInit" :track="repaint" @decode="onDecode"></qrcode-stream>
      <!-- <qrcode-stream :camera="camera" @decode="onDecode"></qrcode-stream> -->
    </div>
    <q-card v-if="!showCamera && importRes" class="q-mt-lg">
      <q-card-section class="text-center">
        <div class="text-h5 text-grey-7">
          {{ $t('You are') }}
          <span v-if="TX_TYPE('SEND') === importRes.type">{{ $t('Send dialog') }}</span>
          <span v-if="TX_TYPE('DELEGATE') === importRes.type">{{ $t('Delegate dialog') }}</span>
        </div>
        <div class="text-h6">
          {{ prettyNumber(importRes.data.value, 5) }} {{ importRes.data.coin }}
        </div>
      </q-card-section>

      <q-card-section class="row justify-center items-center q-pt-none">
        <q-avatar v-if="profile && profile.icon">
          <img :src="profile.icon">
        </q-avatar>
        <q-icon v-else style="color: #ccc;" size="xl" :name="txType === 'DELEGATE' ? 'developer_board' : 'account_circle'" />
        <span class="q-ml-sm" v-if="profile && profile.title">
          {{ profile.title }}
          <div class="text-grey-7">{{ importRes.data.to.substr(0,4) + "..." + importRes.data.to.substr(-4) }}</div>
        </span>
      </q-card-section>
      <q-separator inset />
      <q-card-actions align='around'>
        <q-btn flat :label="$t('Cancel')" color="red" v-close-popup />
        <q-btn flat :label="$t('Accept')" color="primary" @click="sender" v-close-popup />
      </q-card-actions>
    </q-card>

    <q-card v-else-if="sended" class="q-pa-md">
      <div class="text-h6">{{ $t('Transaction successful') }}</div>
      {{ sended }}
    </q-card>

    <q-separator inset class="q-mb-lg q-mt-lg" v-show="!showCamera" />

    <q-btn push stack class="bg-light-blue-14 text-white full-width q-pa-sm q-mt-lg" icon="camera_alt" label="Read new QRCode" size="lg" @click="turnCameraOn()" v-show="!showCamera" />
    <!-- <q-card flat bordered v-if="result" class="q-mt-lg">
      <q-card-section>
        <div class="text-h6">Last result:</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        {{ result }}
      </q-card-section>
    </q-card> -->

    <!-- <q-dialog v-model="confirmSend" persistent full-width transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300">
        <div v-if="importRes">
          <div v-if="TX_TYPE('SEND') === importRes.type">{{ $t('Send') }}</div>
          <div v-if="TX_TYPE('DELEGATE') === importRes.type">{{ $t('Delegate') }}</div>
        </div>

        <q-separator inset />
        <q-card-actions align='around'>
          <q-btn flat :label="$t('Cancel')" color="red" v-close-popup />
          <q-btn flat :label="$t('Accept')" color="primary" @click="sender" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
  </q-page>
</template>

<script>

import { QrcodeStream } from 'vue-qrcode-reader'
import { mapGetters } from 'vuex'
import { decodeLink, TX_TYPE } from 'minter-js-sdk'
import { checkAddress, prettyNumber } from '../utils'
export default {
  name: 'QRcode',
  components: { QrcodeStream },
  data () {
    return {
      isValid: undefined,
      showCamera: true,
      camera: 'auto',
      result: null,
      profile: null,
      importRes: null,
      sended: false
    }
  },
  created () {},
  methods: {
    TX_TYPE: type => TX_TYPE[type],
    prettyNumber: (val, l) => prettyNumber(val, l),
    repaint (location, ctx) {
      const {
        topLeftCorner,
        topRightCorner,
        bottomLeftCorner,
        bottomRightCorner
        // topLeftFinderPattern,
        // topRightFinderPattern,
        // bottomLeftFinderPattern
      } = location

      ctx.strokeStyle = 'blue' // instead of red

      ctx.beginPath()
      ctx.moveTo(topLeftCorner.x, topLeftCorner.y)
      ctx.lineTo(bottomLeftCorner.x, bottomLeftCorner.y)
      ctx.lineTo(bottomRightCorner.x, bottomRightCorner.y)
      ctx.lineTo(topRightCorner.x, topRightCorner.y)
      ctx.lineTo(topLeftCorner.x, topLeftCorner.y)
      ctx.closePath()

      ctx.stroke()
    },
    turnCameraOn () {
      this.camera = 'auto'
      this.showCamera = true
    },
    turnCameraOff () {
      this.camera = 'off'
      this.showCamera = false
    },
    async onInit (promise) {
      try {
        await promise
        // successfully initialized
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          // user denied camera access permisson
        } else if (error.name === 'NotFoundError') {
          // no suitable camera device installed
        } else if (error.name === 'NotSupportedError') {
          // page is not served over HTTPS (or localhost)
        } else if (error.name === 'NotReadableError') {
          // maybe camera is already in use
        } else if (error.name === 'OverconstrainedError') {
          // did you requested the front camera although there is none?
        } else if (error.name === 'StreamApiNotSupportedError') {
          // browser seems to be lacking features
        }
      } finally {
        // hide loading indicator
      }
    },
    async onDecode (content) {
      this.sended = false
      this.result = content
      this.turnCameraOff()
      const typeContent = checkAddress(content)
      if (typeContent && (typeContent === 'Mx' || typeContent === 'Mp')) {
        this.$router.push({ name: 'send', params: { import: { address: content } } })
      } else {
        try {
          this.importRes = decodeLink(content)
          this.profile = this.findUser(this.importRes.data.to)
          console.log(this.importRes)
          this.confirmSend = true
          // this.$router.push({ name: 'send', params: { import: {
          //   address: decodeLinkResult.data
          //   }
          // })
        } catch (error) {
          console.log(error)
        }
      }
    },
    makeTxData () {
      const txData = {
        data: {
          coin: this.importRes.data.coin
        },
        payload: this.importRes.payload,
        gasCoin: this.importRes.gasCoin || 'BIP'
      }
      if (this.importRes.type === TX_TYPE.SEND) {
        txData.type = 'SEND'
        txData.data.value = this.importRes.data.value
        txData.data.to = this.importRes.data.to
      } else if (this.importRes.type === TX_TYPE.DELEGATE) {
        txData.type = 'DELEGATE'
        txData.data.stake = this.importRes.data.stack
        txData.data.publicKey = this.importRes.data.publicKey
      }
      return txData
    },
    sender () {
      const txData = this.makeTxData()
      this.$store.dispatch('SENDER', txData).then(txHash => {
        this.$q.notify({
          message: this.$t('Transaction successful'),
          icon: 'tag_faces',
          color: 'teal',
          position: 'bottom'
        })
        setTimeout(() => {
          this.importRes = null
          this.sended = txHash
          if (this.txType === 'SEND') {
            this.$store.dispatch('FETCH_BALANCE').then(data => {
              this.setDefaultCoin()
            })
          } else {
            this.$store.dispatch('FETCH_DELEGATION')
          }
        }, 2000)
      }).catch(error => {
        console.log(error)
        this.$q.notify({
          message: error,
          icon: 'report_problem',
          color: 'negative',
          position: 'bottom'
        })
      })
    }
  },
  computed: {
    ...mapGetters([
      'findUser'
    ])
  }
}
</script>
