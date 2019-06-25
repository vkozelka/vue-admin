<template>
  <div>
    <div v-if="lightbox">
      <v-dialog v-model="dialog" max-width="80%" max-height="80%">
        <img :src="source" :alt="alt" :title="title" v-if="source" slot="activator"/>
        <v-progress-circular slot="activator" v-else></v-progress-circular>
        <v-card>
          <v-toolbar>
              <v-btn raised :color="cropActive === true ? 'blue lighten-2' : ''" @click="cropActive = !cropActive">
                <v-icon>crop</v-icon>
              </v-btn>
              <v-btn raised>
                <v-icon>rotate_left</v-icon>
              </v-btn>
              <v-btn raised>
                <v-icon>rotate_right</v-icon>
              </v-btn>
              <v-btn raised>
                <v-icon>swap_horiz</v-icon>
              </v-btn>
              <v-btn raised>
                <v-icon>swap_vert</v-icon>
              </v-btn>
          </v-toolbar>
          <v-divider></v-divider>
          <v-card-text>
            <img :src="sourceFull" :alt="alt" :title="title" v-if="sourceFull"/>
            <v-progress-circular v-else></v-progress-circular>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click="dialog = false">{{t('Close')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <div v-else>
      <img :src="source" :alt="alt" :title="title" v-if="source"/>
      <v-progress-circular v-else></v-progress-circular>
    </div>
  </div>
</template>

<script>
  // import Cropper from 'cropperjs'

  export default {
    name: 'UiImage',
    props: [
      'image_id',
      'lightbox',
      'resource_url',
      'alt',
      'title',
      'mode',
      'width',
      'height',
      'resizeMode',
      'cropWidth',
      'cropHeight',
      'cropMode',
      'rotateAngle',
      'flipMode',
      'sharpPercent',
      'blurPercent',
      'pixelAmount',
      'full'
    ],
    mounted () {
      this.load()
    },
    watch: {
      'image_id' () {
        this.load()
      },
      'dialog' (newVal) {
        if (newVal === true) {
          this.loadFull()
        } else {
          this.croppr = null
        }
      },
      'cropActive' (newVal) {
        if (newVal === true) {

        }
      }
    },
    methods: {
      crop (event) {
      },
      load () {
        this.apiGet(this.resource_url + '/' + this.image_id, {
          mode: this.mode,
          width: this.width,
          height: this.height,
          resizeMode: this.resizeMode,
          cropWidth: this.cropWidth,
          cropHeight: this.cropHeight,
          cropMode: this.cropMode,
          rotateAngle: this.rotateAngle,
          flipMode: this.flipMode,
          sharpPercent: this.sharpPercent,
          blurPercent: this.blurPercent,
          pixelAmount: this.pixelAmount,
          full: this.full
        }).then((r) => {
          if (r.body.image) {
            this.source = r.body.image
          } else {
            this.source = 'https://placehold.it/' + this.width + 'x' + this.height
          }
        }).catch((e) => {
          this.source = 'https://placehold.it/' + this.width + 'x' + this.height
        })
      },
      loadFull () {
        this.apiGet(this.resource_url + '/' + this.image_id, {
          mode: this.mode,
          width: this.width,
          height: this.height,
          resizeMode: this.resizeMode,
          cropWidth: this.cropWidth,
          cropHeight: this.cropHeight,
          cropMode: this.cropMode,
          rotateAngle: this.rotateAngle,
          flipMode: this.flipMode,
          sharpPercent: this.sharpPercent,
          blurPercent: this.blurPercent,
          pixelAmount: this.pixelAmount,
          full: true
        }).then((r) => {
          if (r.body.image) {
            this.sourceFull = r.body.image
          } else {
            this.sourceFull = 'https://placehold.it/' + this.width + 'x' + this.height
          }
        }).catch((e) => {
          this.sourceFull = 'https://placehold.it/' + this.width + 'x' + this.height
        })
      }
    },
    data () {
      return {
        dialog: false,
        source: null,
        sourceFull: null,
        activeTool: null,
        cropActive: false,
        croppr: null
      }
    }
  }
</script>
