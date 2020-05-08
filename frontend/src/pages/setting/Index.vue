<template>
  <q-page padding>
    <q-list>
      <!-- <q-item to="/setting/private" clickable v-ripple>
        <q-item-section avatar>
          <q-avatar color="teal" text-color="white" icon="visibility" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('Show seed phrase') }}</q-item-label>
          <q-item-label caption>
            {{ $t('Keep it secret') }}
          </q-item-label>
        </q-item-section>
      </q-item> -->
      <q-item-label header>{{ $t('Interface') }}</q-item-label>
      <q-item v-ripple clickable @click="changeMainMenu">
        <q-item-section avatar>
          <q-avatar color="teal" text-color="white" icon="swap_vert" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('Move menu') }}</q-item-label>
          <q-item-label caption>
            {{ menu }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple @click="alertLang = true">
        <q-item-section avatar>
          <q-avatar color="teal" text-color="white" icon="language" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('Change language') }}</q-item-label>
          <q-item-label caption>
            {{ $t('Available') }}: English, Russian
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-avatar color="deep-purple" size="28px" text-color="white">{{ language.substr(0,2) }}</q-avatar>
        </q-item-section>
      </q-item>
      <q-dialog v-model="alertLang">
        <q-card class="dialog-min300">
          <q-card-section>
            <div class="text-h6">{{ $t('Choose a language') }}</div>
          </q-card-section>

          <q-card-section>
            <q-list>
              <q-item tag="label" v-ripple v-for="lang in languageList" :key="lang.value">
                <q-item-section avatar>
                  <q-radio v-model="language" :val="lang.value" color="teal" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ lang.label }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- <q-item clickable v-ripple @click="sendWallet">
        <q-item-section avatar>
          <q-avatar color="teal" text-color="white" icon="phonelink_ring" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('Share wallet') }}</q-item-label>
          <q-item-label caption>
            {{ $t('Send wallet as a link') }}
          </q-item-label>
        </q-item-section>
      </q-item> -->

      <q-separator inset class="q-mb-sm q-mt-sm" />
      <q-item-label header>{{ $t('General') }}</q-item-label>

      <q-item tag="a" href="tg://resolve?domain=reefmn_chat" v-ripple clickable>
        <q-item-section avatar>
          <q-avatar color="teal" text-color="white">
            <q-icon name="not_listed_location" size="1.2em" />
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('Support') }}</q-item-label>
          <q-item-label caption>
            Open Telegram chat: @reefmn_chat
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-ripple clickable @click="logout">
        <q-item-section avatar>
          <q-avatar color="teal" text-color="white" icon="power_settings_new" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('Logout app') }}</q-item-label>
          <q-item-label caption>
            {{ $t('All data will be deleted from this device') }}
          </q-item-label>
        </q-item-section>
      </q-item>

    </q-list>
  </q-page>
</template>

<script>
import { wordlists } from 'bip39'
import { mapState } from 'vuex'
import { copyToClipboard } from 'quasar'

export default {
  name: 'Settings',
  data () {
    return {
      alertLang: false,
      languageList: [
        {
          label: 'English',
          value: 'en-us'
        }, {
          label: 'Russian',
          value: 'ru'
        }
      ]
      // languageTmp: 'en-us'
    }
  },
  methods: {
    changeMainMenu () {
      this.menu = this.menu === 'header' ? 'footer' : 'header'
    },
    sendWallet () {
      const mnemonicKey = this.mnemonic.split(' ').map(word => wordlists.english.indexOf(word)).join('.')
      const linkWallet = location.origin + '/#/hello?key=' + mnemonicKey + '&action=wallet'
      copyToClipboard(linkWallet)
      if (navigator.share) {
        this.$q.dialog({
          title: this.$t('Link to wallet is ready'),
          message: this.$t('Link copied to your clipboard'),
          html: true,
          cancel: {
            label: this.$t('Close'),
            color: 'primary',
            flat: true
          },
          ok: {
            label: this.$t('Share'),
            icon: 'share'
          },
          persistent: false
        }).onOk(() => {
          // console.log('>>>> OK')
          navigator.share({
            title: 'Wallet link',
            text: 'Link to wallet https://wallet.reef.mn/',
            url: linkWallet
          })
            .then(() => console.log('Successful share'))
            .catch(error => console.log('Error sharing', error))
          // this.$store.commit('REMOVE_CONTACT', contact.address)
        }).onCancel(() => {
          // console.log('>>>> Cancel')
        })
      } else {
        this.$q.dialog({
          title: this.$t('Link to wallet is ready'),
          message: this.$t('Link copied to your clipboard'),
          html: true,
          cancel: {
            label: this.$t('Close'),
            color: 'primary',
            flat: true
          },
          ok: false
        })
      }
    },
    logout () {
      setTimeout(() => {
        this.$store.commit('RESET_API')
        this.$store.commit('RESET_APP')
        this.$store.commit('RESET_WALLET')
        this.$store.commit('RESET_REQUEST')
        this.$store.commit('RESET_CONTACTS')

        this.$router.push({ path: '/start' })
      }, 150)
    }
  },
  computed: {
    ...mapState({
      mnemonic: state => state.wallet.mnemonic
    }),
    language: {
      get () {
        return this.$store.state.app.language
      },
      set (value) {
        this.$store.commit('SET_LANG', value)
      }
    },
    menu: {
      get () {
        return this.$store.state.app.menu
      },
      set (value) {
        this.$store.commit('SET_MAIN_MENU', value)
      }
    }
  }
}
</script>
