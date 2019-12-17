<template>
  <q-page padding>
    <q-list>
      <q-item-label header>{{ $t('General') }}</q-item-label>

      <q-item to="/setting/private" clickable v-ripple>
        <q-item-section avatar>
          <q-avatar color="teal" text-color="white" icon="visibility" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('Show seed phrase') }}</q-item-label>
          <q-item-label caption>
            {{ $t('Keep it secret') }}
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
            {{ $t('Available') }}: English, Russin
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-avatar color="deep-purple" size="28px" text-color="white">En</q-avatar>
        </q-item-section>
      </q-item>
      <q-dialog v-model="alertLang">
        <q-card>
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

    </q-list>
  </q-page>
</template>

<script>

import { mapState } from 'vuex'
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
  method: {},
  computed: {
    ...mapState({
      balancesSelect: state => state.api.balancesSelect
    }),
    language: {
      get () {
        return this.$store.state.app.language
      },
      set (value) {
        this.$store.commit('SET_LANG', value)
      }
    }
  }
}
</script>
