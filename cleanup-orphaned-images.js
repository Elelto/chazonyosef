/**
 * סקריפט לניקוי קבצי תמונות יתומים ב-Firebase Storage
 * 
 * קובץ זה מוחק תמונות שנמצאות ב-Storage אבל לא רשומות ב-Firestore.
 * זה קורה כשמעלים תמונה אבל שוכחים לשמור.
 * 
 * הרצה:
 * node cleanup-orphaned-images.js
 */

import { initializeApp } from 'firebase/app'
import { getStorage, ref, listAll, deleteObject } from 'firebase/storage'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

// Firebase configuration (מ-src/firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyCahm3Mr6eM4j0XACPDexiHCI7fq0wlI_E",
  authDomain: "chazon-e3dc4.firebaseapp.com",
  projectId: "chazon-e3dc4",
  storageBucket: "chazon-e3dc4.firebasestorage.app",
  messagingSenderId: "553870721683",
  appId: "1:553870721683:web:e24bc7d0a90e8752df0366"
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const db = getFirestore(app)

async function cleanupOrphanedImages() {
  console.log('🔍 Searching for orphaned files...\n')

  try {
    // 1. Load images list from Firestore
    const galleryDoc = await getDoc(doc(db, 'settings', 'gallery'))
    const galleryData = galleryDoc.data()
    const registeredImages = galleryData?.images || []
    
    console.log(`📋 Found ${registeredImages.length} registered images in Firestore`)
    
    // 2. Create set of all registered paths
    const registeredPaths = new Set()
    registeredImages.forEach(image => {
      if (image.storagePaths) {
        // New images with 3 versions
        Object.values(image.storagePaths).forEach(path => {
          registeredPaths.add(path)
        })
      } else if (image.storagePath) {
        // Old images
        registeredPaths.add(image.storagePath)
      }
    })
    
    console.log(`📝 Total ${registeredPaths.size} registered files\n`)
    
    // 3. List all files in Storage
    const galleryRef = ref(storage, 'gallery')
    const filesList = await listAll(galleryRef)
    
    console.log(`📦 Found ${filesList.items.length} files in Storage\n`)
    
    // 4. Find orphaned files
    const orphanedFiles = []
    filesList.items.forEach(fileRef => {
      if (!registeredPaths.has(fileRef.fullPath)) {
        orphanedFiles.push(fileRef)
      }
    })
    
    if (orphanedFiles.length === 0) {
      console.log('✅ No orphaned files found! Everything is clean.')
      return
    }
    
    console.log(`⚠️  Found ${orphanedFiles.length} orphaned files:\n`)
    orphanedFiles.forEach((fileRef, i) => {
      console.log(`   ${i + 1}. ${fileRef.name}`)
    })
    
    // 5. Ask for confirmation
    console.log('\n❓ Delete these files? (y/n)')
    
    // בסביבת Node.js עם readline (ES modules)
    const readline = await import('readline')
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    const answer = await new Promise(resolve => {
      rl.question('', resolve)
    })
    
    rl.close()
    
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log('\n🗑️  Deleting orphaned files...\n')
      
      let deleted = 0
      for (const fileRef of orphanedFiles) {
        try {
          await deleteObject(fileRef)
          console.log(`   ✅ Deleted: ${fileRef.name}`)
          deleted++
        } catch (error) {
          console.error(`   ❌ Error deleting ${fileRef.name}:`, error.message)
        }
      }
      
      console.log(`\n✅ Deleted ${deleted} out of ${orphanedFiles.length} files`)
      
      // Calculate space saved
      const avgFileSize = 200 // KB (average of 3 versions)
      const savedSpace = (deleted * avgFileSize / 1024).toFixed(2)
      console.log(`💾 Space saved: ~${savedSpace}MB`)
    } else {
      console.log('\n❌ Deletion cancelled')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// הרץ את הסקריפט
cleanupOrphanedImages()
