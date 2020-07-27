const createTestCafe        = require('testcafe');
const selfSignedSertificate = require('openssl-self-signed-certificate');


const sslOptions = {
    key:  selfSignedSertificate.key,
    cert: selfSignedSertificate.cert
};

(async function() {const testcafe = await createTestCafe('localhost', 1337, 1338, sslOptions)

      const   runner =  process.argv.includes("--live") ? testcafe.createLiveModeRunner() : testcafe.createRunner();

    await runner.run();
    await testcafe.close();

})()
