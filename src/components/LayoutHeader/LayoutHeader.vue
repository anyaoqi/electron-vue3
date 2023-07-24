<template>
  <div class="navbar-wrapper">
    <div class="logo-container">
      <img class="logo" src="../../assets/images/logo.png" alt="Element Plus Logo" data-v-0baf1018="">
    </div>
    <div class="content"></div>
  </div>
</template>

<style scoped lang="scss">
.navbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 32px;
  position: relative;
  border-bottom: 1px solid #dcdfe6;
  height: 55px;
  padding: 0 12px 0 24px;
  background-image: radial-gradient(transparent 1px,#ffffff 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
  -webkit-backdrop-filter: saturate(50%) blur(4px);
  top: 0;
  .logo-container {
    display: flex;
    align-items: center;
    height: 55px;
    .logo {
      width: 128px;
    }
  }
  .content {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-grow: 1;
  }
}
</style>