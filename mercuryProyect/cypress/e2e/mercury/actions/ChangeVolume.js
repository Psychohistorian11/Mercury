export const ChangeVolume = (volume) => {
  cy.get('input[type="range"]')
    .eq(1)
    .then($input => {
      $input.val(volume); // cambiamos el valor
      $input[0].dispatchEvent(new Event('input', { bubbles: true })); // forzamos el evento 'input'
      $input[0].dispatchEvent(new Event('change', { bubbles: true })); // forzamos también el evento 'change'
    });
};
