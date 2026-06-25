const db = require('../src/store');

async function main() {
  const data = await db.reset();

  console.log(
    `Database reset with ${data.users.length} users, ${data.campaigns.length} campaigns, ${data.creatorProfiles.length} creator profiles, and ${data.applications.length} applications.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
