<template>
    <div>
        <NPCTool v-if="!starts" :players="players" />
        <Round v-else :round-count="roundCount" />

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
                            <font-awesome-icon v-if="checkStatus('isPlayerNotInLine', player)" icon="user" />
                            <font-awesome-icon v-if="checkStatus('isPlayerInLine', player)" icon="user" />
                            <font-awesome-icon v-if="checkStatus('isHurtPlayerNotInLine', player)" icon="user-injured" />
                             <font-awesome-icon v-if="checkStatus('isHurtPlayerInLine', player)" icon="user-injured" />
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
                <div class="player-list-player__row">
                    <div class="player-list-player__col player-list-player__col--ini">
                        <div class="player-list-player__col-item  player-list-player-col-item">
                            <div class="input-group / player-list-player-col-item__ini-field">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">
                                        <font-awesome-icon icon="fist-raised" />
                                    </span>
                                </div>
                                <input class="form-control" type="number" :disabled="player.le == 0" v-model="player.fightAttributes.ini" aria-describedby="basic-addon1"/>
                            </div>
                        </div>
                    </div>
                    <div class="player-list-player__col player-list-player__col--le">
                        <div class="player-list-player__col-item  player-list-player-col-item">
                            <button type="button" class="btn btn-light / player-list-player-col-item__remove-button" v-if="!starts" @click="dropPlayer(player)">
                                <font-awesome-icon icon="user-times" />
                            </button>

                            <font-awesome-icon class="player-list-player-col-item__reset" v-if="starts && userIsModified(player)" @click="resetPlayer(player)" icon="sync-alt" />

                            <div class="input-group / player-list-player-col-item__le-field">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">
                                        <font-awesome-icon icon="heart" v-if="player.le > 0" />
                                        <font-awesome-icon icon="heart-broken" v-if="player.le == 0" />
                                    </span>
                                </div>
                                <input class="form-control" type="number" v-model="player.le" v-on:keyup="updatePlayersCookie()" aria-describedby="basic-addon1"/>
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
            <button v-if="!starts" type="button" class="btn / player-list-cta__button" :class="{'btn-primary': players.length > 1, 'btn-secondary': players.length <= 1}" @click="startBattle()" :disabled="players.length < 2">
                Start Battle! <font-awesome-icon icon="dice-d20" />
            </button>
            <button v-if="!starts && hasPlayers(true)" type="button" class="btn btn-secondary / player-list-cta__button" @click="removeAllNPC()"><font-awesome-icon icon="sync-alt" /></button>

            <button v-if="starts" type="button" :disabled="roundCount === 1" class="btn btn-secondary / player-list-cta__option player-list-cta__button" @click="reset()"><font-awesome-icon icon="redo-alt" /></button>
            <button v-if="starts" type="button" class="btn btn-secondary / player-list-cta__option player-list-cta__button" @click="stopBattle()"><font-awesome-icon icon="stop" /></button>
            <button v-if="starts" type="button" class="btn btn-success / player-list-cta__dice" :class="{'player-list-cta__dice--active': showDice}" @click="toggleDiceView()"><font-awesome-icon icon="dice" /></button>
            <Dice v-if="starts" :class="{'dice--show': showDice}" />
            <button v-if="starts" type="button" class="btn btn-primary / player-list-cta__button" @click="nextRound(true)">Next <font-awesome-icon icon="caret-right" /></button>
        </div>
    </div>
</template>

<script>
    import NPCTool from '@/components/NPCTool.vue';
    import Round from '@/components/Round.vue';
    import Dice from '@/components/Dice.vue';
    import dao from "@/mixins/players-dao.js";

    export default {
        components: {
            NPCTool,
            Round,
            Dice
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
                npc: {},
                showDice: false
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
            resetPlayer (player) {
                var buPlayer = this.dao.findPlayer(this.buPlayers, player) || player;
                var clonedBuPlayer = this.clone(buPlayer);

                this.players = _.map(this.players, function (retPlayer){
                    return retPlayer.id === player.id ? clonedBuPlayer : retPlayer;
                });
            },
            hasPlayers (npc) {
                return this.dao.filterPlayers(this.players, npc).length;
            },
            updatePlayersCookie () {
                this.$cookie.set('initPlayers', JSON.stringify(this.players), 1);
            },
            removeAllNPC () {
                this.players = _.remove(this.players, function(player) {
                    return !player.npc;
                });

                this.updatePlayersCookie();

                this.buPlayers = [];
            },
            stopBattle () {
                this.setDefaultAttributes();
                this.players = this.clone(JSON.parse(this.$cookie.get('initPlayers')));
                this.showDice = false;
                this.starts = false;
            },
            userIsModified (player) {
                var buPlayer = this.dao.findPlayer(this.buPlayers, player) || player;
                return buPlayer.le != player.le; 
            },
            checkStatus (status, player) {
                var isPlayerNPC = player.npc;
                var isPlayerAlive = player.le > 0;
                var isPlayerActive = this.activePlayer.id == player.id;
                var buPlayer = this.dao.findPlayer(this.buPlayers, player) || player;
                var isPlayerHurt = parseInt(player.le) < parseInt(buPlayer.le);

                switch(status) {
                    case 'isNPCActive':
                        return isPlayerNPC && isPlayerAlive;
                    case 'isPlayerDead':
                        return !isPlayerAlive;
                    case 'isPlayerInLine':
                        return !isPlayerNPC && isPlayerActive && isPlayerAlive && !isPlayerHurt;
                    case 'isHurtPlayerInLine':
                        return !isPlayerNPC && isPlayerActive && isPlayerAlive && isPlayerHurt;
                    case 'isPlayerNotInLine':
                        return !isPlayerNPC && !isPlayerActive && isPlayerAlive && !isPlayerHurt;
                    case 'isHurtPlayerNotInLine':
                        return !isPlayerNPC && !isPlayerActive && isPlayerAlive && isPlayerHurt;
                    case 'isPlayerActive':
                        return isPlayerActive;
                    case 'isPlayerAlive':
                        return isPlayerAlive;
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
            },
            toggleDiceView () {
                this.showDice = !this.showDice;
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