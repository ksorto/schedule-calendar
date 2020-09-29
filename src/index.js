import ScheduleCalendar from 'ScheduleCalendar'

export default {
    install(Vue, options) {
        Vue.component('v-schedule-calendar', ScheduleCalendar)
    }
}