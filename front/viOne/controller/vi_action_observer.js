/*

  VISUAL INTERACTION SYSTEMS

  ActionObserver implementa un patron Observador

    Permite agregar observadores a una lista y notifcarle a cada uno de ellos
    mediante el metodo notify

    observers es una lista de listas, agrupadas por accion


    nota : los observadores son Funciones

*/

class vi_ActionObserver {
    constructor() {
      this.observers = {};
    }
  
    /*
    
    Registra a un observador para una accion especifica

    */


    addObserver(actionName, observerFunction) {
      if (!this.observers[actionName]) {
        this.observers[actionName] = [];
      }
      this.observers[actionName].push(observerFunction);
    }
  
    /*
   
     Notifica a los observadores de una accion 
   
    */

     notify(actionName, payload) {
      const observers = this.observers[actionName];
      if (observers) {
        observers.forEach((observer) => {
          observer(actionName,payload);
        });
      }
    }
  }

  export default vi_ActionObserver;
  
  
 