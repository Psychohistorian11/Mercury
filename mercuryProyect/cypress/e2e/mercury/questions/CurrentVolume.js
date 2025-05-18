export const CurrentVolume = () => {
  return cy.get('input[type="range"]').eq(1); 
};
