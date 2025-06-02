Feature: Crear canción
  Como artista
  Quiero completar un formulario para registrar un sencillo

  Scenario: Intentar enviar el formulario vacío
    Given el usuario está en la página de creación de canción
    When hace clic en "Publicar sencillo" sin llenar los campos
    Then el formulario no debería enviarse

  Scenario: Validar que no acepta números como nombre
    Given el usuario está en la página de creación de canción
    When ingresa "12345" en el campo nombre
    And hace clic en "Publicar sencillo"
    Then el formulario no debería enviarse

  Scenario: Exceder el límite de caracteres permitidos
    Given el usuario está en la página de creación de canción
    When ingresa un nombre con 101 caracteres en el campo
    And hace clic en "Publicar sencillo"
    And el formulario no debería enviarse

  Scenario: Intentar publicar una canción con nombre repetido
    Given el usuario está en la página de creación de canción
    When ingresa "Summer" en el campo nombre
    And sube un archivo de audio diferente
    And hace clic en "Publicar sencillo"
    Then debería mostrar error "Nombre ya existe"
    And el formulario no debería enviarse