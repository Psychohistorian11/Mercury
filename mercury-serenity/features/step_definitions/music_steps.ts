import { Given, When, Then } from '@cucumber/cucumber';
import { actorInTheSpotlight, Wait, Duration } from '@serenity-js/core';
import { Click, PageElement, By, isVisible, isClickable, Text, Navigate } from '@serenity-js/web';

const MusicPlayer = {

    currentSongImage: () => PageElement.located(By.css('[data-cy="current-button"] img'))
        .describedAs('Imagen canción actual'),

    leftSongImage: () => PageElement.located(By.css('[data-cy="previous-button"] img'))
        .describedAs('Imagen canción izquierda'),

    rightSongImage: () => PageElement.located(By.css('[data-cy="next-button"] img'))
        .describedAs('Imagen canción derecha'),

    playPauseButton: () => PageElement.located(By.css('[data-cy="play-pause-button"]'))
        .describedAs('Botón play/pause'),

    playIcon: () => PageElement.located(By.css('[data-cy="play-icon"]'))
        .describedAs('Icono play'),

    pauseIcon: () => PageElement.located(By.css('[data-cy="pause-icon"]'))
        .describedAs('Icono pause'),

    playerSongName: () => PageElement.located(By.css('.fixed.bottom-0 p.text-base'))
        .describedAs('Nombre canción en reproductor')
};

// Reproducir canción seleccionada
Given('el usuario está en la página principal', async () => {
    await actorInTheSpotlight().attemptsTo(
        Navigate.to('http://localhost:4200/home/artist/11'),

    );
});

When('hago clic en la imagen de una canción', async () => {
    await actorInTheSpotlight().attemptsTo(
        Wait.until(MusicPlayer.leftSongImage(), isClickable()),
        Click.on(MusicPlayer.leftSongImage())
    );
});

Then('la canción debería comenzar a reproducirse', async () => {
    await actorInTheSpotlight().attemptsTo(
        Wait.until(MusicPlayer.pauseIcon(), isVisible())
    );
});

// Pausar canción en reproducción

Given('tengo una canción reproduciéndose', async () => {
    await actorInTheSpotlight().attemptsTo(
        Navigate.to('http://localhost:4200/home/artist/11'),

        Wait.until(MusicPlayer.leftSongImage(), isClickable()),
        Click.on(MusicPlayer.leftSongImage()),

        Wait.upTo(Duration.ofSeconds(5)).until(
            MusicPlayer.pauseIcon(),
            isVisible()
        )
    );
});

When('hago clic en el botón de pausa', async () => {
    await actorInTheSpotlight().attemptsTo(
        Wait.until(MusicPlayer.playPauseButton(), isClickable()),
        Click.on(MusicPlayer.playPauseButton())
    );
});

Then('la canción debería pausarse', async () => {
    await actorInTheSpotlight().attemptsTo(
        Wait.until(MusicPlayer.playIcon(), isVisible())
    );
});

Then('el icono debería cambiar a {string}', async (iconName: string) => {
    const element = iconName === 'play' ? MusicPlayer.playIcon() : MusicPlayer.pauseIcon();
    await actorInTheSpotlight().attemptsTo(
        Wait.until(element, isVisible())
    );
});