import VCalendar from 'VCalendar'

export default {
    install(Vue, options) {
        Vue.component('v-calendar', VCalendar)
    }
}