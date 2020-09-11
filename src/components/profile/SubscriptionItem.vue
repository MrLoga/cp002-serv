<template>
  <q-card v-if="user" bordered flat>
    <q-card-section>
      <div class="row">
        <div class="col-auto">
          <div class="text-subtitle2">
            {{ $t(name) }}
            <q-icon
              v-if="user.role.name === 'Paid'"
              color="positive"
              name="done"
              size="xs"
            />
          </div>
          <div class="text-caption q-pt-sm">
            {{ $t(description) }}
          </div>
        </div>
        <q-space />
        <div class="col-2 q-mr-md">
          <q-btn
            class="bg-light-blue-14 text-white full-width"
            dense
            :disabled="user.role.name !== 'Paid'"
            :label="$t('Settings')"
            size="0.9em"
            @click="$emit('click:settings')"
          />
          <!-- <div class="text-caption text-center q-pt-sm">{{ $t('from') }} 0.75$</div> -->
        </div>
        <div v-if="user.role.name !== 'Paid'" class="col-2">
          <q-btn
            class="bg-light-blue-14 text-white full-width"
            dense
            :label="$t('Buy')"
            size="0.9em"
            @click="$emit('click:buy')"
          />
          <div class="text-caption text-center q-pt-sm">
            {{ $t('from') }} 0.75$
          </div>
        </div>
        <div v-else class="col-2">
          <q-btn
            class="text-white q-px-sm"
            color="positive"
            dense
            :label="$t('Renew')"
            size="0.9em"
            @click="$emit('click:buy')"
          />
          <div class="text-caption text-center q-pt-sm">
            {{ $t('Tariff ends') }}<br />{{ user.endTariff }}
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    name: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState({
      user: state => state.user.user,
    }),
  },
}
</script>

<style></style>
