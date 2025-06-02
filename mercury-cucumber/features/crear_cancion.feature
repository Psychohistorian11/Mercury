Feature: Crear canción

  Scenario: Verificar presencia y tipo de campos del formulario
    Given el artista navega a la página de creación de canciones
    Then debería ver un campo de texto para el nombre del sencillo
    And debería ver un campo de archivo para subir el audio
    And debería ver un campo de archivo para subir la imagen
    And debería ver un selector para elegir el género

  Scenario: Validar tipos de campos en el formulario
    Then el campo "Nombre del sencillo" debe ser de tipo "text"
    And el campo "Sencillo" debe aceptar archivos de tipo "audio/*"
    And el campo "Portada del sencillo" debe aceptar archivos de tipo "file/*"
    And el campo "Género del sencillo" debe ser un "select"
  
