<template>
  <div>
    <div>课程列表</div>
    <el-collapse @change="onActiveLessonChange" accordion class="lesson-list">
      <el-collapse-item
        v-for="lesson in lessons"
        :key="lesson.globalID"
        :title="lesson.lessonName"
        :name="lesson.globalID"
      >
        <div class="lesson-data" v-loading="activeLesson !== lesson.globalID">
          <div v-for="topic in lessonDetail.topics" :key="topic.globalID">
            <h1>{{ topic.topicName }}</h1>
            <p>
              {{ topic.content.text }}
            </p>
            <div
              v-for="figure in topic.content.figures"
              :key="figure.imagePath"
              class="lesson-imgs"
            >
              <el-image :src="'http://localhost:6028/' + figure.imagePath"></el-image>
              <i>{{ figure.caption }}</i>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Lessons",
  data() {
    return {
      activeLesson: "",
      lessonDetail: {},
      lessons: [],
    };
  },
  mounted(){
    axios.get('http://localhost:6028/get-lesson-list').then(res => {
      this.lessons = res.data;
    })
  },
  methods: {
    async onActiveLessonChange(lessonKey) {
      // 不重复加载相同的
      if (lessonKey === "") {
        return;
      }
      this.lessonDetail = (await axios.get('http://localhost:6028/get-lesson-data', {
        params: {
          lessonKey: lessonKey
        }
      })).data;
      this.activeLesson = lessonKey;
      
    },
  },
};
</script>

<style scoped>
.lesson-list {
  margin-top: 20px;
  max-height: calc(100vh - 160px);
  height: calc(100vh - 160px);
  overflow-y: auto;
  border: none;
}
.lesson-data {
  min-height: 20vh;
}
.lesson-imgs {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>