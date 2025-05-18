import { OpenMercury } from './mercury/actions/OpenMercury';
import { ClickRecommendedSong } from './mercury/actions/ClickRecommendedSong';
import { IsSongPlaying } from './mercury/questions/IsSongPlaying';

describe('Mercury - Reproducir canción recomendada', () => {
  it('El usuario debería poder reproducir una canción recomendada', () => {
    OpenMercury();
    ClickRecommendedSong();
    IsSongPlaying();
  });
});
