import moment from 'moment'

export default {
  methods: {
    datetimeFormat (date, callbackText = 'Never') {
      try {
        if (!date) {
          throw Error('No date')
        }
        return moment(date).format('D.M.YY, HH:mm')
      } catch (err) {
        return callbackText
      }
    },
    datetimeFormatCustom (date, format = 'D.M.YY, HH:mm', callbackText = 'Never') {
      try {
        if (!date) {
          throw Error('No date')
        }
        return moment(date).format(format)
      } catch (err) {
        return callbackText
      }
    },
    expirationDate (dayCount) {
      try {
        return moment().add(dayCount, 'days').format('dddd, MMMM Do YYYY')
      } catch (err) {
        return 'Unknown'
      }
    }
  }
}
