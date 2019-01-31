<template>
    <div>
        <NPCTool v-if="!starts" :players="players" />
        <Round v-else :round-count="roundCount"></Round>

        <div class="player-list" v-if="players.length">
            <div class="player-list__player player-list-player" 
                v-for="player in players" 
                :key="player.id" 
                :class="{'player-list-player--active': checkStatus('isPlayerActive', player), 
                         'player-list-player--dead': !checkStatus('isPlayerAlive', player), 
                         'player-list-player--inactive': player.inactive, 
                         'player-list-player--npc': player.npc}">
                <div class="player-list-player__row player-list-player__row--first">
                    <div class="player-list-player__col player-list-player__col--status">
                        <div class="player-list-player__col-item">
                            <font-awesome-icon v-if="checkStatus('isNPCActive', player)" icon="skull" />
                            <font-awesome-icon v-if="checkStatus('isPlayerInLine', player)" icon="user" />
                            <font-awesome-icon v-if="checkStatus('isPlayerNotInLine', player)" icon="user" />
                            <font-awesome-icon v-if="checkStatus('isPlayerDead', player)" icon="skull-crossbones" />
                        </div>
                    </div>
                    <div class="player-list-player__col player-list-player__col--name">
                        <div class="player-list-player__col-item">{{player.name}}</div>
                    </div>
                    <div class="player-list-player__col player-list-player__col--at" v-if="player.npc">
                        <div class="player-list-player__col-item" >AT: {{player.fightAttributes.atn}}</div>
                    </div>
                    <div class="player-list-player__col player-list-player__col--pa" v-if="player.npc">
                        <div class="player-list-player__col-item">PA: {{player.fightAttributes.pa}}</div>
                    </div>
                </div>
                <div class="player-list-player__row player-list-player__row--second">
                    <div class="player-list-player__col player-list-player__col--le">
                        <div class="player-list-player__col-item  player-list-player-col-item">
                            <button type="button" class="btn btn-light / player-list-player-col-item__remove-button" v-if="!starts" @click="dropPlayer(player)">
                                <font-awesome-icon icon="user-times" />
                            </button>

                            <div class="input-group / player-list-player-col-item__le-field">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">
                                        <font-awesome-icon icon="heart" v-if="player.le > 0" />
                                        <font-awesome-icon icon="heart-broken" v-if="player.le == 0" />
                                    </span>
                                </div>
                                <input :disabled="!starts" class="form-control" type="number" v-model="player.le" v-on:keyup="updatePlayersCookie()" aria-describedby="basic-addon1"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="alert alert-warning" v-if="players.length < 2">
                Füge Noch mindestens einen Spieler hinzu, dann kann der Kampf beginnen!
            </div>
        </div>
        
        <div class="player-list-cta" v-if="players.length">
            <div v-if="!starts">
                <button type="button" class="btn" :class="{'btn-primary': players.length > 1, 'btn-secondary': players.length <= 1}" @click="startBattle()" :disabled="players.length < 2">
                    Lets Fight! <font-awesome-icon icon="fist-raised" />
                </button>
                <button type="button" class="btn btn-secondary" @click="removeAllNPC()" v-if="hasPlayers(true)"><font-awesome-icon icon="sync-alt" /></button>
            </div>

            <div v-if="starts">
                <button type="button" class="btn btn-secondary  / player-list-cta__option" @click="reset()"><font-awesome-icon icon="redo-alt" /></button>
                <button type="button" class="btn btn-secondary / player-list-cta__option" @click="stopBattle()"><font-awesome-icon icon="stop" /></button>
                <button type="button" class="btn btn-primary" @click="nextRound(true)">Next <font-awesome-icon icon="caret-right" /></button>
            </div>
        </div>
    </div>
</template>

<script>
    import NPCTool from '@/components/npcTool/NPCTool.vue';
    import Round from '@/components/round/Round.vue';
    import dao from "@/mixins/players-dao.js";

    export default {
        components: {
            NPCTool,
            Round
        },
        data: function() {
            return {
                dao,
                buPlayers: [],
                players: [],
                roundCount: 1,
                iniRoundCount: 1,
                playersLeft: [],
                activePlayer: {},
                starts: false,
                npc: {}
            };
        },
        methods: {
            nextRound (click) {
                if (click) this.roundCount++;

                if (!this.playersLeft.length) {
                    this.iniRoundCount++
                }

                this.getActivePlayer();

                return true;
            },
            startBattle () {
                this.starts = true;
                this.buPlayers = this.clone(this.players);
                this.getActivePlayer();
            },
            getActivePlayer () {
                if (this.playersLeft.length){
                    this.activePlayer = this.playersLeft.pop();

                    if (this.activePlayer.le == 0) {
                        this.nextRound();
                    }

                    return true;
                }

                var currentPlayers = [];

                this.players.forEach(player => {
                    if(this.iniRoundCount % player.fightAttributes.ini === 0 && player.le > 0) {
                        currentPlayers.push(player)
                    }
                });

                switch(currentPlayers.length) {
                    case 0:
                        this.nextRound();
                        break;
                    case 1:
                        this.activePlayer = currentPlayers[0];
                        break;
                    default:
                        this.activePlayer = this.getStrongestPlayer(currentPlayers);
                }
            },
            getStrongestPlayer (currentPlayers) {
                var sortedPlayers = _.sortBy(currentPlayers, [function(player) { 
                        return player.mainAttributes.kk; 
                    }]);
                this.playersLeft = sortedPlayers;

                return sortedPlayers.pop();
            },
            setDefaultAttributes () {
                this.iniRoundCount = 1;
                this.roundCount = 1;
                this.playersLeft = [];
                this.activePlayer = {};
            },
            reset () {
                this.setDefaultAttributes();
                this.players = this.clone(this.buPlayers);
                this.getActivePlayer();
                this.updatePlayersCookie();
            },
            hasPlayers(npc) {
                return this.dao.filterPlayers(this.players, true).length;
            },
            updatePlayersCookie() {
                this.$cookie.set('initPlayers', JSON.stringify(dao.filterPlayers(this.players)), 1);
            },
            removeAllNPC () {
                this.players = _.remove(this.players, function(player) {
                    return !player.npc;
                });

                this.buPlayers = [];
            },
            stopBattle () {
                this.setDefaultAttributes();
                this.players = this.clone(JSON.parse(this.$cookie.get('initPlayers')));
                this.starts = false;
            },
            checkStatus (status, player) {
                var isPlayerNPC = player.npc;
                var isPlayerAlive = player.le > 0;
                var isPlayerActive = this.activePlayer.id === player.id;

                switch(status) {
                    case 'isNPCActive':
                        return isPlayerNPC && isPlayerAlive;
                        break;
                    case 'isPlayerDead':
                        return !isPlayerAlive;
                        break;
                    case 'isPlayerInLine':
                        return !isPlayerNPC && isPlayerAlive && isPlayerAlive;
                        break;
                    case 'isPlayerNotInLine':
                        return !isPlayerNPC && !isPlayerAlive && isPlayerAlive;
                        break;
                    case 'isPlayerActive':
                        return isPlayerActive;
                        break;
                    case 'isPlayerAlive':
                        return isPlayerAlive;
                        break;
                    default:
                        return false;
                }
            },
            togglePlayerStatus(player) {
                this.players = _.map(this.players, function(playerObj) {
                    if (playerObj.id === player.id) {
                        playerObj.inactive = !playerObj.inactive;
                    }

                    return playerObj;
                })

                return false;
            },
            dropPlayer (player) {
                this.players = _.remove(this.players, function(playerObj) {
                    return playerObj.id !== player.id;
                });

                this.playersLeft = _.remove(this.playersLeft, function(playerObj) {
                    return playerObj.id !== player.id;
                });

                (this.starts) ? this.getActivePlayer() : this.updatePlayersCookie();

                return true;
            },
            clone (object) {
                var output, v, key;
                output = Array.isArray(object) ? [] : {};
                for (key in object) {
                    v = object[key];
                    output[key] = (typeof v === "object") ? this.clone(v) : v;
                }
                return output;
            }
        },
        beforeMount: function() {
            var storagedPlayers = this.$cookie.get('initPlayers');

            if (storagedPlayers){
                this.players = this.clone(JSON.parse(storagedPlayers));
            }
        },
    };
</script>