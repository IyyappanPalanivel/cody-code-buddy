const { queryRepo } = require("../utils/queryRepo");

// node backend/src/scripts/queryCollection.js         
(async () => {
  const matches = await queryRepo('cssm-adminpanel', 'How is the user list fetched?');
  console.log("🔍 Top results:\n", matches);
})();
