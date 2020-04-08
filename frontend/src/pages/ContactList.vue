<template>
  <q-page padding>
    <div class="q-gutter-md q-pa-md">
      <q-input
        v-model="search"
        outlined
        clearable
        bottom-slots
        :label="$t('Search')"
      >
        <template v-slot:after>
          <q-btn flat size="20px" round icon="add_circle_outline" class="cursor-pointer" @click="newContact = true" />
        </template>
      </q-input>
    </div>
    <q-dialog v-model="newContact" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300">
        <form @submit.prevent.stop="newContactForm" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false">
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
              :rules="[val => !!val || $t('Field is required')]"
            ></q-input>
            <q-input
              v-model="newAddress"
              outlined
              clearable
              bottom-slots
              :label="$t('Mx address')"
              :rules="[
                val => !!val || $t('Field is required'),
                val => (val.substring(0, 2) === 'Mx' && val.length === 42) || $t('Mx address invalid')
              ]"
            ></q-input>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat type="submit" :label="$t('Add new contact')" color="primary" />
          </q-card-actions>
        </form>
      </q-card>
    </q-dialog>

    <q-list bordered separator v-if="contactsFilter && contactsFilter.length > 0">
      <q-item v-for="contact in contactsFilter" :key="contact.address" class="q-my-sm">
        <q-item-section avatar clickable v-ripple @click="$router.push({ name: 'send', params: {routeAddressTo: contact.address }})">
          <q-avatar color="primary" text-color="white">
            {{ contact.title[0] }}
          </q-avatar>
        </q-item-section>

        <q-item-section clickable v-ripple @click="$router.push({ name: 'send', params: {routeAddressTo: contact.address }})">
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
    <div v-else class="text-center">
      <div class="text-h5 text-center">
        <div>{{ $t('You dont have any saved contacts') }}</div>
        <q-btn class="q-mt-lg" to="/contacts" color="primary" :label="$t('Add first contact')" @click="newContact = true" />
      </div>
    </div>

    <!-- <q-dialog ref="menuContact" v-model="menuContact">
      <q-card style="max-width: 240px" class="q-px-sm">
        <q-card-section>
          <q-btn color="red" icon="delete" label="Remove contact" />
        </q-card-section>
      </q-card>
    </q-dialog> -->
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
      newAddress: '',
      contactsFilter: []
    }
  },
  computed: {
    ...mapState({
      contacts: state => state.contacts.contacts
    }),
    ...mapGetters([
      'filterContacts'
      // 'getBlocked'
    ])
  },
  methods: {
    pretty (val, l) { return pretty(val, l) },
    numberSpaces (val) { return numberSpaces(val) },
    newContactForm () {
      if (this.newAddress !== '' && this.newName !== '') {
        this.$store.dispatch('NEW_CONTACT', { title: this.newName, address: this.newAddress }).then(contact => {
          // console.log(contact)
          this.$store.commit('ADD_CONTACT', contact)
          this.contactsFilter = this.contacts
          this.$q.notify({
            message: this.$t('Contact added'),
            icon: 'tag_faces',
            color: 'teal',
            position: 'bottom'
          })
        }).catch(() => {
          // console.log(error)
          this.$q.notify({
            message: this.$t('This contact already exists'),
            icon: 'report_problem',
            color: 'negative',
            position: 'bottom'
          })
        })
        this.search = ''
        this.newName = ''
        this.newAddress = ''
        this.newContact = false
      }
    },
    openContactMenu (contact) {
      // console.log(contact)
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
  created () {
    this.contactsFilter = this.contacts
  },
  watch: {
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
