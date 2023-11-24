

import vi_RemoteListener from "./vi_remote_listener.js"





class vi_GoogleSheetListener extends vi_RemoteListener {
  constructor(dataSource, mobileObjectModel) {

    super();
    this.dataSource = dataSource;
    this.collection = dataSource.config.collection;
    this.objectModel = mobileObjectModel;

    this.loadData();
   
  }


  async loadData() {
    try {
      console.log("Fetch de datos de google");
      // Make an HTTP GET request to your Node.js route
      const response = await fetch('/sheets/getFromSheet?sheet='+this.dataSource.config.SPREADSHEET_ID);
  
      if (response.ok) {
        // Parse the response as JSON
        const data = await response.json();
  
        // Process the data from the Google Spreadsheet
        console.log("DATOS DE LA HOJA DE CALCULO");
        console.log(data);
  
        // TEMPORAL , Esto es dependiente de la aplicacion
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const element = data[key];
            
            const record = {
                id:element.id,
                type: element.type,
                positionCurrent:{
                    _lat: element._lat,
                    _long: element._long
                },
                destination:element.destination,
                tripState:element.tripstate,
                unit:element.unit
            };
            console.log(element);
            this.objectModel.updateOrAddObject(record.id,  this.collection, record);
          }
        }
  
        // You can update your mobileObjectModel with the data here
      } else {
        console.error('Failed to fetch data:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  

  
}

export default vi_GoogleSheetListener;


