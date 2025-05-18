export const IsSongPlaying = () => {
    return cy.window().then((win) => {
      const isPlaying = !win.document.querySelector('audio')?.paused;
      expect(isPlaying).to.be.true;
    });
  };
  