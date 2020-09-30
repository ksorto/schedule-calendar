<template>
    <div class="calendar-container container card border-0">
        <div class="calendar  d-flex flex-column">
            <calendar-header 
                :header="header"
                :movePreviousYear="movePreviousYear"
                :movePreviousMonth="movePreviousMonth"
                :moveNextMonth="moveNextMonth"
                :moveNextYear="moveNextYear">
            </calendar-header>

            <div class="weeks-container align-self-center w-100">
                <div class="weeks-in-month week  d-flex flex-row" v-for="(week, indexWeek) in weeks" :key="'week--'+indexWeek">
                    <CalendarDay                          
                        v-for="(day, indexDay) in week" 
                        :key="'day__'+indexDay"
                        :day="day"
                        :settings="settings"
                        @selected="daySelected(day)">
                    </CalendarDay>
                    
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import Vue from 'vue';

    import moment from 'moment';
    import VueMoment from 'vue-moment';

    import $ from 'jquery'
   
    import CalendarHeader from './components/CalendarHeader';
    import CalendarDay from './components/Day';

    import 'bootstrap/dist/css/bootstrap.min.css'
    import 'jquery/src/jquery.js'
    import 'bootstrap/dist/js/bootstrap.min.js'

    

    Vue.use(VueMoment, { moment });

    Vue.directive('day-event-tooltip', function(el, binding){
        if(binding.value <= 0) return;
        $(el).tooltip({
            title: `You have ${binding.value} event(s) today`,
            placement: binding.arg,
            trigger: 'hover'             
        })
    })

    const _daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const _weekdayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const _monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const _today = new Date();
    const _todayComps = {
        year: _today.getFullYear(),
        month: _today.getMonth() + 1,
        day: _today.getDate(),
    };
    export default {
        name: "VCalendar",
        components: {
            CalendarHeader,
            CalendarDay,
        },
        props: {
            settings: {
                type: Object,
                default: () => ({
                    day: {
                        width: '150px',
                        height: '115px',
                    }
                })
            },
            events: {
                type: Array
            }
        },
        data () {
            return {
                month: _todayComps.month,
                year: _todayComps.year,
                calendarEvents: [
                    {
                        id: 1,
                        startDate: '2020-09-30',
                        endDate: moment('2020-09-30'),
                        title: 'Test Event 1',
                        url: null,
                        classes: '',
                        style: ''
                    },
                    {
                        id: 2,
                        startDate: '2020-09-30',
                        endDate: '2020-09-30',
                        title: 'Test Event 2',
                        url: null,
                        classes: '',
                        style: ''
                    },
                    {
                        id: 3,
                        startDate: '2020-09-30',
                        endDate: '2020-09-30',
                        title: 'Test Event 3',
                        url: null,
                        classes: '',
                        style: ''
                    },
                    {
                        id: 4,
                        startDate: '2020-09-01',
                        endDate: '2020-09-07',
                        title: 'Test Event 10',
                        url: null,
                        classes: '',
                        style: ''
                    }
                ]
            }
        },
        computed: {
            // Our component exposes month as 1-based, but sometimes we need 0-based
            monthIndex() {
                return this.month - 1;
            },
            isLeapYear() {
                return (this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0;
            },
            // Day/month/year components for previous month
            previousMonthComps() {
                if (this.month === 1) return {
                    days: _daysInMonths[11],
                    month: 12,
                    year: this.year - 1,
                }
                return {
                    days: (this.month === 3 && this.isLeapYear) ? 29 : _daysInMonths[this.month - 2],
                    month: this.month - 1,
                    year: this.year,
                };
            },
            // Day/month/year components for next month
            nextMonthComps() {
                if (this.month === 12) return {
                    days: _daysInMonths[0],
                    month: 1,
                    year: this.year + 1,
                };
                return {
                    days: (this.month === 2 && this.isLeapYear) ? 29 : _daysInMonths[this.month],
                    month: this.month + 1,
                    year: this.year,
                };
            },
            // State for calendar header (no dependencies yet...)
            months() {
                return _monthLabels.map((ml, i) => ({
                    label: ml,
                    label_1: ml.substring(0, 1),
                    label_2: ml.substring(0, 2),
                    label_3: ml.substring(0, 3),
                    number: i + 1,
                }));
            },
            // State for weekday header (no dependencies yet...)
            weekdays() {
                return _weekdayLabels.map((wl, i) => ({
                    label: wl,
                    label_1: wl.substring(0, 1),
                    label_2: wl.substring(0, 2),
                    label_3: wl.substring(0, 3),
                    number: i + 1,
                }));
            },
            // State for calendar header
            header() {
                const month = this.months[this.monthIndex];
                return {
                    month: month,
                    year: this.year.toString(),
                    shortYear: this.year.toString().substring(2, 4),
                    title: month.label + ' ' + this.year,
                    date: moment([this.year, this.monthIndex, month.number])
                };
            },
            // Returns number for first weekday (1-7), starting from Sunday
            firstWeekdayInMonth() {
                return new Date(this.year, this.monthIndex, 1).getDay() + 1;
            },
            // Returns number of days in the current month
            daysInMonth() {
                // Check for February in a leap year
                if (this.month === 2 && this.isLeapYear) return 29;
                // ...Just a normal month
                return _daysInMonths[this.monthIndex];
            },
            weeks() {
                const weeks = [];
                let previousMonth = true, thisMonth = false, nextMonth = false;
                let day = this.previousMonthComps.days - this.firstWeekdayInMonth + 2;
                let month = this.previousMonthComps.month;
                let year = this.previousMonthComps.year;
                // Cycle through each week of the month, up to 6 total
                for (let w = 1; w <= 6 && !nextMonth; w++) {
                    // Cycle through each weekday
                    const week = [];
                    for (let d = 1; d <= 7; d++) {
                
                        // We need to know when to start counting actual month days
                        if (previousMonth && d >= this.firstWeekdayInMonth) {
                            // Reset day/month/year counters
                            day = 1;
                            month = this.month;
                            year = this.year;
                            // ...and flag we're tracking actual month days
                            previousMonth = false;
                            thisMonth = true;
                        }
              
                        // Append day info for the current week
                        // Note: this might or might not be an actual month day
                        //  We don't know how the UI wants to display various days,
                        //  so we'll supply all the data we can
                        week.push ({
                            label: (day && thisMonth) ? day.toString() : '',
                            day,
                            weekday: d,
                            week: w,
                            month,
                            year,
                            date: moment([year, month - 1, day]),
                            beforeMonth: previousMonth,
                            afterMonth: nextMonth,
                            inMonth: thisMonth,
                            isToday: day === _todayComps.day && month === _todayComps.month && year === _todayComps.year,
                            isFirstDay: thisMonth && day === 1,
                            isLastDay: thisMonth && day === this.daysInMonth,
                            events: this.findEvents(moment([year, month - 1, day]))
                        });
              
                        // We've hit the last day of the month
                        if (thisMonth && day >= this.daysInMonth) {
                            thisMonth = false;
                            nextMonth = true;
                            day = 1;
                            month = this.nextMonthComps.month;
                            year = this.nextMonthComps.year;
                            // Still in the middle of the month (hasn't ended yet)
                        } else {
                            day++;
                        }
                    }
                    // Append week info for the month
                    weeks.push(week);
                }
                return weeks;
            },
        },
        methods: {
            moveThisMonth() {
                this.month = _todayComps.month;
                this.year = _todayComps.year;
            },
            moveNextMonth() {
                const { month, year } = this.nextMonthComps;
                this.month = month;
                this.year = year;
            },
            movePreviousMonth() {
                const { month, year } = this.previousMonthComps;
                this.month = month;
                this.year = year;
            },
            moveNextYear() {
                this.year++;
            },
            movePreviousYear() {
                this.year--;
            },
            daySelected: function (day) {
                console.log(day)
                // alert(day.date.format('ddd DD MMM'))
                this.$emit('day-clicked', day);
            },
            findEvents(date) {
                console.log('===================================')
                console.log('date: ', date.format('YYYY-MM-DD'))

                let findedEvents = this.calendarEvents.filter(event => date.isBetween( this.getDateAsString(event.startDate), this.getDateAsString(event.endDate), undefined, '[]'))
                console.log('Event for ' + date.date() + ':',findedEvents)

                return findedEvents
            },
            getDateAsString(date) {
                if(date instanceof Object)
                    return date.format('YYYY-MM-DD')
                return date
            }
        }
    }
</script>


<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');
    body, html {
        font-family: 'Montserrat', sans-serif;
    }
    .day {
        background-color: #EBF2F7;
        cursor: pointer;
        transition: 0.3s;
        flex: 1 1 0px;
        overflow: hidden;
    }
    .today {        
        transition: 0.3s;
        background-color: #fff !important;
        box-shadow: inset 0px 0px 1px 1px rgba(0,0,0,0.05);
        color: #03A9F4 !important;
    }
    .not-in-month {
        opacity: 0.4 !important;
        pointer-events: none;
    }
    .day:hover {
        box-shadow: 0 .5rem 1rem rgba(0,0,0,.1)!important;
    }
    .day.today:hover {
        box-shadow: inset 0px 0px 1px 1px rgba(0,0,0,0.05), 0 .5rem 1rem rgba(0,0,0,.1)!important;
    }
</style>