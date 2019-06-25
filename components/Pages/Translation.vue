<template>
  <admin-layout>
    <span slot="admin-page-title">{{ t('Translations') }}</span>

    <v-toolbar>
      <v-spacer></v-spacer>
      <v-btn :loading="translationCompileInProgress" secondary @click="compileTranslations()"> Precompile translations</v-btn>
      <v-btn :loading="translationImportInProgress" secondary @click="importTranslations()"> Import translations from templates</v-btn>
      <!--v-btn :loading="translationDuplicityInProgress" secondary @click="clearDuplicities()"> Clear duplicities in translation codes</v-btn-->
    </v-toolbar>

    <div v-if="languages.length > 0">
      <ui-grid ref="translateGrid" v-if="languages.length > 0" :component="this" :columns="columns" :pager="true" :limiter="true" :search="true" resource_url="backend/translation/index">
        <template slot="grid-items" slot-scope="props">
          <td>{{props.item.t.module}}</td>
          <td>{{props.item.t.code}}</td>
          <td v-for="l in languages">
            <a @click="editTranslation(props.item, l)">{{ props.item["message_" + l.code] || 'Empty translation' }}</a>
          </td>
          <td>
            <a @click="editTranslationComment(props.item)">{{ props.item.t.comment || 'No comment' }}</a>
          </td>
        </template>
      </ui-grid>
      <div class="text-xs-right">
        <v-btn fab dark fixed right bottom color="indigo" @click="addTranslate()">
          <v-icon dark>add</v-icon>
        </v-btn>
      </div>
    </div>
    <div v-else class="text-center"><strong>{{ t("Waiting for languages") }}</strong></div>


    <v-dialog v-if="currentEditLanguage && currentEditMessage && currentEditId" v-model="currentEdit" max-width="500px">
      <v-card>
        <v-card-title>
          <span>{{ t('Edit translation') }}: {{ currentEditLanguage.title }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field multi-line v-model="currentEditMessage['message_' + currentEditLanguage.code]" :label="'Translation for: ' + currentEditMessage.t.code"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" flat @click.stop="cancelTranslation()">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green" flat @click.stop="saveTranslation()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-if="currentEditComment && currentEditId" v-model="currentEditComment" max-width="500px">
      <v-card>
        <v-card-title>
          <span>{{ t('Edit translation comment') }}: {{ currentEditCommentMessage.t.code }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field multi-line v-model="currentEditCommentMessage.t.comment" :label="'Translation comment for: ' + currentEditCommentMessage.t.code"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" flat @click.stop="cancelTranslationComment()">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green" flat @click.stop="saveTranslationComment()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </admin-layout>
</template>

<script>
  export default {
    name: 'Pages',
    mounted () {
      this.columns = [
        { text: 'Module', align: 'left', sortable: false, index: 'module' },
        { text: 'Translation code', align: 'left', sortable: false, index: 'code' }
      ]
      this.apiGet('backend/translation/getlanguages').then((r) => {
        for (let l of r.body.languages) {
          this.columns.push({ text: l.title, align: 'left', sortable: false })
        }
        this.columns.push({ text: 'Comment', align: 'left', sortable: false, index: 'comment' })
        this.languages = r.body.languages
      }).catch((e) => {
        console.log(e)
      })
      this.$on('action-clicked', (action) => {
        switch (action.type) {
          case 'edit':
            this.$router.push({name: 'pages-edit', params: {id: action.item.id_page}})
            break
          default:
            this.$root.$emit('show-alert', {
              type: 'error',
              message: 'Unknown action: ' + action.title
            })
            break
        }
      })
    },
    methods: {
      editTranslation (item, language) {
        this.currentEditId = item['id_message_' + language.code] || 'new'
        this.currentEditMessage = item
        this.currentEditLanguage = language
        this.currentEdit = true
      },
      editTranslationComment (item) {
        this.currentEditId = item.t.id_translate
        this.currentEditCommentMessage = item
        this.currentEditComment = true
      },
      cancelTranslation () {
        this.currentEditId = null
        this.currentEditMessage = null
        this.currentEditLanguage = null
        this.currentEdit = false
      },
      cancelTranslationComment () {
        this.currentEditId = null
        this.currentEditComment = null
        this.currentEditCommentMessage = null
      },
      addTranslate () {
        this.$router.push('/translations/new')
      },
      importTranslations () {
        this.translationImportInProgress = true
        this.apiGet('backend/translation/import').then((s) => {
          console.log(s)
          this.$root.$emit('show-alert', {
            type: 'success',
            message: 'Successfully imported ' + s.body.importedStrings + ' strings from total of ' + s.body.foundStrings + '.\n' + s.body.existedStrings + ' was already in database.\n' + s.body.notImported + ' was not added due error.\nIn request was checked ' + s.body.totalFiles + ' files.'
          })
          this.translationImportInProgress = false
        }).catch((e) => {
          console.log(e)
          this.translationImportInProgress = false
        })
      },
      clearDuplicities () {
        this.translationDuplicityInProgress = true
        this.apiGet('backend/translation/clearduplicities').then((s) => {
          console.log(s)
          this.$root.$emit('show-alert', {
            type: 'success',
            message: 'Successfully cleared ' + s.body.translatestats.translationsCount + ' duplicities codes'
          })
          this.translationDuplicityInProgress = false
        }).catch((e) => {
          console.log(e)
          this.translationDuplicityInProgress = false
        })
      },
      compileTranslations () {
        this.translationCompileInProgress = true
        this.apiGet('backend/translation/compile').then((s) => {
          console.log(s)
          this.$roo.$emit('show-alert', {
            type: 'success',
            message: 'Successfully compiled ' + s.body.translatestats.translationsCount + ' translated strings'
          })
          this.translationCompileInProgress = false
        }).catch((e) => {
          console.log(e)
          this.translationCompileInProgress = false
        })
      },
      saveTranslation () {
        var data = {
          id_translate: this.currentEditMessage.t.id_translate,
          id_language: this.currentEditLanguage.id_language,
          message: this.currentEditMessage['message_' + this.currentEditLanguage.code]
        }
        if (this.currentEditId !== 'new') {
          data.id_translate_content = this.currentEditId
        }
        this.apiPost('backend/translation/savetranslation', data).then((r) => {
          if (r.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: r.body.error
            })
          } else {
            this.cancelTranslation()
            this.$refs.translateGrid.$emit('reload')
          }
        }).catch((e) => {
          console.log(e)
        })
      },
      saveTranslationComment () {
        var data = {
          id_translate: this.currentEditCommentMessage.t.id_translate,
          comment: this.currentEditCommentMessage.t.comment
        }
        if (this.currentEditId !== 'new') {
          data.id_translate = this.currentEditId
        }
        this.apiPost('backend/translation/savecomment', data).then((r) => {
          if (r.body.error) {
            this.$root.$emit('show-alert', {
              type: 'error',
              message: r.body.error
            })
          } else {
            this.cancelTranslationComment()
            this.$refs.translateGrid.$emit('reload')
          }
        }).catch((e) => {
          console.log(e)
        })
      }
    },
    data () {
      return {
        languages: [],
        translationCompileInProgress: false,
        translationImportInProgress: false,
        translationDuplicityInProgress: false,
        columns: [],
        currentEdit: false,
        currentEditComment: false,
        currentEditMessage: null,
        currentEditCommentMessage: null,
        currentEditId: null,
        currentEditLanguage: null
      }
    }
  }
</script>

<style scoped>

</style>
