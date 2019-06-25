export default {
  data () {
    return {
      api_endpoint: '/'
    }
  },
  methods: {
    objectToFormData (data) {
      let fd = new FormData()
      Object.keys(data).forEach((k) => {
        fd.append(k, data[k])
      })
      return fd
    },
    apiGet (resource, params) {
      let options = {}
      if (params) {
        options.params = params
      }
      return this.$http.get(this.api_endpoint + resource, options)
    },
    apiPost (resource, data, params) {
      let options = {}
      if (params) {
        options.params = params
      }
      return this.$http.post(this.api_endpoint + resource, this.objectToFormData(data), options)
    }
  }
}
