<template>
  <div class="container / pnp-container">
    <router-view/>
    <div id="nav" class="pnp-nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
  </div>
</template>

<style lang="scss">
  @media only screen and (max-width: 768px) {
      .pnp-container {
          padding-left: 0;
          padding-right: 0;
      }
  }

  .pnp-nav {
      margin: 20px 0 20px 0;
      text-align: center;
  }
</style>
