<template>
    <div class="dice">
        <button type="button" class="btn btn-success / dice__dice" :class="{'dice__dice--d6': usedDice === 'd6'}" @click="dice('d6')"><font-awesome-icon icon="dice-d6" /></button>
        <button type="button" class="btn btn-success / dice__dice" :class="{'dice__dice--d20': usedDice === 'd20'}" @click="dice('d20')"><font-awesome-icon icon="dice-d20" /></button>
        <!--
        <font-awesome-icon icon="dice-one" v-if="dice6 === 1" />
        <font-awesome-icon icon="dice-two" v-if="dice6 === 2" />
        <font-awesome-icon icon="dice-three" v-if="dice6 === 3" />
        <font-awesome-icon icon="dice-four" v-if="dice6 === 4" />
        <font-awesome-icon icon="dice-five" v-if="dice6 === 5" />
        <font-awesome-icon icon="dice-six" v-if="dice6 === 6" />
        -->
        <input class="form-control / dice__result" type="number" v-model="dicedNumber" aria-describedby="basic-addon1" disabled />
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                usedDice: null,
                dice6: null,
                dice20: null,
                dicedNumber: null
            };
        },
        methods: {
            dice (dice) {
                this.usedDice = dice;
                this.dicedNumber = dice === 'd20' ? _.random(1, 20) : _.random(1, 6);
            }
        }
    };
</script>