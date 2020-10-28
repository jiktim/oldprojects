<template>
  <div class="footer">
    <footer class="bg-light text-muted">
      <div class="container">
        <p class="float-right">
          <a href="#">Back to top</a>
        </p>
        <p>
          <b>Copyright</b>
          &copy; {{ new Date().getFullYear() }}
          {{ copyright }}
        </p>
        <slot />
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Footer",
  props: {
    copyright: String
  }
});
</script>

<style scoped lang="scss">
footer {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

footer p {
  margin-bottom: 0.25rem;
}
</style>
