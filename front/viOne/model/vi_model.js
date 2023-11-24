/*

  VISUAL INTERACTION SYSTEMS

  Modelo generico de objetos en Memoria


*/


class vi_ObjectModel  {

    constructor(controller) {
      

      this.controller = controller;
  
     
      this.objects = [];
    }
  
    /*
    
    Update or add an object

    */

    updateOrAddObject(id, collection, data) {

      const existingObject = this.objects.find((object) => object.id === id);

      if (existingObject) {
        
        existingObject.data = data;
        existingObject.collection = collection;
         
        this.controller.triggerObjectUpdated(existingObject);
         
        return existingObject;
      } else {
        
        const newObject = {
          id,
          collection: collection,
          data,
           
        };
        this.objects.push(newObject);
        this.controller.triggerObjectAdded(newObject);

        return newObject;
      }
    }
  
    /*
    
    Read an  object by ID
  
    */

    readObject(id) {
      return this.objects.find((object) => object.id === id);
    }
  
    /* 
    
      Delete a mobile object by ID
    
    */
    
      deleteObject(id) {

      const index = this.objects.findIndex((object) => object.id === id);
      if (index !== -1) {
        this.objects.splice(index, 1);
        
        this.controller.triggerObjectDeleted(id);
        return true; // Object deleted successfully
      }
      return false; // Object not found
    }
  
    /* 
    
    Get all objects

    */

    getAllObjects() {
      return this.objects;
    }
  }
  
  export { vi_ObjectModel as vi_ObjectModel };
  