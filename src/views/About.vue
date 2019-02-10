<template>
  <div>
    <div class="jumbotron jumbotron-fluid">
      <div class="container">
          <h1 class="display-4"><font-awesome-icon icon="heart" /> you!</h1>
      </div>
    </div>
    <div class="container / about-container">
     <h2 class="about__title">Hail to the Spielleiter, Baby!</h2>
      <div class="about__row">
        <div class="about__col">
          <p>Dieses kleine Tool ist an die Käufer der <a href="https://www.getshirts.de/index.php?page=artikel&id=434077#ansicht" target="_blank">Pen&Paper T.E.A.R.S. Box</a> von Rocket Beans TV gerichtet. Es soll euch helfen den Überblick im Kampf zu behalten.</p>
          <p>Ich verfolge keine kommerziellen Zwecke oder sammle teuflisch eure Daten - Ne, eigentlich war das Tool nur für mich gedacht und jetzt könnt ihr es auch nutzen. For Free - ohne Werbung - und sowas...</p>
          <p>Viel Spaß - Euer Mark Aechtler</p>
          <router-link to="/fight" tag="button" class="btn btn-success / about__cta">
              Start Battle! <font-awesome-icon icon="dice-d20" />
          </router-link>
        </div>
        <div class="about__col about__col--image">
          <a href="https://www.getshirts.de/index.php?page=artikel&id=434077#ansicht" target="_blank"><img src="../assets/tears-box.jpg" class="about__image" width="100%" /></a>
        </div>
      </div>
    </div>
  </div>
</template>