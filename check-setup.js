#!/usr/bin/env node

/**
 * Script to check if the Firebase Admin setup is correct
 * Run with: node check-setup.js
 */

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

console.log('🔍 Checking Firebase Admin Setup...\n')

let hasErrors = false

// Check 1: netlify/functions/package.json
console.log('1️⃣ Checking netlify/functions/package.json...')
const functionsPackageJsonPath = join(__dirname, 'netlify', 'functions', 'package.json')
if (!existsSync(functionsPackageJsonPath)) {
  console.log('   ❌ netlify/functions/package.json not found!')
  hasErrors = true
} else {
  const packageJson = JSON.parse(readFileSync(functionsPackageJsonPath, 'utf8'))
  if (packageJson.dependencies && packageJson.dependencies['firebase-admin']) {
    console.log('   ✅ firebase-admin is in dependencies')
  } else {
    console.log('   ❌ firebase-admin is NOT in dependencies!')
    console.log('   Run: cd netlify/functions && npm install firebase-admin')
    hasErrors = true
  }
}

// Check 2: netlify/functions/package-lock.json
console.log('\n2️⃣ Checking if dependencies are installed...')
const packageLockPath = join(__dirname, 'netlify', 'functions', 'package-lock.json')
if (!existsSync(packageLockPath)) {
  console.log('   ❌ package-lock.json not found!')
  console.log('   Run: cd netlify/functions && npm install')
  hasErrors = true
} else {
  console.log('   ✅ package-lock.json exists')
}

// Check 3: Required function files
console.log('\n3️⃣ Checking required function files...')
const requiredFiles = [
  'netlify/functions/firebase-admin.js',
  'netlify/functions/firebase-prayer-times.js',
  'netlify/functions/firebase-gallery.js',
  'netlify/functions/firebase-announcements.js',
  'netlify/functions/firebase-events.js'
]

requiredFiles.forEach(file => {
  const filePath = join(__dirname, file)
  if (existsSync(filePath)) {
    console.log(`   ✅ ${file}`)
  } else {
    console.log(`   ❌ ${file} not found!`)
    hasErrors = true
  }
})

// Check 4: Admin components
console.log('\n4️⃣ Checking admin components...')
const adminFiles = [
  'src/admin/AdminPrayerTimes.jsx',
  'src/admin/AdminGallery.jsx',
  'src/admin/AdminAnnouncements.jsx',
  'src/admin/AdminEvents.jsx'
]

adminFiles.forEach(file => {
  const filePath = join(__dirname, file)
  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf8')
    if (content.includes('from \'../utils/api\'')) {
      console.log(`   ✅ ${file} uses API utils`)
    } else {
      console.log(`   ❌ ${file} doesn't use API utils!`)
      hasErrors = true
    }
  } else {
    console.log(`   ❌ ${file} not found!`)
    hasErrors = true
  }
})

// Check 5: API utils
console.log('\n5️⃣ Checking API utilities...')
const apiUtilsPath = join(__dirname, 'src', 'utils', 'api.js')
if (existsSync(apiUtilsPath)) {
  console.log('   ✅ src/utils/api.js exists')
} else {
  console.log('   ❌ src/utils/api.js not found!')
  hasErrors = true
}

// Check 6: Firebase rules file
console.log('\n6️⃣ Checking Firebase rules...')
const rulesPath = join(__dirname, 'firestore.rules')
if (existsSync(rulesPath)) {
  const rules = readFileSync(rulesPath, 'utf8')
  if (rules.includes('allow write: if false')) {
    console.log('   ✅ firestore.rules has write protection')
  } else {
    console.log('   ⚠️  firestore.rules might not have write protection')
  }
} else {
  console.log('   ❌ firestore.rules not found!')
  hasErrors = true
}

// Check 7: Documentation
console.log('\n7️⃣ Checking documentation...')
const docs = [
  'FIREBASE_ADMIN_SETUP.md',
  'SECURITY_MIGRATION_SUMMARY.md',
  'DEBUG_STEPS.md',
  'TROUBLESHOOTING_CHECKLIST.md'
]

docs.forEach(doc => {
  if (existsSync(join(__dirname, doc))) {
    console.log(`   ✅ ${doc}`)
  } else {
    console.log(`   ⚠️  ${doc} not found`)
  }
})

// Summary
console.log('\n' + '='.repeat(50))
if (hasErrors) {
  console.log('❌ Setup has errors! Please fix the issues above.')
  console.log('\nNext steps:')
  console.log('1. Fix the errors listed above')
  console.log('2. Run: cd netlify/functions && npm install')
  console.log('3. Commit and push your changes')
  console.log('4. Set environment variables in Netlify Dashboard')
  console.log('5. Deploy to Netlify')
  process.exit(1)
} else {
  console.log('✅ Local setup looks good!')
  console.log('\nNext steps:')
  console.log('1. Make sure you ran: cd netlify/functions && npm install')
  console.log('2. Commit and push all changes')
  console.log('3. Set these environment variables in Netlify Dashboard:')
  console.log('   - FIREBASE_PROJECT_ID')
  console.log('   - FIREBASE_PRIVATE_KEY_ID')
  console.log('   - FIREBASE_PRIVATE_KEY (with \\n as text)')
  console.log('   - FIREBASE_CLIENT_EMAIL')
  console.log('   - FIREBASE_CLIENT_ID')
  console.log('4. Update Firebase Rules (copy from firestore.rules)')
  console.log('5. Deploy to Netlify')
  console.log('\nRead FIREBASE_ADMIN_SETUP.md for detailed instructions!')
  process.exit(0)
}
