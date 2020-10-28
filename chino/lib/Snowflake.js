const [NodeVersion] = process.versions.node.split(".");
let ChinoEpoch = 1538773675969;
if (NodeVersion >= 10) ChinoEpoch = BigInt(1538773675969);

module.exports = {
	snowflake() {
		if (NodeVersion >= 10) {
			return String((BigInt(Date.now()) - ChinoEpoch) << BigInt(22));
		} else {
			return String(Date.now() - ChinoEpoch << 22);
		}
	},
};

