<template>
    <div class="day-in-week day card border-0 m-1 d-flex flex-fill flex-grow-1 p-2 position-relative"
        v-day-event-tooltip:top="day.events.length"
        :class="{ 'today' : day.isToday, 'not-in-month' : !day.inMonth }"
        :style="{ height: settings.day.height}"
        @click="$emit('selected', day)">
        <span class="text-uppercase text-mutted" style="font-size: 0.85em">
            <small>{{ day['date'].format('ddd') }}</small>
        </span>
        <span class="font-weight-bold" style="font-size: 0.9em">{{ day['date'].format('DD') }}</span>

        <div class="day-events">
            <div class="day-events-content position-absolute w-100 ">
                <day-event v-for="(event, eventIndex) in day.events" :key="'day-event-'+eventIndex" :event="event"></day-event>                
            </div>
        </div>

        <div class="day-event-indicator p-1 rounded bg-primary d-block position-absolute" 
            v-if="day.events.length > 0"></div>
    </div>
</template>

<script>
    import DayEvent from './DayEvent'
    export default {
        props: {
            day: Object,
            settings: Object
        },
        components: {
            DayEvent
        }
    }
</script>

<style>
    .day-events {
        overflow-y: auto;
    }
    .day-event-indicator {
        right: 0.35em;
        bottom: 3px;
        left: 0.35em;
        z-index: 1030;
    }
</style>