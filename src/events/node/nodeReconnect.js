module.exports = async (client, node) => {
  client.node.warn(`Node: ${node.name} => ${node.name} reconnecting.`);
};
