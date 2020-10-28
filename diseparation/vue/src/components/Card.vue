<template>
  <div id="card" class="col-md-4">
    <div class="box-shadow card mb-4 bg-light">
      <img class="card-img-top" :src="image" />
      <div class="card-body">
        <h5 class="card-title">
          <span :class="badgeType" class="badge">{{ badge }}</span> {{ name }}
          <small class="text-muted float-right">{{ small }}</small>
        </h5>
        <p class="card-text">
          <slot></slot>
        </p>
        <div class="btn-group">
          <a :href="primaryLink" class="btn btn-primary">{{ primary }}</a>
          <a :href="secondaryLink" class="btn btn-danger">{{ secondary }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Card",
  props: {
    name: String,
    small: String,

    image: String,

    primary: String,
    secondary: String,
    primaryLink: String,
    secondaryLink: String,

    badge: String,
    badgeType: String
  }
});
</script>