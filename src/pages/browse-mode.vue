<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-table
          :data="lessons"
          class="lesson-list"
          :row-class-name="rowClassName"
          @row-click="onLessonRowClick"
        >
          <el-table-column prop="globalID" label="课程编号" sortable>
          </el-table-column>
          <el-table-column prop="lessonName" label="课程名" sortable>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="1">
        <el-divider
          direction="vertical"
          class="app-vertical-divider"
        ></el-divider>
      </el-col>
      <el-col :span="16">
        <lesson :lessonDetail="lessonDetail" :status="lessonStatus" :lessonId='activeLesson'></lesson>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";
import CONSTS from '../consts';
import Lesson from "../components/Lesson";

export default {
  name: "BrowseMode",
  components: { Lesson },
  data() {
    return {
      activeLesson: "",
      lessonDetail: null,
      lessons: [],
    };
  },
  mounted() {
    axios.get(`${CONSTS.BROWSE_BASE}/get-lesson-list`).then((res) => {
      this.lessons = res.data;
      if (this.lessons) {
        this.activeLesson = this.lessons[0].globalID;
        this.onLessonRowClick({globalID: this.activeLesson})
      }
    });
  },
  computed: {
    lessonStatus() {
      return this.activeLesson
        ? this.lessonDetail
          ? "done"
          : "loading"
        : "init";
    },
  },
  methods: {
    rowClassName({ row, rowIndex }) {
      if (row.globalID === this.activeLesson) {
        return "selected-row";
      }
      return "";
    },
    async onLessonRowClick(e) {
      // 不重复加载相同的
      const lessonKey = e.globalID;
      this.activeLesson = lessonKey;

      this.lessonDetail = null;
      this.lessonDetail = (
        await axios.get(`${CONSTS.BROWSE_BASE}/get-lesson-data`, {
          params: {
            lessonKey: lessonKey,
          },
        })
      ).data;
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

<style>
.el-table .selected-row {
  background: #f0f9eb;
}
</style>