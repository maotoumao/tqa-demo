<template>
  <div id="app">
    <el-container>
      <el-header class="app-header">
        <el-image
          style="height: 80%; width: 100px"
          :src="require('./assets/logo.png')"
          fit="contain"
        ></el-image>
        <span style='flex:auto'>智能问答系统</span>
        <el-switch
                style="display: block"
                :value="mode==='qa'"
                @change='changeSwitch'
                active-color="#13ce66"
                inactive-color="#409eff"
                active-text="问答模式"
                inactive-text="浏览模式"
              >
        </el-switch>
      </el-header>
      <el-divider class="app-divider"></el-divider>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      mode: 'browse',
    };
  },
  methods:{
    changeSwitch(e){
      if(e){
        this.mode = 'qa';
      }else{
        this.mode = 'browse';
      }

      this.$router.push({name: this.mode})
    }
  },
  mounted(){
    this.mode = this.$route.path.substring(1);
  }
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
