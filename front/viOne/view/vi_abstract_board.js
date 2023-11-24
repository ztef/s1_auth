export class vi_abstractBoard {

    constructor(name){
       
        this.name = name;

        this.dimensions = [];
    }


    addDimension(dim){
       this.dimensions.push(dim);
    }


}