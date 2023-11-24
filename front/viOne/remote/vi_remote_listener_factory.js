/*

  VISUAL INTERACTION SYSTEMS

  Fabrica de Listeners Remotos


  Opciones :

      - FIREBASE
      - GOOGLE SPREADSHEET
      - MQTT
      - RABBT QTT
      - Sockets


*/

import vi_FirebaseListener from "./vi_firebase_listener.js";
import vi_GoogleSheetListener from "./vi_google_sheet_listener.js";


class vi_RemoteListenerFactory {
    createRemoteListener(dataSource, model) {
      switch (dataSource.sourceType) {
        case 'Firebase':

           
          return new vi_FirebaseListener(dataSource, model);
          break;

        case 'GoogleSheet':  

          return new vi_GoogleSheetListener(dataSource, model);
          break;

        default:
          throw new Error(`Unsupported data source type: ${type}`);
      }
    }
  }

  export default vi_RemoteListenerFactory;