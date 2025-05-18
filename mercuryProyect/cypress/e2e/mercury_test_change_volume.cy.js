import { OpenMercury } from './mercury/actions/OpenMercury';
import { ChangeVolume } from './mercury/actions/ChangeVolume';
import { CurrentVolume } from './mercury/questions/CurrentVolume';
import { ClickRecommendedSong } from './mercury/actions/ClickRecommendedSong';

describe('Cambiar el volumen de la canción', () => {
    it('El volumen debería actualizarse al mover el slider', () => {
      OpenMercury();
  
      cy.wait(1000);
  
      ClickRecommendedSong(); 
  
      CurrentVolume().should('exist');
  
      CurrentVolume()
        .invoke('val')
        .then((initialVolume) => {
          ChangeVolume(0);
  
          CurrentVolume()
            .invoke('val')
            .should((newVolume) => {
              expect(newVolume).to.not.eq(initialVolume);
              expect(newVolume).to.eq('0');
            });
        });
    });
  });
