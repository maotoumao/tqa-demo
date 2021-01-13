<template>
  <div class="wrapper">
    <el-input v-model="query" placeholder="搜索数据库中已有的问题">
      <el-button slot="append" icon="el-icon-search" id="search"></el-button>
    </el-input>

    <ul class="infinite-list" style="overflow: auto">
      <li v-for="r in results" :key="r.key" class="infinite-list-item">{{ r.value }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      query: "",
      results: [
        {
          key: '1212',
          value: 'question1'
        }
      ]
    };
  },
};
</script>

<style scoped>
.wrapper {
  margin-top: 20px;
}
</style>