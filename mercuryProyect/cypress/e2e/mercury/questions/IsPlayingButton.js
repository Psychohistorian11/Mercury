export const IsPlayingButton = (isPlaying) => {
  const expectedIcon = isPlaying ? '[data-cy="pause-icon"]' : '[data-cy="play-icon"]';
  return cy.get(expectedIcon, { timeout: 5000 }).should('exist');
};
