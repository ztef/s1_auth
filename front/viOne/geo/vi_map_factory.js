/*

  VISUAL INTERACTION SYSTEMS

  MAP FACTORY : Implementa una Fabrica de Mapas


        Cesium
        Google
        Bing
        Here
        

*/

import vi_CesiumMap from "./vi_cesium_map.js"

class vi_MapFactory {

  createMap(type, controller) {
      switch (type) {
        case 'Cesium':
          return new vi_CesiumMap(controller);
        
        default:
          throw new Error(`Unsupported map type: ${type}`);
      }
    }
  }

  export default vi_MapFactory;
