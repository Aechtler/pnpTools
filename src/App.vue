<template>
  <div class="container / pnp-container">
    <router-view/>
    <div id="nav" class="pnp-nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
  </div>
</template>