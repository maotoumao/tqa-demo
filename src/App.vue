<template>
  <div id="app">
    <el-container>
      <el-header class="app-header">
        <el-image
          style="height: 80%; width: 100px"
          src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4158315065,3801171016&fm=26&gp=0.jpg"
          fit="scale-down"
        ></el-image>
        TQA Demo
      </el-header>
      <el-divider class="app-divider"></el-divider>
      <el-main>
        <el-row :gutter="20">
          <el-col :span="9">
            <lessons></lessons>
          </el-col>
          <el-col :span="1" >
            <el-divider direction="vertical" class="app-vertical-divider"></el-divider>
          </el-col>
          <el-col :span="14">
            <div class="app-component-header">
              <el-switch
                style="display: block"
                v-model="askMode"
                active-color="#13ce66"
                inactive-color="#409eff"
                active-text="问答模式"
                inactive-text="检索模式"
              >
              </el-switch>
            </div>

            <component :is="askMode ? 'ask' : 'search'"></component>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Search from "./components/Search.vue";
import Ask from "./components/Ask.vue";
import Lessons from "./components/Lessons.vue";

export default {
  name: "App",
  components: {
    Search,
    Ask,
    Lessons,
  },
  data() {
    return {
      askMode: false,
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.app-header {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 20px;
  font-weight: bold;
}

.app-divider {
  margin: auto;
}

.app-vertical-divider{
  height: calc(100vh - 120px)
}

.app-component-header{
  display: flex;
  align-items: center;
}
</style>
