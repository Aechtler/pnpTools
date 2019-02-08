<template>
    <div class="dice">
        <div class="input-group">
            <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                    <font-awesome-icon class="dice__dice" :class="{'dice__dice--d6': usedDice === 'd6'}" icon="dice-d6" @click="dice('d6')" />
                    <font-awesome-icon class="dice__dice" :class="{'dice__dice--d20': usedDice === 'd20'}" icon="dice-d20" @click="dice('d20')" />
                </span>
            </div>
            <input class="form-control" type="number" v-model="randomNumber" aria-describedby="basic-addon1" disabled />
        </div>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                randomNumber: null,
                usedDice: null
            };
        },
        methods: {
            dice (dice) {
                this.usedDice = dice;
                this.randomNumber = dice === 'd20' ? _.random(1, 20) : _.random(1, 6);
            }
        }
    };
</script>