import { CurrentSongName } from "./mercury/questions/CurrentSongName";
import { OpenMercury } from "./mercury/actions/OpenMercury";
import { ClickRecommendedSong } from "./mercury/actions/ClickRecommendedSong";

describe('Verificar que cambia el nombre de la canción actual después de dar click' , () => {
    it('Debería cambiar el nombre de la canción actual al hacer click en una nueva canción', () => {
        OpenMercury();
        cy.wait(1000);

        let initialSongName;
    CurrentSongName().then((songName) => {
        console.log("song_name ", songName)
      initialSongName = songName.text(); // Obtener el texto del nombre actual

      // Hacer clic en una canción recomendada
      ClickRecommendedSong();

      // Verificar que el nombre de la canción haya cambiado
      CurrentSongName().should('not.have.text', initialSongName); // Verifica que el nombre ha cambiado
    });

    })
})