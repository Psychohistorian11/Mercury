import { OpenMercury } from "./mercury/actions/OpenMercury";
import { CurrentSongName } from "./mercury/questions/CurrentSongName";
import { ClickNextButton } from "./mercury/actions/ClickNextButton";

describe('Probar click en "siguiente" para avanzar a otra canción', () => {
  it('Debería cambiar la canción actual al hacer click en siguiente', () => {
    OpenMercury();
    cy.wait(1000);

    let initialSongName;
    CurrentSongName().then((songName) => {
      initialSongName = songName.text();

      // Hacer clic en el botón de siguiente
      ClickNextButton();

      // Verificar que el nombre de la canción haya cambiado
      CurrentSongName().should('not.have.text', initialSongName);
    });
  });
});
