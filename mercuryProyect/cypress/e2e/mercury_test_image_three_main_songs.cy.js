import { OpenMercury } from "./mercury/actions/OpenMercury";
import { CheckSongImages } from "./mercury/actions/CheckSongImages";
import { ClickRecommendedSong } from "./mercury/actions/ClickRecommendedSong";

describe('Verificar que si no hay imagen, aparece una por defecto', () => {
  it('Debería mostrar la imagen por defecto si no hay imagen de la canción en la izquierda, actual y derecha', () => {
    OpenMercury();
    cy.wait(1000);

    // Hacer clic en una canción recomendada que puede no tener imagen
    ClickRecommendedSong();

    // Verificar las imágenes de las tres canciones
    CheckSongImages();
  });
});
