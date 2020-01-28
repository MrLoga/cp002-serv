<template>
  <q-page padding>
    <div class="text-h5 gray q-mt-sm">{{ $t('Scan QR Code') }}</div>
    <q-btn color="blue-grey-10" rounded icon="camera_alt" label="Read QRCode" class="full-width q-mt-lg" size="lg" @click="turnCameraOn()" v-show="!showCamera"/>
    <div v-if="showCamera" class="q-mt-lg">
      <qrcode-stream @init="onInit" :track="repaint" @decode="onDecode"></qrcode-stream>
      <!-- <qrcode-stream :camera="camera" @decode="onDecode"></qrcode-stream> -->
    </div>
    <q-card flat bordered v-if="result" class="q-mt-lg">
      <q-card-section>
        <div class="text-h6">Last result:</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        {{ result }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>

import { QrcodeStream } from 'vue-qrcode-reader'
import { decodeLink } from 'minter-js-sdk'
export default {
  name: 'QRcode',
  components: { QrcodeStream },
  data () {
    return {
      isValid: undefined,
      camera: 'auto',
      result: null,
      showCamera: true
    }
  },
  methods: {
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
    async onInit (promise) {
      // show loading indicator

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
      this.result = content
      this.turnCameraOff()
      try {
        let decodeLinkResult = decodeLink(content)
        console.log(decodeLinkResult)
        this.$router.push({ name: 'send', params: { sendTxData: decodeLinkResult } })
      } catch (error) {
        console.log(error)
      }
    },
    turnCameraOn () {
      this.camera = 'auto'
      this.showCamera = true
    },
    turnCameraOff () {
      this.camera = 'off'
      this.showCamera = false
    }
  },
  created () {
    // let xx = 'hasdttpsasd://bispasdasdas.toasd/tx?d=f83b01abea8a4249500000000000000094ce705c250ecb7499377f8e16ced2fa302f80f570895bab56d4b2b18c000080c0c08a42495000000000000000'
    // try {
    //   let decodeLinkRes = decodeLink(xx)
    //   console.log(decodeLinkRes)
    // } catch (error) {
    //   console.log(error)
    // }
  }
}
</script>

<style scoped>
.validation-success,
.validation-failure,
.validation-pending {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, .8);
  text-align: center;
  font-weight: bold;
  font-size: 1.4rem;
  padding: 10px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
}
.validation-success {
  color: green;
}
.validation-failure {
  color: red;
}
</style>
