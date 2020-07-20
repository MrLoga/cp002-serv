<template>
  <div>
    <q-input
      v-model="addressTo"
      outlined
      clearable
      spellcheck="false"
      bottom-slots
      debounce="250"
      bg-color="white"
      :label="$t('Mx address or Mp public key')"
    >
      <template v-slot:hint>
        <div class="text-overflow">{{ addressHint }}</div>
      </template>
      <template v-slot:after v-if="hasPopupAddress">
        <q-btn flat round icon="format_list_bulleted" class="cursor-pointer" @click="popupAddress = true" />
      </template>
      <template v-slot:default v-if="addressTo && addressProfilesShow">
        <q-virtual-scroll
          style="max-height: 300px;"
          :items="contactsFilter"
          separator
          class="contacts__filter"
        >
          <template v-slot="{ item, index }">
            <q-item-label header v-if="item.label && item.label.length" :key="index" class="q-pb-sm q-pl-none">{{ $t(item.label) }}</q-item-label>
            <q-item v-else :key="index" class="q-pl-none q-pr-none" clickable v-ripple v-close-popup @click="addressTo = item.address">
              <q-item-section top avatar class="q-ml-none">
                <q-avatar text-color="primary">
                  <q-img v-if="item.icon && checkIcon(item.icon)" :src="item.icon" spinner-color="primary" spinner-size="sm" style="height: 40px">
                    <template v-slot:error>
                      <div class="avatar__text text-white bg-primary">{{ item.title[0] }}</div>
                    </template>
                  </q-img>
                  <div v-else class="avatar__text text-white bg-primary">{{ item.title[0] }}</div>
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.title }}</q-item-label>
                <q-item-label caption lines="1">{{ item.address }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-virtual-scroll>
      </template>
    </q-input>

    <q-dialog v-model="popupAddress" full-width transition-show="scale" transition-hide="scale">
      <q-card style="height: 60vh;">
        <q-tabs
          v-model="popupAddressTab"
          inline-label
          active-color="white"
          indicator-color="grey-4"
          active-bg-color="light-blue-10"
          class="bg-light-blue-9 text-white"
        >
          <!-- <q-tab no-caps name="addressSelectTab" icon="supervisor_account" :label="$t('Contacts')" />
          <q-tab no-caps name="validatorsSelectTab" icon="work" :label="$t('Validators')" /> -->
          <q-tab no-caps name="addressSelectTab" :label="$t('Contacts')" />
          <q-tab no-caps name="walletsSelectTab" :label="$t('Wallets')" />
          <q-tab no-caps name="validatorsSelectTab" :label="$t('Validators')" />
        </q-tabs>

        <q-tab-panels v-model="popupAddressTab" animated>
          <q-tab-panel name="addressSelectTab">
            <q-virtual-scroll
              v-if="contacts && contacts.length > 0"
              style="max-height: 50vh"
              :items="contacts"
              separator
            >
              <template v-slot="{ item, index }">
                <q-item :key="index" class="q-pl-none q-pr-none" clickable v-ripple v-close-popup @click="addressTo = item.address">
                  <q-item-section top avatar class="q-ml-none">
                    <q-avatar color="primary" text-color="white">
                      <q-img v-if="item.icon && checkIcon(item.icon)" :src="item.icon" spinner-color="primary" spinner-size="sm" style="height: 40px">
                        <template v-slot:error>
                          <div class="avatar__text text-white bg-primary">{{ item.title[0] }}</div>
                        </template>
                      </q-img>
                      <div v-else class="avatar__text text-white bg-primary">{{ item.title[0] }}</div>
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ item.title }}</q-item-label>
                    <q-item-label caption lines="1">{{ item.address }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-virtual-scroll>
            <div v-else class="flex flex-center">
              <div class="self-center text-h5 text-center">
                {{ $t('You dont have any saved contacts') }}<br>
                <q-btn class="q-mt-lg" to="/contacts" color="primary" :label="$t('Add first contact')" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="walletsSelectTab">
            <q-virtual-scroll
              v-if="walletsSelect && walletsSelect.length > 0"
              style="max-height: 50vh"
              :items="walletsSelect"
              separator
            >
              <template v-slot="{ item, index }">
                <q-item :key="index" class="q-pl-none q-pr-none" clickable v-ripple v-close-popup @click="addressTo = item.address">
                  <q-item-section top avatar class="q-ml-none">
                    <q-avatar color="primary" text-color="white">
                      <q-img v-if="item.icon && checkIcon(item.icon)" :src="item.icon" spinner-color="primary" spinner-size="sm" style="height: 40px">
                        <template v-slot:error>
                          <div class="avatar__text text-white bg-primary">{{ item.title[0] }}</div>
                        </template>
                      </q-img>
                      <div v-else class="avatar__text text-white bg-primary">{{ item.title[0] }}</div>
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ item.title }}</q-item-label>
                    <q-item-label caption lines="1">{{ item.address }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-virtual-scroll>
            <div v-else class="flex flex-center">
              <div class="self-center text-h5 text-center">
                {{ $t('You dont have any saved contacts') }}<br>
                <q-btn class="q-mt-lg" to="/contacts" color="primary" :label="$t('Add first contact')" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="validatorsSelectTab" class="q-pr-none">
            <q-virtual-scroll
              style="max-height: 48vh"
              :items="validatorsSelect"
              separator
              class="q-pr-md"
            >
              <template v-slot="{ item, index }">
                <q-item :key="index" class="q-pl-none q-pr-none" clickable v-ripple v-close-popup @click="addressTo = item.value">
                  <q-item-section top avatar class="q-ml-none">
                    <q-avatar text-color="primary">
                      <img v-if="item.icon" :src="item.icon" style="height: 40px" />
                      <!-- <q-img v-if="item.icon" :src="item.icon" spinner-color="primary" spinner-size="sm" style="height: 40px">
                        <template v-slot:error>
                          <div class="avatar__text text-white bg-primary">{{ item.label[0] }}</div>
                        </template>
                      </q-img> -->
                      <div v-else class="avatar__text text-white bg-primary">{{ item.label[0] }}</div>
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ item.label }}</q-item-label>
                    <q-item-label caption lines="2">{{ item.desc }}</q-item-label>
                  </q-item-section>

                  <q-item-section side top>
                    <q-badge :label="pretty(item.part, 2)" />
                  </q-item-section>
                </q-item>
              </template>
            </q-virtual-scroll>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { pretty } from '../utils'
export default {
  name: 'AddressSearch',
  props: {
    value: Object,
    hasPopupAddress: Boolean
  },
  data () {
    return {
      addressTo: this.value.address,
      addressHint: '',
      popupAddressTab: 'addressSelectTab',
      popupAddress: false,
      contactsFilter: null,
      profileTo: null,
      addressProfilesShow: false
    }
  },
  created () {
    // console.log(this.validatorsSelect)
  },
  methods: {
    pretty: (val, l) => pretty(val, l),
    checkIcon: url => (!url.includes('file://') && !url.includes('javascript:') && !url.includes('.js')),
    handleInput () {
      this.$emit('input', {
        address: this.addressTo,
        profile: this.profileTo
      })
    },
    findAddress (address) {
      if (address.substring(0, 2) === 'Mx' && address.length === 42) {
        const user = this.findUser(address)
        if (user) {
          this.addressHint = user.title
          this.profileTo = {
            title: user.title,
            icon: user.icon
          }
        }
      } else if (address.substring(0, 2) === 'Mp' && address.length === 66) {
        const validator = this.findValidator(address)
        if (validator && validator.meta.name) {
          this.addressHint = validator.meta.name
          this.profileTo = {
            title: validator.meta.name,
            icon: validator.meta.icon_url
          }
        } else this.profileTo = {}
      } else {
        this.addressHint = ' '
        this.profileTo = {}
      }
    }
  },
  computed: {
    ...mapState({
      requests: state => state.request.requests,
      validators: state => state.api.validators,
      contacts: state => state.contacts.contacts,
      profiles: state => state.contacts.profiles
    }),
    ...mapGetters([
      'validatorsSelect',
      'walletsSelect',
      'filterContacts',
      'filterProfiles',
      'filterValidator',
      'findValidator',
      'findContact',
      'findProfile',
      'findUser'
    ])
  },
  watch: {
    value (newVal) {
      this.addressTo = newVal.address
    },
    addressTo (newVal) {
      this.addressProfilesShow = false
      if (newVal === null) this.addressHint = ''
      else if (newVal.substr(0, 2) === 'Mx' || newVal.substr(0, 2) === 'Mp') {
        this.findAddress(newVal)
      } else {
        if (newVal.length > 1) {
          this.contactsFilter = []
          const resContacts = this.filterContacts(newVal)
          // console.log(resContacts)
          if (resContacts && resContacts.length) {
            this.contactsFilter.push({ label: 'Contacts' })
            this.contactsFilter = this.contactsFilter.concat(resContacts)
          }
          const resValidator = this.filterValidator(newVal)
          if (resValidator && resValidator.length) {
            this.contactsFilter.push({ label: 'Validators' })
            this.contactsFilter = this.contactsFilter.concat(resValidator)
          }
          const resProfiles = this.filterProfiles(newVal)
          if (resProfiles && resProfiles.length) {
            this.contactsFilter.push({ label: 'Profiles' })
            this.contactsFilter = this.contactsFilter.concat(resProfiles)
          }
          if (this.contactsFilter && this.contactsFilter.length) {
            this.addressProfilesShow = true
          } else {
            this.addressProfilesShow = false
          }
        } else {
          this.addressProfilesShow = false
        }
      }
      this.handleInput()
    }
  }
}
</script>
