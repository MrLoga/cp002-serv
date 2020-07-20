<template>
  <q-page padding>
    <div>
      <!-- <ServicesList /> -->

      <div class="text-center q-pt-lg text-h5">Раздел в разработке</div>
    </div>
  </q-page>
</template>

<script>
// import ServicesList from '../../components/ServicesList.vue'
import { mapState } from 'vuex'

export default {
  name: 'Services',
  components: {
    // ServicesList
  },
  data () {
    return {
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
  created () {
  },
  methods: {
  },
  computed: {
    ...mapState({
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
