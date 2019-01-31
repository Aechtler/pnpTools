const dao = {};

dao.filterPlayers = (players, npc) => {
  return _.filter(players, function(player) {
    return npc ? player.npc : !player.npc;
  });
};

export default dao;