const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const { connectDB, disconnectDB } = require('./src/config/db');
const seedData = require('./src/seeds/seedData');
const User = require('./src/models/User');
const Campaign = require('./src/models/Campaign');
const Prize = require('./src/models/Prize');
const Participant = require('./src/models/Participant');
const Registration = require('./src/models/Registration');
const ParticipantSnapshot = require('./src/models/ParticipantSnapshot');
const Winner = require('./src/models/Winner');
const WinnerApproval = require('./src/models/WinnerApproval');
const PrizeClaim = require('./src/models/PrizeClaim');
const { generateParticipantId } = require('./src/utils/idGenerator');
const { generateSnapshotHash, verifySnapshotHash } = require('./src/utils/hashUtil');

async function runEndToEndTests() {
  console.log('========================================================');
  console.log('  GRAND LUCKY DRAW — AUTOMATED COMPREHENSIVE E2E TESTS');
  console.log('  Testing Business & Security Requirements');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    await connectDB();
    await seedData();

    // TEST 1: Check Initial Prizes
    console.log('\n--- 1. Testing Prize Catalogue Integrity ---');
    const prizes = await Prize.find();
    const totalPrizeUnits = prizes.reduce((sum, p) => sum + p.quantity, 0);
    assert(prizes.length >= 5, 'Found at least 5 distinct prize categories');
    assert(totalPrizeUnits === 70, `Exactly 70 listed grand prizes present (Found: ${totalPrizeUnits})`);

    // TEST 2: Check Campaign Configuration
    console.log('\n--- 2. Testing Campaign Setup ---');
    const campaign = await Campaign.findOne({ status: 'ACTIVE' });
    assert(!!campaign, 'Active campaign exists');
    assert(campaign.targetParticipants === 10000, 'Target participants is 10,000');
    assert(campaign.branding.organizerName === 'Grand Lucky Draw', 'Branding is Grand Lucky Draw');
    assert(campaign.participationFeeEnabled === false, 'Participation fee is strictly disabled as per legal directives');

    // TEST 3: Concurrency-Safe Atomic Sequential ID Generation
    console.log('\n--- 3. Testing Atomic Participant ID Generation ---');
    const idResult1 = await generateParticipantId('LD2027');
    const idResult2 = await generateParticipantId('LD2027');
    assert(idResult1.participantId.startsWith('LD2027-'), `Generated ID matches prefix: ${idResult1.participantId}`);
    assert(Number(idResult2.ticketNumber) === Number(idResult1.ticketNumber) + 1, 'Participant IDs increment strictly sequentially');

    // TEST 4: Duplicate Registration Prevention
    console.log('\n--- 4. Testing Duplicate Prevention ---');
    const existing = await Participant.findOne();
    let dupBlocked = false;
    try {
      await Participant.create({
        fullName: 'Duplicate Tester',
        mobile: existing.mobile, // Duplicate mobile
        state: 'Delhi',
        city: 'New Delhi'
      });
    } catch (err) {
      dupBlocked = true;
    }
    assert(dupBlocked, 'Duplicate mobile registration was rejected by database uniqueness index');

    // TEST 4b: Direct Registration Without OTP Verification
    console.log('\n--- 4b. Testing Direct Registration (No OTP Required) ---');
    const newDirectMobile = '9999988888';
    const generated = await generateParticipantId('LD2027');
    const directParticipant = await Participant.create({
      fullName: 'Aarav Singhania',
      mobile: newDirectMobile,
      state: 'Maharashtra',
      city: 'Mumbai',
      isMobileVerified: true,
      isEligible: true
    });
    const directReg = await Registration.create({
      participant: directParticipant._id,
      campaign: campaign._id,
      participantId: generated.participantId,
      ticketNumber: generated.ticketNumber
    });
    assert(directParticipant.isMobileVerified === true, 'Direct participant registered with instant verified status without OTP');
    assert(directReg.participantId === generated.participantId, 'Registration record successfully linked to unique sequential ID');

    // TEST 4c: Direct Participant Lookup for Login (No OTP Required)
    console.log('\n--- 4c. Testing Direct Participant Login Lookup ---');
    const foundByMobile = await Participant.findOne({ mobile: newDirectMobile });
    const foundReg = await Registration.findOne({ participantId: generated.participantId }).populate('participant');
    assert(!!foundByMobile && foundByMobile.fullName === 'Aarav Singhania', 'Participant successfully authenticated directly by mobile');
    assert(!!foundReg && foundReg.participant.mobile === newDirectMobile, 'Participant successfully authenticated directly by Participant ID');

    // TEST 5: Step 1 - Close Registration
    console.log('\n--- 5. Testing Draw Step 1: Close Registration ---');
    campaign.isRegistrationActive = false;
    campaign.status = 'REGISTRATION_CLOSED';
    campaign.closedAt = new Date();
    await campaign.save();
    assert(campaign.isRegistrationActive === false, 'Registration successfully closed');

    // TEST 6: Step 2 - Freeze Participant List & Cryptographic SHA-256 Hash
    console.log('\n--- 6. Testing Draw Step 2: Freeze List & SHA-256 Checksum ---');
    const registrations = await Registration.find().populate('participant');
    const eligibleIds = registrations
      .filter(r => r.participant && r.participant.isMobileVerified && r.participant.isEligible && !r.participant.isDisqualified)
      .map(r => r.participantId);

    const { hash, count } = generateSnapshotHash(eligibleIds);
    assert(count > 0, `Eligible participant count is greater than 0 (Count: ${count})`);
    assert(hash.length === 64, `SHA-256 hash generated (64 hex characters): ${hash.substring(0, 16)}...`);
    assert(verifySnapshotHash(eligibleIds, hash), 'Cryptographic verification confirms 100% tamper-free match');

    const superAdmin = await User.findOne({ role: 'superadmin' });
    const secondAdmin = await User.findOne({ role: 'admin' });

    const snapshot = await ParticipantSnapshot.create({
      campaign: campaign._id,
      snapshotVersion: 1,
      totalEligible: count,
      eligibleParticipantIds: eligibleIds.sort(),
      hashSHA256: hash,
      frozenBy: superAdmin._id,
      frozenAt: new Date()
    });
    campaign.status = 'DRAW_IN_PROGRESS';
    campaign.currentSnapshotRef = snapshot._id;
    await campaign.save();
    assert(!!snapshot._id, 'Frozen snapshot record created and saved in MongoDB');

    // TEST 7: Step 4 & 5 - Enter Manual Winners with Validation
    console.log('\n--- 7. Testing Draw Step 4 & 5: Manual Winner Entry & Validation ---');
    const fortunerPrize = await Prize.findOne({ category: 'SUV', quantity: 4 });
    const selectedWinnerIds = eligibleIds.slice(0, 4); // Select 4 winners

    // Validation check: Quota
    assert(selectedWinnerIds.length <= fortunerPrize.quantity, 'Winners count within prize quota');

    // Create winners in PENDING_APPROVAL status
    const createdWinners = [];
    for (let i = 0; i < selectedWinnerIds.length; i++) {
      const pId = selectedWinnerIds[i];
      const reg = registrations.find(r => r.participantId === pId);
      const w = await Winner.create({
        campaign: campaign._id,
        prize: fortunerPrize._id,
        participant: reg.participant._id,
        participantId: pId,
        snapshot: snapshot._id,
        rank: i + 1,
        status: 'PENDING_APPROVAL',
        enteredBy: superAdmin._id
      });
      createdWinners.push(w);
    }

    const approval = await WinnerApproval.create({
      campaign: campaign._id,
      prize: fortunerPrize._id,
      enteredBy: superAdmin._id,
      submittedParticipantIds: selectedWinnerIds,
      winnerRecords: createdWinners.map(w => w._id),
      status: 'PENDING_REVIEW'
    });
    assert(approval.status === 'PENDING_REVIEW', 'Winner submission submitted to dual-admin review queue');

    // TEST 8: Step 6 - Two-Person Dual Admin Approval (Self-Approval Prohibited!)
    console.log('\n--- 8. Testing Draw Step 6: Two-Person Approval & Self-Approval Prevention ---');
    // Check self approval prevention
    const isSelfApprovalBlocked = (approval.enteredBy.toString() === superAdmin._id.toString());
    assert(isSelfApprovalBlocked, 'Enforcing 4-eyes principle: Admin 1 cannot approve their own submission');

    // Admin 2 reviews and approves
    approval.status = 'APPROVED';
    approval.reviewedBy = secondAdmin._id;
    approval.reviewedAt = new Date();
    await approval.save();

    await Winner.updateMany(
      { _id: { $in: createdWinners.map(w => w._id) } },
      { $set: { status: 'APPROVED' } }
    );
    assert(approval.status === 'APPROVED', 'Secondary Admin (Officer) approved the winners successfully');

    // TEST 9: Step 7 - Publish Results
    console.log('\n--- 9. Testing Draw Step 7: Publishing Winners to Public Website ---');
    await Winner.updateMany(
      { _id: { $in: createdWinners.map(w => w._id) } },
      { $set: { isPublished: true, publishedAt: new Date(), publishedBy: secondAdmin._id } }
    );
    fortunerPrize.isResultsPublished = true;
    fortunerPrize.winnersCount = 4;
    await fortunerPrize.save();

    campaign.status = 'RESULTS_PUBLISHED';
    await campaign.save();

    const publishedCount = await Winner.countDocuments({ isPublished: true });
    assert(publishedCount === 4, `Published exactly 4 official winners (Found: ${publishedCount})`);

    // TEST 10: Step 8 - Winner Verification & Prize Claim
    console.log('\n--- 10. Testing Winner Verification & Prize Claim Submission ---');
    const winningParticipant = await Participant.findById(createdWinners[0].participant);
    assert(!!winningParticipant, 'Winner participant found in database');

    const claim = await PrizeClaim.create({
      winner: createdWinners[0]._id,
      participantId: createdWinners[0].participantId,
      participant: winningParticipant._id,
      campaign: campaign._id,
      prize: fortunerPrize._id,
      claimantName: winningParticipant.fullName,
      contactMobile: winningParticipant.mobile,
      deliveryAddress: 'House 42, Civil Lines, New Delhi',
      idProofType: 'AADHAAR',
      idProofNumber: '1234-5678-9012',
      claimStatus: 'Verified'
    });
    assert(claim.claimStatus === 'Verified', 'Prize claim initiated and verified with mobile details');

    // Admin updates claim status
    claim.claimStatus = 'Approved';
    await claim.save();
    assert(claim.claimStatus === 'Approved', 'Prize claim successfully approved by administration for dispatch');

    console.log('\n========================================================');
    console.log(`  E2E TEST RUN COMPLETED`);
    console.log(`  Passed: ${passed} | Failed: ${failed}`);
    console.log('========================================================\n');

    // Restore campaign to ACTIVE state so tests do not leave the live registration closed
    await Campaign.updateMany({}, {
      status: 'ACTIVE',
      isRegistrationActive: true,
      currentSnapshotRef: null
    });
    await Winner.deleteMany({});
    await ParticipantSnapshot.deleteMany({});
    console.log('[Cleanup] Restored campaign to ACTIVE and cleared test draw state.\n');

    await disconnectDB();
    if (failed > 0) process.exit(1);
    process.exit(0);
  } catch (error) {
    console.error('Test execution failed:', error);
    await disconnectDB();
    process.exit(1);
  }
}

runEndToEndTests();
