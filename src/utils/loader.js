// function obj2_model_load(model){
//     var loader = new THREE.OBJLoader2(manager); 
//     loader.load('assets/'+model+'.obj', function ( data ) {
//             if(object != null){
//             scene.remove(object);
//             }
//             object = null;
//             object = data.detail.loaderRootNode	;
//             console.log(object);
//             materials =[];
//             object.traverse( function ( node ) {
//                 if ( node.isMesh ) {
//                     node.material = textureMaterial
//                     node.geometry.uvsNeedUpdate = true;	
//                     //object = node;
//                 }
//             }); 
//             var scale = height/3;
//             object.scale.set(scale, scale, scale);
//             object.position.set(0,-scale*1.5, 0);
//             object.rotation.set(0, Math.PI / 2, 0);
//             object.receiveShadow = true;
//             object.castShadow = true;
//             scene.add(object);
//      });
//     }