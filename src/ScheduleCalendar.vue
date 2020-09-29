<template>
    <div class="calendar-container container card border-0">
        <div class="calendar  d-flex flex-column">
            <div class="calendar-header d-flex justify-content-between align-items-center py-3 mb-2">
                <div class="left-buttons">
                    <button class="btn btn-link" @click.prevent="movePreviousYear">
                        <font-awesome-icon :icon="['fas', 'angle-double-left']"/>                    
                    </button>
                    <button class="btn btn-link" @click.prevent="movePreviousMonth">
                        <font-awesome-icon :icon="['fas', 'angle-left']"/>                    
                    </button>                    
                </div>
                <h4>{{ header.label }}</h4>
                <div class="right-buttons">
                    <button class="btn btn-link" @click.prevent="moveNextMonth">                    
                        <font-awesome-icon :icon="['fas', 'angle-right']"/>
                    </button>
                    <button class="btn btn-link" @click.prevent="moveNextYear">                    
                        <font-awesome-icon :icon="['fas', 'angle-double-right']"/>
                    </button>
                </div>
            </div>

            <div class="weeks-container align-self-center">
                <div class="weeks-in-month week  d-flex flex-row" v-for="(week, indexWeek) in weeks" :key="'week--'+indexWeek">
                    <div class="day-in-week day card border-0 m-1 d-flex p-2" 
                        :class="{ 'today' : day.isToday, 'not-in-month' : !day.inMonth }"
                        style="background-color: #EBF2F7" 
                        :style="{ width: settings.day.width, height: settings.day.height}" 
                        v-for="(day, indexDay) in week" 
                        :key="'d__'+indexDay"
                        @click="daySelected(day)">                        
                        <span class="small text-uppercase text-mutted">{{ day['date'].format('ddd') }}</span>
                        <span class="font-weight-bold" style="font-size: 1.1em">{{ day['date'].format('DD') }}</span>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    import Vue from 'vue';

    import moment from 'moment';
    import VueMoment from 'vue-moment';

    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { 
        faAngleDoubleLeft, 
        faAngleLeft,
        faAngleDoubleRight,
        faAngleRight
    } from '@fortawesome/free-solid-svg-icons'
    import { library } from '@fortawesome/fontawesome-svg-core'

    import 'bootstrap/dist/css/bootstrap.min.css'
    import 'jquery/src/jquery.js'
    import 'bootstrap/dist/js/bootstrap.min.js'

    library.add(faAngleDoubleLeft)
    library.add(faAngleDoubleRight)
    library.add(faAngleLeft)
    library.add(faAngleRight)

    Vue.use(VueMoment, { moment });

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
        name: "Calendar",
        components: {
            FontAwesomeIcon
        },
        props: {
            settings: {
                type: Object,
                default: () => ({
                    day: {
                        width: '120px',
                        height: '100px',
                    }
                })
            }
        },
        data () {
            return {
                month: _todayComps.month,
                year: _todayComps.year
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
                    label: month.label + ' ' + this.year,
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
                            events: []
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
                alert(day.date.format('ddd DD MMM'))
                this.$emit('day-clicked', day);
            },
        }
    }
</script>


<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');
    body, html {
        font-family: 'Montserrat', sans-serif;
    }
    .day {
        cursor: pointer;
        transition: 0.3s;
    }
    .not-in-month {
        opacity: 0.4 !important;
        pointer-events: none;
    }
    .day:hover {
        box-shadow: 0 .5rem 1rem rgba(0,0,0,.1)!important;
    }
</style>