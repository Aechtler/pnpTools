const dao = {};

dao.filterPlayers = (players, npc) => {
  return _.filter(players, function(player) {
    return npc ? player.npc : !player.npc;
  });
};

dao.findPlayer = (players, player) => {
  return _.find(players, function(retPlayer) {
     return retPlayer.id === player.id; 
  })
};

export default dao;