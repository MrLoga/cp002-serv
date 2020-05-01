<template>
  <q-page>
    <div class="q-gutter-md q-pa-md">
      <q-input
        v-model="search"
        outlined
        clearable
        bottom-slots
        bg-color="white"
        :label="$t('Search')"
      >
        <template v-slot:append>
          <q-icon v-if="!search || search === ''" name="search" />
        </template>
        <template v-slot:after>
          <q-btn flat size="20px" round icon="add_circle_outline" class="cursor-pointer" @click="newContact = true" />
        </template>
      </q-input>
    </div>

    <q-dialog v-model="newContact" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300">
        <form @submit.prevent.stop="newContactValidate" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
          <q-card-section>
            <div class="text-h6">{{ $t('New contact') }}</div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-input
              v-model="newName"
              outlined
              clearable
              bottom-slots
              :label="$t('Name')"
              :error="newNameIsError"
              :error-message="newNameErrorMsg"
            ></q-input>
            <q-input
              v-model="newAddress"
              outlined
              clearable
              bottom-slots
              :label="$t('Mx address')"
              :error="newAddressIsError"
              :error-message="newAddressErrorMsg"
            ></q-input>
            <div>
              <q-btn type="submit" class="full-width" :label="$t('Add new contact')" color="primary" />
            </div>
          </q-card-section>
        </form>
      </q-card>
    </q-dialog>

    <q-list class="bg-white" bordered separator v-if="contactsFilter && contactsFilter.length > 0">
      <q-item v-for="contact in contactsFilter" :key="contact.address" class="q-my-sm">
        <q-item-section avatar clickable v-ripple @click="$router.push({ name: 'send', params: { import: { address: contact.address } } })">
          <q-avatar color="light-blue-14" text-color="white">
            <q-img v-if="contact.icon" :src="contact.icon" spinner-color="primary" spinner-size="sm" style="height: 40px">
              <template v-slot:error>
                <div class="avatar__text text-white bg-primary">{{ contact.title[0] }}</div>
              </template>
            </q-img>
            <div v-else class="avatar__text text-white bg-primary">{{ contact.title[0] }}</div>
          </q-avatar>
        </q-item-section>

        <q-item-section clickable v-ripple @click="$router.push({ name: 'send', params: { import: { address: contact.address } } })">
          <q-item-label>{{ contact.title }}</q-item-label>
          <q-item-label caption lines="1">{{ contact.address }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <div class="text-grey-8 q-gutter-xs">
            <!-- <q-btn size="18px" flat dense round icon="more_vert"  /> -->
            <q-btn size="18px" flat dense round icon="delete_outline" @click="openContactMenu(contact)" />
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else-if="contacts && contacts.length" class="text-center">
      <div class="text-h5 text-center">
        <div>{{ $t('No contacts found') }}</div>
      </div>
    </div>
    <div v-else class="text-center">
      <div class="text-h5 text-center">
        <div>{{ $t('You dont have any saved contacts') }}</div>
        <q-btn class="q-mt-lg" to="/contacts" color="primary" :label="$t('Add first contact')" @click="newContact = true" />
      </div>
    </div>

  </q-page>
</template>

<script>

import { mapGetters, mapState } from 'vuex'
import { pretty, numberSpaces } from '../utils'

export default {
  name: 'Convert',
  components: {
  },
  data () {
    return {
      search: '',
      newContact: false,
      newName: '',
      newNameIsError: false,
      newNameErrorMsg: null,
      newAddress: '',
      newAddressIsError: false,
      newAddressErrorMsg: null,
      contactForm: false,
      contactsFilter: []
    }
  },
  created () {
    this.contactsFilter = this.contacts
    console.log(this.findContact('Mx7048df59e6154cbe12d0729dd11f326d5abaffcc'))
  },
  methods: {
    pretty: (val, l) => pretty(val, l),
    numberSpaces: val => numberSpaces(val),
    async newContactSave () {
      if (!this.findContact(this.newAddress)) {
        const profile = await this.$store.dispatch('GET_PROFILE', this.newAddress)
        const newContact = {
          title: this.newName,
          address: this.newAddress,
          icon: (profile && profile.icon) ? profile.icon : ''
        }
        this.$store.commit('ADD_CONTACT', newContact)
        this.contactsFilter = this.contacts
        this.$q.notify({
          message: this.$t('Contact added'),
          icon: 'tag_faces',
          color: 'teal',
          position: 'bottom'
        })
      } else {
        this.$q.notify({
          message: this.$t('This contact already exists'),
          icon: 'report_problem',
          color: 'negative',
          position: 'bottom'
        })
      }
      this.search = ''
      this.newName = ''
      this.newAddress = ''
      this.newContact = false
    },
    newContactValidate () {
      this.newNameIsError = false
      this.newNameErrorMsg = null
      this.newAddressIsError = false
      this.newAddressErrorMsg = null

      if (!this.newName || this.newName.length === 0) {
        this.newNameIsError = true
        this.newNameErrorMsg = this.$t('Field is required')
      }
      if (this.newAddress && this.newAddress.length > 0) {
        this.newAddressIsError = true
        this.newAddressErrorMsg = this.$t('Address invalid')
        if ((this.newAddress.substring(0, 2) === 'Mx' && this.newAddress.length === 42) || (this.newAddress.substring(0, 2) === 'Mp' && this.newAddress.length === 66)) {
          this.newAddressIsError = false
          this.newAddressErrorMsg = null
        }
      } else {
        this.newAddressIsError = true
        this.newAddressErrorMsg = this.$t('Field is required')
      }
      if (!this.newAddressIsError && !this.newNameIsError) {
        this.newContactSave()
      }
    },
    openContactMenu (contact) {
      this.$q.dialog({
        title: this.$t('Remove contact'),
        message: this.$t('Would you like to remove') + ` <b>${contact.title}</b> ` + this.$t('from your contact list?'),
        html: true,
        cancel: {
          label: 'Cancel',
          color: 'red',
          flat: true
        },
        ok: {
          label: 'Remove'
        },
        persistent: false
      }).onOk(() => {
        // console.log('>>>> OK')
        this.$store.commit('REMOVE_CONTACT', contact.address)
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      })
    }
  },
  computed: {
    ...mapState({
      contacts: state => state.contacts.contacts
    }),
    ...mapGetters([
      'filterContacts',
      'findContact'
    ])
  },
  watch: {
    newAddress (newVal) {
      this.newAddressIsError = false
      this.newAddressErrorMsg = null
    },
    newName (newVal) {
      this.newNameIsError = false
      this.newNameErrorMsg = null
    },
    search (newVal) {
      if (newVal === null || newVal === '') {
        this.contactsFilter = this.contacts
      } else {
        this.contactsFilter = this.filterContacts(newVal)
      }
    }
  }
}
</script>
