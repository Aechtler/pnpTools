<template>
    <div class="jumbotron jumbotron-fluid">
        <div class="container">
            <div class="npcCreator">
                <h1 class="display-4">
                    <font-awesome-icon icon="user" class="npcCreator__tab" :class="{'npcCreator__tab--inactive': npcTab === 'enemy'}" @click="selectTab('user')" /> 
                    <font-awesome-icon icon="skull" class="npcCreator__tab" :class="{'npcCreator__tab--inactive': npcTab === 'user'}" @click="selectTab('enemy')" /> Add Player
                </h1>
                <div class="npcCreator__row">
                    <div class="npcCreator__col npcCreator__col--name"><input v-model="npc.name" class="form-control" type="text" placeholder="Name" /></div>
                    <div class="npcCreator__col" v-if="npcTab === 'user'" data-placeholder="KK"><input v-model.number="npc.kk" class="form-control" type="number" /></div>
                    <div class="npcCreator__col" v-if="npcTab === 'enemy'" data-placeholder="AT"><input v-model.number="npc.at" class="form-control" type="number" min="1" max="19"/></div>
                    <div class="npcCreator__col" v-if="npcTab === 'enemy'" data-placeholder="PA"><input v-model.number="npc.pa" class="form-control" type="number" min="1" max="19" /></div>
                    <div class="npcCreator__col" data-placeholder="INI"><input v-model.number="npc.ini" class="form-control" type="number" min="1" max="99" /></div>
                    <div class="npcCreator__col" data-placeholder="LE"><input v-model.number="npc.le" class="form-control" type="number" min="1" max="999" /></div>
                    <div class="npcCreator__col">
                        <button class="btn / npcCreator__cta" :class="{'btn-primary': isValidNPC(), 'btn-secondary': !isValidNPC()}" @click="addNPC()" :disabled="!isValidNPC()">
                            <font-awesome-icon icon="plus" />
                        </button>
                        <button v-if="npcTab === 'enemy'" class="btn btn-success / npcCreator__cta" @click="setRandomNPC()">
                            <font-awesome-icon icon="dice" />
                        </button>
                    </div>
                </div>
            </div> 
        </div>
    </div>
</template>

<script>
    import dao from "@/mixins/players-dao.js";

    export default {
        props: {
            players: {
                type: Array,
                required: true
            }
        },
        data: function() {
            return {
                npcTab: 'user',
                npc: {}
            };
        },
        computed: {
            playersArray: {
                get: function () {
                    return this.players;
                },
                set: function (players) {
                    return this.$emit('players', players);
                }
            }
        },
        methods: {
            isValidNPC () {
                var isValidBasic = this.npc.ini && this.npc.le;
                var isValidEnemy = isValidBasic && this.npc.at && this.npc.pa;
                var isValidUser = isValidBasic && this.npc.name && this.npc.kk;

                return this.npcTab === 'user' ? isValidUser : isValidEnemy;
            },
            selectTab (tab) {
                this.npc = {};
                this.npcTab = tab;
            },
            getLastPlayerId () {
                return !this.playersArray.length ? 1 : this.playersArray[this.playersArray.length -1].id + 1;
            },
            setRandomNPC() {
                var npc = [
                    // strong but slow
                    {
                        "id": this.getLastPlayerId(),
                        "name": 'NPC Strong',
                        "le": _.random(25, 35),
                        "ini": _.random(12, 20),
                        "at": _.random(8, 12),
                        "pa": _.random(4, 7)
                    }, 
                    // weak but fast
                    {
                        "id": this.getLastPlayerId(),
                        "name": 'NPC Weak',
                        "le": _.random(20, 25),
                        "ini": _.random(7, 11),
                        "at": _.random(6, 8),
                        "pa": _.random(4, 7)
                    }
                ];

                this.npc = npc[_.random(0, 1)];
            },
            addNPC () {
                var isEnemy = this.npcTab === 'enemy';
                var npcCound = dao.filterPlayers(this.playersArray, true).length + 1;
                var name = isEnemy ? (this.npc.name ? this.npc.name : "NPC") + " (" + npcCound + ")" : this.npc.name
                var npc = {
                    "id": this.getLastPlayerId(),
                    "name": name,
                    "npc": isEnemy,
                    "le": this.npc.le,
                    "mainAttributes": {
                        "kk": !isEnemy ? this.npc.kk : 1
                    }, 
                    "fightAttributes": {
                        "ini": this.npc.ini,
                        "atn": this.npc.at,
                        "pa": this.npc.pa
                    }
                };

                this.playersArray.push(npc);

                this.playersArray = _.sortBy(this.playersArray, [function(player) { 
                    return player.npc; 
                }]);

                if (!isEnemy) {
                    this.npc = {};
                }

                this.$cookie.set('initPlayers', JSON.stringify(this.playersArray), 1);

                return npc;
            }
        }
    };
</script>