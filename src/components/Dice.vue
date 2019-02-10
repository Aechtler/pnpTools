<template>
    <div class="dice">
        <button type="button" class="btn btn-success / dice__dice" :class="{'dice__dice--d6': usedDice === 6}" @click="dice(6)"><font-awesome-icon icon="dice-d6" /></button>
        <button type="button" class="btn btn-success / dice__dice" :class="{'dice__dice--d20': usedDice === 20}" @click="dice(20)"><font-awesome-icon icon="dice-d20" /></button>
        <button type="button" class="btn btn-secondary / dice__dice dice__dice--result" :class="{'dice__dice--done': diceDone, 'dice__dice--dicing': !diceDone,}" disabled>
            <font-awesome-icon icon="dice-one" v-if="hasDiced6Number(1)" />
            <font-awesome-icon icon="dice-two" v-if="hasDiced6Number(2)" />
            <font-awesome-icon icon="dice-three" v-if="hasDiced6Number(3)" />
            <font-awesome-icon icon="dice-four" v-if="hasDiced6Number(4)" />
            <font-awesome-icon icon="dice-five" v-if="hasDiced6Number(5)" />
            <font-awesome-icon icon="dice-six" v-if="hasDiced6Number(6)" />
            <span v-if="usedDice === 20">{{dicedNumber}}</span>
        </button>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                usedDice: null,
                dicedNumber: null,
                diceDone: false,
            };
        },
        methods: {
            dice (dice) {
                var self = this;
                var count = 1;

                this.diceDone = false;
                this.usedDice = dice;

                while (count < _.random(7, 10)) {
                    setTimeout(function () {
                        self.dicedNumber = _.random(1, dice);
                    }, 100 * count );

                    count++;
                }

                setTimeout(function () {
                    self.diceDone = true;
                }, count * 100 );
            },
            hasDiced6Number(number) {
                return this.usedDice === 6 && this.dicedNumber === number;
            }
        }
    };
</script>