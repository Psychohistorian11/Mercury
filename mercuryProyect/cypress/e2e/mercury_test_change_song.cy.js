import { OpenMercury } from './mercury/actions/OpenMercury';
import { ClickRecommendedSong } from './mercury/actions/ClickRecommendedSong';
import { CurrentSongName } from './mercury/questions/CurrentSongName';

describe('Cambiar de canción al hacer click', () => {
  it('El nombre de la canción debería cambiar', () => {
    OpenMercury();

    cy.wait(1000); // Espera opcional por carga

    CurrentSongName()
      .invoke('text')
      .then((initialSongName) => {
        ClickRecommendedSong(); 

        cy.wait(1000); 

        CurrentSongName()
          .invoke('text')
          .should((newSongName) => {
            expect(newSongName.trim()).to.not.eq(initialSongName.trim());
          });
      });
  });
});
