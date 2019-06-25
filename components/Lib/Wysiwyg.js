export default {
  data () {
    return {
      largeEditor: {
        height: '600px',
        content_css: 'http://cms.local/skins/zillertalerzeitung/css/style.min.css',
        body_class: 'page-container',
        plugins: 'print preview fontselect formatselect code searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help',
        toolbar1: ' undo redo | fontselect | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image ',

        relative_urls: false
      },
      smallEditor: {
        height: '300px',
        content_css: 'http://cms.local/skins/zillertalerzeitung/css/style.min.css',
        body_class: 'page-container',
        plugins: 'charmap wordcount code'
      }
    }
  },
  methods: {
    getEditorConfig () {
      return this.largeEditor
    },
    getEditorLiteConfig () {
      return this.smallEditor
    }
  }
}
