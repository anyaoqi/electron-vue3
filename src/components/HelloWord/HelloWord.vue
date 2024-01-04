<script lang='ts' setup>
import config from "../../../config/config.json"

const title = config.title
</script>

<template>
  <h1>{{ title }}</h1>
  <p>Hello word</p>
</template>

<style lang='scss' scoped>
h1, p {
  text-align: center;
}
h1 {
  margin-top: 280px;
  margin-bottom: 10px;
}
</style>