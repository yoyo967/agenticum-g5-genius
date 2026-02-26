const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const fs = require('fs');

async function runTests() {
  const testEnv = await initializeTestEnvironment({
    projectId: "online-marketing-manager",
    firestore: {
      rules: fs.readFileSync("../firestore.rules", "utf8"),
    },
  });

  const unauthedDb = testEnv.unauthenticatedContext().firestore();
  
  // 1. Seed the emulator with mock data using the admin (rules-disabled) context
  const adminDb = testEnv.withSecurityRulesDisabled().firestore();
  await adminDb.collection('pillars').doc('private-doc').set({ visibility: 'internal', content: 'FAILSAFE GROUNDING' });
  await adminDb.collection('pillars').doc('public-doc').set({ visibility: 'public', content: 'Verified AI Report' });

  console.log("Starting CI Gate: Firestore Rules Integrity Audit...");

  // Test 1: Explicitly reading a private document
  try {
    const docRef = unauthedDb.collection('pillars').doc('private-doc');
    await assertFails(docRef.get());
    console.log("✅ PASS: Denied reading a document where visibility != 'public'");
  } catch(e) {
    console.error("❌ FAIL: Allowed reading private doc", e);
    process.exit(1);
  }

  // Test 2: Explicitly reading a public document
  try {
    const pubDocRef = unauthedDb.collection('pillars').doc('public-doc');
    await assertSucceeds(pubDocRef.get());
    console.log("✅ PASS: Allowed reading a document where visibility == 'public'");
  } catch(e) {
    console.error("❌ FAIL: Denied reading public doc", e);
    process.exit(1);
  }

  // Test 3: Querying the collection with a where clause matching the rule
  try {
    const query = unauthedDb.collection('pillars').where('visibility', '==', 'public');
    await assertSucceeds(query.get());
    console.log("✅ PASS: Allowed querying collection when rigidly constrained to visibility == 'public'");
  } catch(e) {
    console.error("❌ FAIL: Denied querying public docs", e);
    process.exit(1);
  }

  // Test 4: Querying the entire collection WITHOUT the where clause (simulating previous bug)
  try {
    const queryAll = unauthedDb.collection('pillars');
    await assertFails(queryAll.get());
    console.log("✅ PASS: Denied full collection scan. Rules successfully enforced client query parameters.");
  } catch(e) {
    console.error("❌ FAIL: Allowed querying all docs without constraints", e);
    process.exit(1);
  }

  // --- WRITE TESTS (Gate 2: Schema Validation) ---
  const authedDb = testEnv.authenticatedContext('user_123').firestore();

  // Test 5: Writing with correct schema
  try {
    const validWrite = authedDb.collection('pillars').doc('valid-write');
    await assertSucceeds(validWrite.set({ visibility: 'public', title: 'Allowed' }));
    console.log("✅ PASS: Allowed write with visibility == 'public'");
  } catch(e) {
    console.error("❌ FAIL: Denied valid write", e);
    process.exit(1);
  }

  // Test 6: Writing with missing visibility field
  try {
    const invalidWrite = authedDb.collection('pillars').doc('invalid-write-missing');
    await assertFails(invalidWrite.set({ title: 'Denied' }));
    console.log("✅ PASS: Denied write missing the visibility field");
  } catch(e) {
    console.error("❌ FAIL: Allowed write missing visibility", e);
    process.exit(1);
  }

  // Test 7: Writing with incorrect visibility value
  try {
    const invalidWriteVal = authedDb.collection('pillars').doc('invalid-write-value');
    await assertFails(invalidWriteVal.set({ visibility: 'secret', title: 'Denied' }));
    console.log("✅ PASS: Denied write with visibility outside allowed enums");
  } catch(e) {
    console.error("❌ FAIL: Allowed write with invalid visibility enum", e);
    process.exit(1);
  }

  console.log("========================================");
  console.log("ALL FIRESTORE EMULATOR CI TESTS PASSED.");
  console.log("========================================");
  
  await testEnv.cleanup();
  process.exit(0);
}

runTests().catch(e => {
  console.error("Critical Test Framework Failure:", e);
  process.exit(1);
});
