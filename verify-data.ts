
require('dotenv').config();
const prisma = require('./lib/prisma').default;

async function verify() {
    const count = await prisma.programs.count();
    console.log(`Verification count: ${count}`);
    const first = await prisma.programs.findFirst();
    //console.log("Programs:", all);
    if (first) {
        console.log(`TEST_ID:${first.id}`);
        console.log(`TEST_TITLE:${first.title}`);
    }
}
verify();
