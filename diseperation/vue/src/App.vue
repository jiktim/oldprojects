<template>
  <div id="app">
    <main role="main">
      <section class="jumbotron text-center">
        <div class="container">
          <h5>{{ titles.top }}</h5>
          <h1 class="jumbotron-heading">{{ titles.bottom }}</h1>
          <p class="lead text-muted">{{ description }}</p>
          <div class="input-group mx-auto p-3 w-25">
            <div class="input-group-prepend" style="cursor: pointer !important;" @click="tag = !tag">
              <span v-if="tag" class="input-group-text" id="user-display">@</span>
              <span v-if="!tag" class="input-group-text" id="user-display">🔢</span>
            </div>
            <input
              type="text"
              name="user"
              class="form-control"
              placeholder="User"
              aria-label="User"
              aria-describedby="user-display"
            />
          </div>
          <a class="btn btn-primary my-2 text-white">{{ buttons.main }}</a>
        </div>
      </section>

      <div class="py-5">
        <div class="container" id="languages">
          <h1>jahseh</h1>
          <p>onfroy</p>
          <div class="row">
            <Card
              name="bruh"
              small="moment"
              primary="dwayne"
              secondary="ricardo"
              primaryLink="#ok"
              secondaryLink="#okay"
              badge="oh"
              badgeType="badge-success"
            >
              <p>bampot</p>

              <h6>ok</h6>
              <p>brother</p>
            </Card>
          </div>
        </div>
      </div>
    </main>

    <Footer v-bind:copyright="copyright">
      <p v-html="footer" />
    </Footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Footer from "./components/Footer.vue";
import Card from "./components/Card.vue";

const data = {
  titles: {
    top: "jiktim",
    bottom: "Diseperation"
  },
  buttons: {
    main: "Search"
  },
  description:
    "View a rich tree of your Discord friends list, going from you to the very last friend-of-friend.",
  copyright: "Alex P, cth103 and contributors.",
  footer: "<a href='#'>Contribute</a> to this website.",
  tag: true,
};

export default Vue.extend({
  name: "App",
  components: {
    Footer,
    Card
  },
  data: () => data
});
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";
</style>