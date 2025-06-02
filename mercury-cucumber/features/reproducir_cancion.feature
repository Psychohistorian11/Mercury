Feature: Reproducir canción

  Scenario: Usuario reproduce una canción desde la lista principal
    Given el usuario abre la página "http://localhost:4200/home/artist/11"
    When el usuario da clic en una canción
    Then la canción empieza a reproducirse
