export const CheckSongImages = () => {
    // Verificar imagen de la canción izquierda
    cy.get('[data-cy="previous-button"] img').then(($img) => {
      if (!$img.attr('src') || $img.attr('src').includes('logo2.png')) {
        cy.get('[data-cy="previous-button"] img').should('have.attr', 'src', './../../../../assets/songs/logo2.png');
      } else {
        cy.wrap($img).should('be.visible');
      }
    });
  
    // Verificar imagen de la canción actual
    cy.get('[data-cy="current-button"] img').then(($img) => {
      if (!$img.attr('src') || $img.attr('src').includes('logo2.png')) {
        cy.get('[data-cy="current-button"] img').should('have.attr', 'src', './../../../../assets/songs/logo2.png');
      } else {
        cy.wrap($img).should('be.visible');
      }
    });
  
    // Verificar imagen de la canción derecha
    cy.get('[data-cy="next-button"] img').then(($img) => {
      if (!$img.attr('src') || $img.attr('src').includes('logo2.png')) {
        cy.get('[data-cy="next-button"] img').should('have.attr', 'src', './../../../../assets/songs/logo2.png');
      } else {
        cy.wrap($img).should('be.visible');
      }
    });
  };
  