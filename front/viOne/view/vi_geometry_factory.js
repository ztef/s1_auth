import * as THREE from 'three';
import { vi_visualObject } from './vi_visual_object.js';


export class vi_geometry_factory {
    

    createGeometry(geometryType, data) {
        switch (geometryType) {
          case 'Circle':
  
             
              return new THREE.CircleGeometry(data[0], data[1]);

            break;

            case 'Plane':
  
             
              return new THREE.PlaneGeometry(data[0], data[1], data[2], data[3] );

            break;


          


           case 'Sphere':
            
                return  new THREE.SphereGeometry(data[0], data[1], data[2]);
            break;

          case 'Cube':

                return new THREE.BoxGeometry(data[0], data[1], data[2]);

            break;
  
          default:
            throw new Error(`Unsupported geometry type: ${geometryType}`);
        }
      }


      createObject(geometry, pos , color) {

        const position = new THREE.Vector3(pos.x, pos.y, pos.z);
        
        const material = new THREE.MeshBasicMaterial({ color });
        
        const mesh = new THREE.Mesh(geometry, material);
       
        mesh.position.copy(position);
      
        return mesh;
    }

        createVisualObject(mesh, id){

            return new vi_visualObject(mesh,id);
        }

 
}