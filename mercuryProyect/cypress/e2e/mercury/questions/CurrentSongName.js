export const CurrentSongName = () => {
    return cy.get('div.text-black.text-center.mt-2 p').first();
  };
  