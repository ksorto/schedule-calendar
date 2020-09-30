<template>
    <div class="calendar-header d-flex justify-content-between align-items-center py-3 mb-2">
            <div class="left-buttons">
                <button class="btn btn-link" @click.prevent="movePreviousYear">
                    <font-awesome-icon :icon="['fas', 'angle-double-left']"/>                
                </button>
                <button class="btn btn-link" @click.prevent="movePreviousMonth">
                    <font-awesome-icon :icon="['fas', 'angle-left']"/> 
                    {{ prevMonth }}
                </button>                    
            </div>
            <h4 class="font-weight-bold">{{ header.title }}</h4>
            <div class="right-buttons">
                <button class="btn btn-link" @click.prevent="moveNextMonth"> 
                    {{ nextMonth }}                  
                    <font-awesome-icon :icon="['fas', 'angle-right']"/>
                </button>
                <button class="btn btn-link" @click.prevent="moveNextYear">
                    <font-awesome-icon :icon="['fas', 'angle-double-right']"/>
                </button>
            </div>
        </div>
</template>

<script>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { 
        faAngleDoubleLeft, 
        faAngleLeft,
        faAngleDoubleRight,
        faAngleRight
    } from '@fortawesome/free-solid-svg-icons'
    import { library } from '@fortawesome/fontawesome-svg-core'

    library.add(faAngleDoubleLeft)
    library.add(faAngleDoubleRight)
    library.add(faAngleLeft)
    library.add(faAngleRight)

    export default {
        props: {
            movePreviousYear: {
                type: Function
            },
            movePreviousMonth: {
                type: Function
            },
            moveNextMonth: {
                type: Function
            },
            moveNextYear: {
                type: Function
            },
            header: {
                type: Object
            }
        },
        components: {
            FontAwesomeIcon
        },
        computed: {
            prevMonth: function () {
                return this.header.date.subtract(1, 'months').format('MMMM')
            },
            nextMonth: function () {
                return this.header.date.add(1, 'months').format('MMMM')
            }
        }
    }
</script>