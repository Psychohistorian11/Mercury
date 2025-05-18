import { OpenMercury } from "./mercury/actions/OpenMercury";
import { CurrentSongName } from "./mercury/questions/CurrentSongName";
import { ClickPreviousButton } from "./mercury/actions/ClickPreviousButton";

describe('Probar click en "anterior" para avanzar a otra canción', () => {
  it('Debería cambiar la canción actual al hacer click en anterior', () => {
    OpenMercury();
    cy.wait(1000);

    let initialSongName;
    CurrentSongName().then((songName) => {
      initialSongName = songName.text();

      // Hacer clic en el botón de siguiente
      ClickPreviousButton();

      // Verificar que el nombre de la canción haya cambiado
      CurrentSongName().should('not.have.text', initialSongName);
    });
  });
});
