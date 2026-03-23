const WDK = require('@tetherto/wdk').default;
async function test() {
    try {
        console.log('--- WDK Integration Check ---');
        const seed = WDK.getRandomSeedPhrase();
        console.log('✅ WDK Core Loaded');
        console.log('Generated Seed Prefix:', seed.split(' ').slice(0, 3).join(' '));
        process.exit(0);
    } catch (e) {
        console.error('❌ WDK Load Failed:', e.message);
        process.exit(1);
    }
}
test();
