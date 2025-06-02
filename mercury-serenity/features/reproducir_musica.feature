Feature: Reproducción de música
  Como usuario
  Quiero poder controlar la reproducción de canciones
  Para disfrutar de mi música favorita

  Scenario: Reproducir canción seleccionada
    Given el usuario está en la página principal
    When hago clic en la imagen de una canción
    Then la canción debería comenzar a reproducirse

  Scenario: Pausar canción en reproducción
    Given tengo una canción reproduciéndose
    When hago clic en el botón de pausa
    Then la canción debería pausarse
    And el icono debería cambiar a "play"

  