<template>
    <div class="jumbotron jumbotron-fluid">
        <div class="container">
            <div class="npcCreator">
                <h1 class="display-4">
                    <font-awesome-icon icon="user" class="npcCreator__tab" :class="{'npcCreator__tab--inactive': npcTab === 'enemy'}" @click="selectTab('user')" /> 
                    <font-awesome-icon v-if="players.length" icon="skull" class="npcCreator__tab" :class="{'npcCreator__tab--inactive': npcTab === 'user'}" @click="selectTab('enemy')" /> Add Player
                </h1>
                <div class="npcCreator__row">
                    <div class="npcCreator__col npcCreator__col--name" v-if="npcTab === 'user'"><input v-model="npc.name" class="form-control" type="text" placeholder="Name" /></div>
                    <div class="npcCreator__col" v-if="npcTab === 'user'"><input v-model.number="npc.kk" class="form-control" type="number" placeholder="KK" /></div>
                    <div class="npcCreator__col" v-if="npcTab === 'enemy'"><input v-model.number="npc.at" class="form-control" type="number" min="1" max="19" placeholder="AT" /></div>
                    <div class="npcCreator__col" v-if="npcTab === 'enemy'"><input v-model.number="npc.pa" class="form-control" type="number" min="1" max="19" placeholder="PA" /></div>
                    <div class="npcCreator__col"><input v-model.number="npc.ini" class="form-control" type="number" min="1" max="99" placeholder="INI" /></div>
                    <div class="npcCreator__col"><input v-model.number="npc.le" class="form-control" type="number" min="1" max="999" placeholder="LE" /></div>
                    <div class="npcCreator__col">
                        <button class="btn / npcCreator__cta" :class="{'btn-primary': isValidNPC(), 'btn-secondary': !isValidNPC()}" @click="addNPC()" :disabled="!isValidNPC()">
                            <font-awesome-icon icon="plus" />
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
            playersProp: {
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
            addNPC () {
                var players = this.playersProp;
                var isEnemy = this.npcTab === 'enemy';
                var npcCound = dao.filterPlayers(true, this.players).length + 1;
                var name = isEnemy ? "NPC (" + npcCound + ")" : this.npc.name
                var id = !this.players.length ? 1 : this.players[this.players.length -1].id + 1;
                var npc = {
                    "id": id,
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

                players.push(npc);

                players = _.sortBy(players, [function(player) { 
                    return player.npc; 
                }]);

                if (!isEnemy) {
                    this.npc = {};
                    this.$cookie.set('initPlayers', JSON.stringify(dao.filterPlayers(players)), 1);
                }

                return npc;
            }
        }
    };
</script>