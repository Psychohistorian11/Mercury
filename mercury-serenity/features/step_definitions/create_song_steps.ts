import { Given, When, Then } from '@cucumber/cucumber';
import { actorInTheSpotlight, Duration, Wait } from '@serenity-js/core';
import { Navigate, Click, PageElement, By, isVisible, isClickable, Attribute, Enter } from '@serenity-js/web';
import { Ensure, not } from '@serenity-js/assertions';

const FormElements = {
    submitButton: () => PageElement.located(By.css('button[type="submit"]'))
        .describedAs('Botón Publicar sencillo'),

    nameField: () => PageElement.located(By.css('[formcontrolname="name"]'))
        .describedAs('Campo nombre del sencillo'),

    genreField: () => PageElement.located(By.css('[formcontrolname="genre"]'))
        .describedAs('Campo género'),

    audioField: () => PageElement.located(By.css('input[type="file"][accept="audio/*"]'))
        .describedAs('Campo archivo de audio'),

};

Given('el usuario está en la página de creación de canción', async () => {
    await actorInTheSpotlight().attemptsTo(
        Navigate.to('http://localhost:4200/home/artist/11/my-songs/create-song'),
        Wait.until(FormElements.nameField(), isVisible())
    );
});

When('hace clic en {string} sin llenar los campos', async (publicar: string) => {
    await actorInTheSpotlight().attemptsTo(
        Wait.until(FormElements.submitButton(), isClickable()),
        Click.on(FormElements.submitButton()),
    );
});

Then('el formulario no debería enviarse', async () => {
    await actorInTheSpotlight().attemptsTo(
        Ensure.that(
            PageElement.located(By.css('.swal2-success')),
            not(isVisible())
        )
    );
});


// Nuevos steps para validación de tipo texto
When('ingresa {string} en el campo nombre', async (valor: string) => {
    await actorInTheSpotlight().attemptsTo(
        Enter.theValue(valor).into(FormElements.nameField())
    );
});

When('hace clic en {string}', async (buttonText: string) => {
    await actorInTheSpotlight().attemptsTo(
        Wait.until(FormElements.submitButton(), isClickable()),
        Click.on(FormElements.submitButton())
    );
});


// ... (imports y configuraciones existentes)

When('ingresa un nombre con {int} caracteres en el campo', async (length: number) => {
    const longName = 'A'.repeat(length); // Crea string de longitud específica

    await actorInTheSpotlight().attemptsTo(
        Enter.theValue(longName).into(FormElements.nameField()),
        Wait.for(Duration.ofMilliseconds(300)) // Espera a validación
    );
});


When('sube un archivo de audio diferente', async () => {
    await actorInTheSpotlight().attemptsTo(
        Enter.theValue('test-data/nuevo_audio.mp3').into(FormElements.audioField())

    );
});

Then('debería mostrar error {string}', async (mensaje: string) => {
    await actorInTheSpotlight().attemptsTo(
        Wait.until(
            PageElement.located(By.css('.error-unique')),
            isVisible()
        ),
    );
});