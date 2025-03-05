// intro Google Earth Engine: 
// Se dibuja un polígono que encierra la ciudad de bogotá, este se convierte en una geometría que se utiliza luego para realizar un recorte sobre la imagen utilizada.

print("Hola GEE")
var plazaBolivar = ee.Geometry.Point([-74.0760, 4.598]);

Map.addLayer(plazaBolivar,{
  color: "blue"
}, "Plaza de Bolívar")

// tomar imágenes de landsat
var myImage = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
// filtrar la colección de imágenes
.filterDate('2024-01-01','2025-01-01') //fecha inicial y fecha final de la colección
.filterBounds(geometry) // devuelve solo las imágenes que intersecten con la plaza de bolívar.
.sort("CLOUD_COVER") // organizar las imágenes por covertura de nubes, de menor a mayor
.first();

// Recortar la imagen al polígono de interés
var clippedImage = myImage.clip(geometry);

print("Descripción de mi imagen", clippedImage);

var params = {
  bands: ["SR_B4", "SR_B5", "SR_B6"],
  gamma: 1.4,
  min: 0,
  max: 30000
}



//Map.addLayer(clippedImage, params, "Imagen en color natural")
//Map.centerObject(plazaBolivar, 14)



// Calcular NDVI
var ndvi = clippedImage.normalizedDifference(["SR_B5", "SR_B4"]).rename("NDVI");

// Visualización del NDVI
var ndviParams = {
  min: -1,
  max: 1,
  palette: ["blue", "white", "green"]
};

// Agregar capa de NDVI al mapa
Map.addLayer(ndvi, ndviParams, "NDVI");




// Calcular NDWI
var ndvi = clippedImage.normalizedDifference(["SR_B5", "SR_B4"]).rename("NDVI");

// Visualización del NDWI
var ndviParams = {
  min: -1,
  max: 1,
  palette: ["blue", "white", "green"]
};

// Agregar capa de NDVI al mapa
//Map.addLayer(ndvi, ndviParams, "NDVI");






// Calcular NDWI
var ndwi = myImage.normalizedDifference(["SR_B3", "SR_B5"]).rename("NDWI");

// Recortar al área de interés
var ndwiClipped = ndwi.clip(geometry);

// Parámetros de visualización
var ndwiParams = {
  min: -1,
  max: 1,
  palette: ["brown", "white", "blue"]
};

// Agregar NDWI al mapa
Map.addLayer(ndwiClipped, ndwiParams, "NDWI");



// Definir el factor de ajuste del suelo (L)
var L = 1; // área con poca vegetación

// Calcular SAVI manualmente usando la expresión matemática
var savi = myImage.expression(
  "((NIR - RED) / (NIR + RED + L)) * (1 + L)", {
    "NIR": myImage.select("SR_B5"),
    "RED": myImage.select("SR_B4"),
    "L": L
  }
).rename("SAVI");

// Recortar al área de interés
var saviClipped = savi.clip(geometry);

// Parámetros de visualización
var saviParams = {
  min: -1,
  max: 1,
  palette: ["brown", "yellow", "green"]
};

// Agregar SAVI al mapa
Map.addLayer(saviClipped, saviParams, "SAVI");
