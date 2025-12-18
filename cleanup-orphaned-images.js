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
  console.log('🔍 מחפש קבצים יתומים...\n')

  try {
    // 1. טען את רשימת התמונות מ-Firestore
    const galleryDoc = await getDoc(doc(db, 'settings', 'gallery'))
    const galleryData = galleryDoc.data()
    const registeredImages = galleryData?.images || []
    
    console.log(`📋 נמצאו ${registeredImages.length} תמונות רשומות ב-Firestore`)
    
    // 2. צור סט של כל ה-paths הרשומים
    const registeredPaths = new Set()
    registeredImages.forEach(image => {
      if (image.storagePaths) {
        // תמונות חדשות עם 3 גרסאות
        Object.values(image.storagePaths).forEach(path => {
          registeredPaths.add(path)
        })
      } else if (image.storagePath) {
        // תמונות ישנות
        registeredPaths.add(image.storagePath)
      }
    })
    
    console.log(`📝 סה"כ ${registeredPaths.size} קבצים רשומים\n`)
    
    // 3. רשום את כל הקבצים ב-Storage
    const galleryRef = ref(storage, 'gallery')
    const filesList = await listAll(galleryRef)
    
    console.log(`📦 נמצאו ${filesList.items.length} קבצים ב-Storage\n`)
    
    // 4. מצא קבצים יתומים
    const orphanedFiles = []
    filesList.items.forEach(fileRef => {
      if (!registeredPaths.has(fileRef.fullPath)) {
        orphanedFiles.push(fileRef)
      }
    })
    
    if (orphanedFiles.length === 0) {
      console.log('✅ לא נמצאו קבצים יתומים! הכל נקי.')
      return
    }
    
    console.log(`⚠️  נמצאו ${orphanedFiles.length} קבצים יתומים:\n`)
    orphanedFiles.forEach((fileRef, i) => {
      console.log(`   ${i + 1}. ${fileRef.name}`)
    })
    
    // 5. שאל אישור למחיקה
    console.log('\n❓ האם למחוק את הקבצים האלה? (y/n)')
    
    // בסביבת Node.js עם readline
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    readline.question('', async (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.log('\n🗑️  מוחק קבצים יתומים...\n')
        
        let deleted = 0
        for (const fileRef of orphanedFiles) {
          try {
            await deleteObject(fileRef)
            console.log(`   ✅ נמחק: ${fileRef.name}`)
            deleted++
          } catch (error) {
            console.error(`   ❌ שגיאה במחיקת ${fileRef.name}:`, error.message)
          }
        }
        
        console.log(`\n✅ נמחקו ${deleted} מתוך ${orphanedFiles.length} קבצים`)
        
        // חישוב חיסכון במקום
        const avgFileSize = 200 // KB (ממוצע של 3 גרסאות)
        const savedSpace = (deleted * avgFileSize / 1024).toFixed(2)
        console.log(`💾 חיסכון במקום: ~${savedSpace}MB`)
      } else {
        console.log('\n❌ המחיקה בוטלה')
      }
      
      readline.close()
    })
    
  } catch (error) {
    console.error('❌ שגיאה:', error)
  }
}

// הרץ את הסקריפט
cleanupOrphanedImages()
