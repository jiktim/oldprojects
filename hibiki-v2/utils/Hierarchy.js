/*
  Hibiki Hiearchy Utility

  This handles things such as kick and mute, and
  anything that has to deal with roles or moderation.
*/

// Hierarchy module
module.exports = (member1, member2) => {
  // Handler for if two members aren't in the same guild
  if (member1.guild != member2.guild) throw new TypeError("Members aren't in the same guild.");
  // Owners
  if (member1.guild.ownerID == member1.id) return true;
  if (member1.guild.ownerID == member2.id) return false;
  // Gets the roles length
  if (member1.roles.length === 0) return false;
  if (member2.roles.length === 0) return true;
  // Maps the member's roles
  let member1Roles = member1.roles.map(r => member1.guild.roles.get(r));
  let member2Roles = member2.roles.map(r => member2.guild.roles.get(r));
  // Sorts the member's roles
  member1Roles = member1Roles.sort((a, b) => b.position - a.position);
  member2Roles = member2Roles.sort((a, b) => b.position - a.position);
  // Returns their positions
  return member1Roles[0].position > member2Roles[0].position;
};
