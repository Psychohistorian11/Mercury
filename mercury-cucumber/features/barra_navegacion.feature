Feature: Barra de navegación

  Scenario: El usuario ve el nombre de la aplicación
    Given el usuario abre la página del menú principal "http://localhost:4200/home/artist/11"
    Then debería ver el texto "Mercury" en el header

  Scenario: Usuario hace clic en el logo y vuelve al inicio
    When el usuario da clic en el logo de la aplicación
    Then debería estar en la ruta "http://localhost:4200/home/artist/11"

  Scenario: Ir a la sección "Mis canciones" desde el ícono del laboratorio
    When el usuario hace clic en el ícono del laboratorio
    Then debería ser redirigido a la sección "Mis canciones"
