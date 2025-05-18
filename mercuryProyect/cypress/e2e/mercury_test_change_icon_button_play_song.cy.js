import { OpenMercury } from './mercury/actions/OpenMercury';
import { ClickRecommendedSong } from './mercury/actions/ClickRecommendedSong';
import { ClickPlayPauseButton } from './mercury/actions/ClickPlayPauseButton';
import { IsPlayingButton } from './mercury/questions/IsPlayingButton';

describe('Pausar y Reproducir la Canción', () => {
    it('Debería pausar y reproducir la canción al hacer click', () => {
      OpenMercury();
      cy.wait(1000);
      ClickRecommendedSong();
  
      IsPlayingButton(true); 
  
      ClickPlayPauseButton();
  
      IsPlayingButton(false); 
  
      ClickPlayPauseButton();
  
      IsPlayingButton(true); 
    });
  });
  
