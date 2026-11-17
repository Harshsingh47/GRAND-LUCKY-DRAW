const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');

// In serverless environments (e.g. Vercel, AWS Lambda), the root filesystem is strictly read-only.
// We must use os.tmpdir() for temporary file storage and safely catch any filesystem errors.
const isServerless = !!process.env.VERCEL || process.env.NODE_ENV === 'production';
const baseUploadsDir = isServerless
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, '../../uploads');

const prizesDir = path.join(baseUploadsDir, 'prizes');
const claimsDir = path.join(baseUploadsDir, 'claims');

try {
  if (!fs.existsSync(prizesDir)) fs.mkdirSync(prizesDir, { recursive: true });
} catch (err) {
  console.warn('[Upload] Note: Read-only filesystem detected, using fallback handling:', err.message);
}

try {
  if (!fs.existsSync(claimsDir)) fs.mkdirSync(claimsDir, { recursive: true });
} catch (err) {
  console.warn('[Upload] Note: Read-only filesystem detected, using fallback handling:', err.message);
}

// Prize Image Storage
const prizeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(prizesDir)) fs.mkdirSync(prizesDir, { recursive: true });
    } catch (e) {}
    cb(null, prizesDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `prize-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

// Claim Document Storage
const claimStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(claimsDir)) fs.mkdirSync(claimsDir, { recursive: true });
    } catch (e) {}
    cb(null, claimsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `claim-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const imageFileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|svg/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  const mime = allowed.test(file.mimetype);
  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, webp) are permitted'));
  }
};

const docFileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF or image documents (jpg, jpeg, png, pdf) are permitted'));
  }
};

const uploadPrizeImage = multer({
  storage: prizeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFileFilter
});

const uploadClaimDocument = multer({
  storage: claimStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: docFileFilter
});

module.exports = {
  uploadPrizeImage,
  uploadClaimDocument
};
