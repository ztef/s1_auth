class vi_Map {

  constructor(controller) {
    // ...

  
    this.controller = controller;
    this.controller.addObserver('objectSelected', this.handleObjectSelectedOutside.bind(this));
    this.controller.addObserver('objectAdded', this.addObject.bind(this));
    this.controller.addObserver('objectUpdated', this.updateObject.bind(this));
    this.controller.addObserver('objectDeleted', this.removeObject.bind(this));


      this.viewer = null;
      this.objectEntity = null;
      this.tooltipElement = null;
  
      this.currentLatitude = 25.6520;
      this.currentLongitude = -100.3152;

      this.objectEntities = [];
      
    
      
    }


    initialize() {
      // Initialize the map
    }
  }

  export default vi_Map;