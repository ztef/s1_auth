/*

  VISUAL INTERACTION SYSTEMS

  View Generica (GRID) para el manejo de Objetos registrados en el Modelo


*/

class vi_ObjectGridView {
  
  constructor(divID, controller, headerFunction, cellFunction ) {
    // ...

    this.controller = controller;
    this.headerFunction = headerFunction;
    this.cellFunction = cellFunction;

    this.controller.addObserver('objectSelected', this.handleObjectSelected.bind(this));
    this.controller.addObserver('objectAdded', this.addObject.bind(this));
    this.controller.addObserver('objectUpdated', this.updateObject.bind(this));
    this.controller.addObserver('objectDeleted', this.removeObject.bind(this));

      this.modelView = document.getElementById(divID);

      this.content = document.createElement("div");
      this.content.className = 'content';
      this.content.style.overflow = 'auto';
      this.content.style.height = '90%';

     


      this.table = document.createElement("table");
      this.table.style.borderCollapse = "collapse";


      const header = document.createElement("tr");
      header.innerHTML = this.headerFunction();
  
      this.table.appendChild(header);
      


      this.content.appendChild(this.table);


      this.modelView.appendChild(this.content);

      //this.table.addEventListener("click", this.handleTableClick.bind(this));

    }


   

  

    /*
    
      Manejo de click en un objeto  (Notifica al controlador) 
    
    */

    handleRowClick(mobileId) {
  
      this.controller.triggerObjectSelected({ id: mobileId });
  
    }


    /*

      Maneja notificacion de que un objeto ha sido seleccionado en otra vista

    */

    handleObjectSelected(event, payload) {


     
      // Check if the payload matches a mobile in the grid
      // If it does, mark it as selected in this view
      const { id } = payload;
      // Example: Find the row with the matching ID and apply a CSS class for selection
      const row = this.table.querySelector(`tr[data-id="${id}"]`);
      if (row) {
        row.classList.add("selected");
      }
    }
  


    createObjectHtml(id, collection, data) { 


      return this.cellFunction(id, collection, data);
      
      
    }
   
    addObject(event, newObject) {

      console.log("GRID : NUEVO SI LLEGA",newObject);

      let id = newObject.id;
      let data = newObject.data;
      let collection = newObject.collection;

     
      const row = document.createElement("tr");
      row.setAttribute("data-id", id);
      row.classList.add("clickable"); 

      row.addEventListener("click", () => {
        this.handleRowClick(id);
      });
  
     
  
      // Generate cell content using createMobileHtml
      row.innerHTML = this.createObjectHtml(id, collection, data);
  
      //row.appendChild(cell);
      this.table.appendChild(row);
    }
  
    updateObject(event, object) {

      console.log("GRID : SI LLEGA", object);

      let id = object.id;
      let collection = object.collection;
      let updatedData = object.data;


      // Find the row corresponding to the updated data
      const rows = this.table.getElementsByTagName("tr");
      for (const row of rows) {
        const rowDataId = row.getAttribute("data-id");
        if (rowDataId === id) {
          // Generate updated cell content using createMobileHtml
          const cell = row.querySelector("td");
          row.innerHTML = this.createObjectHtml(id, collection, updatedData);
          break;
        }
      }
    }
  
    removeObject(event, id) {
      // Find the row corresponding to the provided ID
      const rows = this.table.getElementsByTagName("tr");
      for (const row of rows) {
        const rowDataId = row.getAttribute("data-id");
        if (rowDataId === id) {
          // Remove the row from the table
          this.table.removeChild(row);
          break;
        }
      }
    }
  }
  
  export default vi_ObjectGridView;
  