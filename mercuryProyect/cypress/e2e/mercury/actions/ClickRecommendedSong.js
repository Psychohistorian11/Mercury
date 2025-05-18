export const ClickRecommendedSong = () => {
    return cy.get('div.cursor-pointer') 
             .eq(1) 
             .click();
  };
  