Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZjgxNGNjNi0yYTkwLTRjZjktYjVkMi0xYzMxY2Q1MWZkMGIiLCJpZCI6MjQ1NjgwLCJpYXQiOjE3Mjc5NDkxOTd9.mCWBXudlQVd4jw-M1fkODGWVJ_YHUzpv_IhxEtwzFgw";

//cesium viewer use live server to view
const viewer = new Cesium.Viewer('cesiumContainer', {
  scene3DOnly: true,
  baseLayerPicker: false,
  infoBox: false,
  homeButton: false,
  timeline: true,
  animation: true,
});

//for buildings

let geoJsonDataSource;
let buildingEntities = [];

//load the model into cesium

async function loadModel() {
  try {
      const resource = await Cesium.IonResource.fromAssetId(2777699);
      viewer.entities.add({
          model: { uri: resource },
      });

      const dataSource = await Cesium.GeoJsonDataSource.load(resource, { clampToGround: false });
      geoJsonDataSource = dataSource;
      viewer.dataSources.add(dataSource);

      dataSource.entities.values.forEach(entity => {
          if (entity.polygon) {
              const height = entity.properties.height?.getValue() || 0;
              const buildingId = entity.properties.building_id?.getValue() || null;
              const additionalHeight = (buildingId === 42) ? 50 : 2.5;
              const engheight = (buildingId === 9) ? 30 : 2.5;

              Object.assign(entity.polygon, {
                  extrudedHeight: height + additionalHeight + engheight,
                  height: 0,
                  material: Cesium.Color.GRAY,
                  outline: true,
                  outlineColor: Cesium.Color.BLACK
              });

              if (Cesium.defined(entity.properties.name)) {
                  buildingEntities.push({
                      name: entity.properties.name.getValue(),
                      entity: entity
                  });
              }
          }
      });

      viewer.flyTo(dataSource);
  } catch (error) {
      console.error('Error loading asset:', error);
  }
}
//function
loadModel();


