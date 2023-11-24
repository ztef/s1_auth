/*

  VISUAL INTERACTION SYSTEMS

  Implementacion de un Controlador Universal Observable


*/

import vi_ActionObserver from './vi_action_observer.js';


class vi_Controller {
    constructor() {

      this.actionObserver = new vi_ActionObserver();
      
     
    }


    /*
        Agrega a un Observador (una Funcion) para una accion determinada
    */

    addObserver(actionName, observerFunction) {
        this.actionObserver.addObserver(actionName, observerFunction);
    }
    

    triggerObjectSelected(data) {
        this.actionObserver.notify('objectSelected', data);
    }

    triggerObjectPicked(data) {
      this.actionObserver.notify('objectPicked', data);
    }


    triggerObjectAdded(data) {
      
      this.actionObserver.notify('objectAdded', data);
    }

    triggerObjectUpdated(data) {
      
      this.actionObserver.notify('objectUpdated', data);
    }

    triggerObjectDeleted(data) {
      this.actionObserver.notify('objectDeleted', data);
    }


  
   
  
}
  
  export default vi_Controller;
  