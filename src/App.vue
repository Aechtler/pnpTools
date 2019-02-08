<template>
  <div class="container / pnp-container">
    <router-view/>
    <div id="nav" class="pnp-nav">
      <router-link to="/">About</router-link> |
      <router-link to="/fight">Battle</router-link>
    </div>
  </div>
</template>

<style lang="scss">
  @media only screen and (max-width: 768px) {
      .pnp-container {
          padding-left: 0 !important;
          padding-right: 0 !important;
      }
  }

  .pnp-nav {
      margin: 20px 0 20px 0;
      text-align: center;
  }
</style>
