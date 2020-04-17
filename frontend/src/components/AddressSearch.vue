<template>
  <q-input
    v-model="addressTo"
    outlined
    clearable
    bottom-slots
    :label="$t('Mx address or Mp public key')"
  >
    <template v-slot:hint>
      <div class="text-overflow">{{ addressHint }}</div>
    </template>
    <template v-slot:after v-if="!isHello">
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
          <q-item :key="index" class="q-pl-none q-pr-none" clickable v-ripple v-close-popup @click="addressTo = item.address">
            <q-item-section top avatar class="q-ml-none">
              <q-avatar text-color="primary">
                <q-img v-if="item.icon" :src="item.icon" spinner-color="primary" spinner-size="sm" style="height: 40px">
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
        indicator-color="white"
        class="bg-teal text-white shadow-2"
      >
        <q-tab name="addressSelectTab" icon="supervisor_account" :label="$t('Contacts')" />
        <q-tab name="validatorsSelectTab" icon="work" :label="$t('Validators')" />
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
              <q-item :key="index" clickable v-ripple v-close-popup @click="addressTo = item.address">
                <q-item-section top avatar class="q-ml-none">
                  <q-avatar color="primary" text-color="white">
                    {{ item.title[0] }}
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
        <q-tab-panel name="validatorsSelectTab">
          <q-virtual-scroll
            style="max-height: 50vh"
            :items="validatorsSelect"
            separator
          >
            <template v-slot="{ item, index }">
              <q-item :key="index" clickable v-ripple v-close-popup @click="addressTo = item.value">
                <q-item-section top avatar>
                  <q-avatar v-if="item.icon">
                    <img :src="item.icon">
                  </q-avatar>
                  <q-icon v-else style="color: #ccc;" size="xl" name="developer_board" />
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
</template>