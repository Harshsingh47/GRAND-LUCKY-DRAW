const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Prize = require('../models/Prize');
const Participant = require('../models/Participant');
const Registration = require('../models/Registration');
const Counter = require('../models/Counter');
const Announcement = require('../models/Announcement');
const { ROLES, CAMPAIGN_STATUS } = require('../config/constants');

const seedData = async () => {
  try {
    console.log('[Seed] Starting database seeding...');
    await connectDB();

    // Clear existing records
    await Promise.all([
      User.deleteMany(),
      Campaign.deleteMany(),
      Prize.deleteMany(),
      Participant.deleteMany(),
      Registration.deleteMany(),
      Counter.deleteMany(),
      Announcement.deleteMany()
    ]);
    console.log('[Seed] Cleaned existing collections');

    // 1. Create Admins (Primary SuperAdmin and Secondary Admin for 2-step approval)
    const superAdmin = await User.create({
      name: 'Independent Medias Director',
      email: 'admin@independentmedias.com',
      password: 'Password@123',
      role: ROLES.SUPERADMIN,
      isActive: true,
      twoFactorEnabled: false
    });

    const secondAdmin = await User.create({
      name: 'Draw Verification Officer',
      email: 'officer@independentmedias.com',
      password: 'Password@123',
      role: ROLES.ADMIN,
      isActive: true,
      twoFactorEnabled: false
    });

    console.log(`[Seed] Created Admins:\n  - Super Admin: admin@independentmedias.com / Password@123\n  - Secondary Admin: officer@independentmedias.com / Password@123`);

    // 2. Create Official Campaign
    const campaign = await Campaign.create({
      title: 'Grand Lucky Draw 2027',
      slug: 'grand-lucky-draw-2027',
      tagline: 'Dream Big... Win Big...',
      joiningStartDate: new Date('2026-12-01T00:00:00.000Z'),
      registrationClosingDate: new Date('2027-05-15T23:59:59.000Z'),
      drawDate: new Date('2027-05-19T10:00:00.000Z'),
      targetParticipants: 10000,
      currentParticipants: 0,
      status: CAMPAIGN_STATUS.ACTIVE,
      isRegistrationActive: true,
      participationFeeEnabled: false, // strictly disabled as per legal compliance instructions
      branding: {
        organizerName: 'Independent Medias',
        posterUrl: '/uploads/prizes/grand-poster.jpg'
      },
      rules: [
        'Registration is open to all eligible participants residing in India aged 18 and above.',
        'Each participant is entitled to exactly one entry per registered mobile number.',
        'The draw is conducted completely manually by the organizers outside the platform.',
        'Selected winners will be verified and published officially on the website.',
        'Winners must present valid government ID proof to claim their prize.'
      ]
    });
    console.log('[Seed] Created Campaign:', campaign.title);

    // 3. Create 70 Listed Grand Prizes matching promotional poster
    const prizesData = [
      {
        campaign: campaign._id,
        name: 'Toyota Fortuner 4x4',
        category: 'SUV',
        quantity: 4,
        description: 'Brand new luxury Toyota Fortuner 4x4 automatic transmission, full-option flagship SUV.',
        imageUrl: '/uploads/prizes/grand-poster.jpg',
        displayOrder: 1,
        features: ['2.8L Diesel Engine', '4x4 Drive with Auto-Diff Lock', 'Leather Upholstery', 'Ventilated Seats']
      },
      {
        campaign: campaign._id,
        name: 'Mahindra Thar 4x4',
        category: 'SUV',
        quantity: 5,
        description: 'Iconic Mahindra Thar 4x4 Hard Top with adventure pack and off-road capabilities.',
        imageUrl: '/uploads/prizes/grand-poster.jpg',
        displayOrder: 2,
        features: ['mStallion Turbo Engine', '4x4 Manual Shift on Fly', 'Removable Roof Panels', 'Touchscreen Infotainment']
      },
      {
        campaign: campaign._id,
        name: 'Maruti Suzuki Swift',
        category: 'CAR',
        quantity: 20,
        description: 'Premium Maruti Suzuki Swift hatchback, best-in-class mileage and stylish urban drive.',
        imageUrl: '/uploads/prizes/grand-poster.jpg',
        displayOrder: 3,
        features: ['Dualjet VVT Engine', 'Smartplay Pro Navigation', 'Cruise Control', 'Dual Airbags']
      },
      {
        campaign: campaign._id,
        name: 'High-Speed Electric Scooters',
        category: 'TWO_WHEELER',
        quantity: 40,
        description: 'Eco-friendly high-performance Electric Scooter with 120km range per charge.',
        imageUrl: '/uploads/prizes/grand-poster.jpg',
        displayOrder: 4,
        features: ['120 km True Range', 'Fast Charging Support', 'Digital LCD Cluster', 'Anti-theft GPS Tracker']
      },
      {
        campaign: campaign._id,
        name: 'Luxury Farmhouse',
        category: 'REAL_ESTATE',
        quantity: 1,
        description: 'Sprawling luxury farmhouse estate with landscaped gardens and private amenities.',
        imageUrl: '/uploads/prizes/grand-poster.jpg',
        displayOrder: 5,
        features: ['1 Acre Private Grounds', 'Private Swimming Pool', 'Fully Furnished Living Suite', '24/7 Gated Security']
      }
    ];

    await Prize.insertMany(prizesData);
    const totalPrizesCount = prizesData.reduce((acc, p) => acc + p.quantity, 0);
    console.log(`[Seed] Created ${prizesData.length} prize categories totaling ${totalPrizesCount} prizes (4 Fortuners, 5 Thars, 20 Swifts, 40 Electric Scooters, 1 Farmhouse)`);

    // 4. Seed Initial Atomic Counter
    await Counter.create({
      _id: 'LD2027',
      seq: 25 // 25 pre-seeded participants
    });

    // 5. Seed 25 Realistic Participants
    const sampleParticipants = [
      { name: 'Vikramaditya Sharma', mobile: '9810123456', email: 'vikram.sharma@example.com', state: 'Delhi', city: 'New Delhi' },
      { name: 'Priya Mehra', mobile: '9820234567', email: 'priya.mehra@example.com', state: 'Maharashtra', city: 'Mumbai' },
      { name: 'Rajesh Kumar Verma', mobile: '9830345678', email: 'rajesh.verma@example.com', state: 'Uttar Pradesh', city: 'Lucknow' },
      { name: 'Ananya Deshmukh', mobile: '9840456789', email: 'ananya.d@example.com', state: 'Maharashtra', city: 'Pune' },
      { name: 'Gurpreet Singh', mobile: '9850567890', email: 'gurpreet.s@example.com', state: 'Punjab', city: 'Amritsar' },
      { name: 'Sneha Patel', mobile: '9860678901', email: 'sneha.patel@example.com', state: 'Gujarat', city: 'Ahmedabad' },
      { name: 'Karthik Ramanathan', mobile: '9870789012', email: 'karthik.r@example.com', state: 'Karnataka', city: 'Bengaluru' },
      { name: 'Rohan Sen', mobile: '9880890123', email: 'rohan.sen@example.com', state: 'West Bengal', city: 'Kolkata' },
      { name: 'Deepika Rao', mobile: '9890901234', email: 'deepika.rao@example.com', state: 'Telangana', city: 'Hyderabad' },
      { name: 'Amitabh Choudhary', mobile: '9811012345', email: 'amitabh.c@example.com', state: 'Rajasthan', city: 'Jaipur' },
      { name: 'Sunita Nair', mobile: '9821123456', email: 'sunita.nair@example.com', state: 'Kerala', city: 'Kochi' },
      { name: 'Harshavardhan Joshi', mobile: '9831234567', email: 'harsha.joshi@example.com', state: 'Madhya Pradesh', city: 'Indore' },
      { name: 'Pooja Bhatia', mobile: '9841345678', email: 'pooja.bhatia@example.com', state: 'Haryana', city: 'Gurugram' },
      { name: 'Manoj Tiwari', mobile: '9851456789', email: 'manoj.tiwari@example.com', state: 'Bihar', city: 'Patna' },
      { name: 'Divya Sundaram', mobile: '9861567890', email: 'divya.s@example.com', state: 'Tamil Nadu', city: 'Chennai' },
      { name: 'Siddharth Agarwal', mobile: '9871678901', email: 'siddharth.a@example.com', state: 'Delhi', city: 'Delhi' },
      { name: 'Kavita Mishra', mobile: '9881789012', email: 'kavita.m@example.com', state: 'Uttar Pradesh', city: 'Varanasi' },
      { name: 'Tarun Reddy', mobile: '9891890123', email: 'tarun.reddy@example.com', state: 'Andhra Pradesh', city: 'Visakhapatnam' },
      { name: 'Neha Chawla', mobile: '9812901234', email: 'neha.chawla@example.com', state: 'Chandigarh', city: 'Chandigarh' },
      { name: 'Arjun Kapoor', mobile: '9823012345', email: 'arjun.k@example.com', state: 'Maharashtra', city: 'Nagpur' },
      { name: 'Ritu Ganguly', mobile: '9834123456', email: 'ritu.ganguly@example.com', state: 'West Bengal', city: 'Howrah' },
      { name: 'Gopal Krishna', mobile: '9845234567', email: 'gopal.k@example.com', state: 'Karnataka', city: 'Mysuru' },
      { name: 'Monika Shekhawat', mobile: '9856345678', email: 'monika.s@example.com', state: 'Rajasthan', city: 'Jodhpur' },
      { name: 'Devendra Yadav', mobile: '9867456789', email: 'devendra.y@example.com', state: 'Uttar Pradesh', city: 'Noida' },
      { name: 'Shweta Kulkarni', mobile: '9878567890', email: 'shweta.k@example.com', state: 'Goa', city: 'Panaji' }
    ];

    for (let i = 0; i < sampleParticipants.length; i++) {
      const sp = sampleParticipants[i];
      const seq = i + 1;
      const participantId = `LD2027-${String(seq).padStart(6, '0')}`;

      const part = await Participant.create({
        fullName: sp.name,
        mobile: sp.mobile,
        email: sp.email,
        state: sp.state,
        city: sp.city,
        address: `${100 + seq}, Sector ${seq}, City Center`,
        isMobileVerified: true,
        isEligible: true,
        isDisqualified: false,
        acceptedTerms: true,
        consentPrivacy: true
      });

      await Registration.create({
        participantId,
        participant: part._id,
        campaign: campaign._id,
        ticketNumber: seq,
        status: 'ACTIVE'
      });
    }

    await Campaign.findByIdAndUpdate(campaign._id, {
      currentParticipants: sampleParticipants.length
    });

    console.log(`[Seed] Created ${sampleParticipants.length} verified sample participants (IDs LD2027-000001 to LD2027-000025)`);

    // 6. Seed Announcements
    await Announcement.insertMany([
      {
        title: 'Grand Lucky Draw Campaign Officially Launched!',
        content: 'Independent Medias is thrilled to announce the official launch of the Grand Lucky Draw! Registrations are now open. 70 grand prizes await including 4 Fortuners, 5 Thars, 20 Swifts, 40 Electric Scooters, and 1 Luxury Farmhouse.',
        category: 'GENERAL',
        isPinned: true
      },
      {
        title: 'Draw Date Announced: 19 May',
        content: 'The official physical manual draw will take place on 19 May under supervision of independent observers. Registrations will close on 15 May. Register early to secure your unique participant ID.',
        category: 'DRAW_UPDATE',
        isPinned: false
      },
      {
        title: 'Strict Manual Draw & Transparency Guarantee',
        content: 'To guarantee 100% transparency, no automated computer algorithms select winners. The participant list will be cryptographically frozen with a public SHA-256 hash before the physical draw.',
        category: 'IMPORTANT',
        isPinned: true
      }
    ]);
    console.log('[Seed] Created Announcements');

    console.log('[Seed] Database seeding completed successfully!\n');
    return true;
  } catch (error) {
    console.error('[Seed Error]:', error);
    throw error;
  }
};

// Allow direct CLI invocation
if (require.main === module) {
  seedData()
    .then(async () => {
      await disconnectDB();
      process.exit(0);
    })
    .catch(async () => {
      await disconnectDB();
      process.exit(1);
    });
}

module.exports = seedData;
