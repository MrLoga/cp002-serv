<template>
  <div>
    <carousel :navigationEnabled="false" :perPage="3" :paginationEnabled="true">
      <slide>
        <div class="card-app">
          <q-card @click="slideDialog = true">
            <q-card-section>
              <q-avatar color="red" size="48px" text-color="white" icon="phone_iphone" />
              <div class="q-pt-sm">Пополнить телефон</div>
            </q-card-section>
          </q-card>
        </div>
      </slide>
      <slide>
        <div class="card-app">
          <q-card @click="slideDialog = true">
            <q-card-section>
              <q-avatar color="red" size="48px" text-color="white" icon="redeem" />
              <div class="q-pt-sm">Купить сертификат</div>
            </q-card-section>
          </q-card>
        </div>
      </slide>
      <slide>
        <div class="card-app">
          <q-card @click="slideDialog = true">
            <q-card-section>
              <q-avatar color="red" size="48px" text-color="white" icon="language" />
              <div class="q-pt-sm">Оплатить интернет</div>
            </q-card-section>
          </q-card>
        </div>
      </slide>
      <slide>
        <div class="card-app">
          <q-card @click="slideDialog = true">
            <q-card-section>
              <q-avatar color="red" size="48px" text-color="white" icon="videogame_asset" />
              <div class="q-pt-sm">Онлайн игры</div>
            </q-card-section>
          </q-card>
        </div>
      </slide>
      <slide>
        <div class="card-app">
          <q-card @click="slideDialog = true">
            <q-card-section>
              <q-avatar color="red" size="48px" text-color="white" icon="credit_card" />
              <div class="q-pt-sm">Перевод на карту</div>
            </q-card-section>
          </q-card>
        </div>
      </slide>
    </carousel>

    <q-dialog v-model="slideDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-min300 text-center q-pt-lg q-pb-lg">
        <div class="text-h4">SOON</div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'

export default {
  name: 'Apps',
  components: {
    Carousel,
    Slide
  },
  data () {
    return {
      slideDialog: false
    }
  }
}
</script>

<style>
  .card-app {
    padding: 10px;
    font-size: 14px;
    line-height: 1.2em;
    font-weight: 500;
  }
</style>
