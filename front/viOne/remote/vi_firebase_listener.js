// firebaseListener.js



import vi_RemoteListener from "./vi_remote_listener.js"

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getFirestore, collection, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";




class vi_FirebaseListener extends vi_RemoteListener {
  constructor(dataSource, mobileObjectModel) {

    super();
    this.dataSource = dataSource;
    this.collection = dataSource.config.collection;

    this.objectModel = mobileObjectModel;


    const app = initializeApp(this.dataSource.config.credentials);
    const analytics = getAnalytics(app);
    this.db = getFirestore(app);

    this.start();
  }


  start() {
    
    console.log("Iniciando Firebase ")

   
    this.myCollection = collection(this.db, this.collection);

    onSnapshot(this.myCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const docData = change.doc.data();
        const docId = change.doc.id;
        const collection = this.collection;

        if (change.type === "added" && docData.status === "active") {
          console.log("New Document Added:", docId, docData);
          this.objectModel.updateOrAddObject(docId, collection, docData);
        }

        if (change.type === "modified") {
          console.log("Document Modified:", docId, docData);
          if (docData.status === "active") {
            this.objectModel.updateOrAddObject(docId, collection, docData);
          } else {
            console.log("Document Removed", docId);
            this.objectModel.deleteObject(docId);
          }
        }

        if (change.type === "removed") {
          console.log("Document Removed", docId);
          this.objectModel.deleteObject(docId);
        }
      });
    });
  }


  async getDocument(collectionName, documentId) {
    try {
      // Reference to the document
      const docRef = doc(this.db, collectionName, documentId);

      // Get the document data
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // Document exists, you can access its data
        const documentData = docSnapshot.data();
        return documentData;
      } else {
        // Document doesn't exist
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      throw error;
    }
  }

  
}

export default vi_FirebaseListener;
