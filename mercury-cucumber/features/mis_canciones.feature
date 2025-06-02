Feature: Crear nuevo contenido musical

  Scenario: Ver opciones al hacer clic en "CREAR"
    Given el usuario está en la sección "Mis canciones"
    When el usuario hace clic en el botón "CREAR"
    Then debería ver opciones para crear un álbum o un sencillo
