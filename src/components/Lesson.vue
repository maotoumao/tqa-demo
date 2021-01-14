<template>
  <div>
    <div v-if="status === 'init'">选择左侧课程</div>
    <div v-else class="lesson-data" v-loading="status === 'loading'">
      <template v-if="lessonDetail">
        <el-tabs v-model="tab">
          <el-tab-pane label="课程详情" name="lesson" class="pane">
            <div v-for="topic in lessonDetail.topics" :key="topic.globalID">
              <h2>{{ topic.topicName }}</h2>
              <p>
                {{ topic.content.text }}
              </p>
              <div
                v-for="figure in topic.content.figures"
                :key="figure.imagePath"
                class="lesson-imgs"
              >
                <el-image
                  :src="imgBase + '/imgs/' + figure.imagePath"
                ></el-image>
                <i>{{ figure.caption }}</i>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="习题" name="questions" class="pane">
            <div
              v-for="question in lessonDetail.questions.nonDiagramQuestions"
              :key="question.globalID"
            >
              <el-card class="box-card">
                <div slot="header" style="display: flex; align-items: center">
                  <el-tag>{{ question.questionType }}</el-tag>
                  <span style="flex: auto; margin-left: 10px">
                    {{ question.beingAsked.processedText }}
                  </span>
                  <el-button type="text" @click="onModelPredictClick(question)"
                    >模型预测</el-button
                  >
                </div>
                <div v-for="(ans, ind) in question.answerChoices" :key="ind">
                  {{ ind }}. {{ ans.processedText }}
                </div>
                <el-divider> </el-divider>
                <div>
                  Correct Answer: {{ question.correctAnswer.processedText }}
                </div>
                <div v-if="question.globalID in predictedAnswer">
                  Predicted Answer:
                  <span
                    v-loading="!predictedAnswer[question.globalID]"
                    element-loading-spinner="el-icon-loading"
                  >
                    {{ predictedAnswer[question.globalID] }}
                  </span>
                </div>
              </el-card>
            </div>

            <div
              v-for="question in lessonDetail.questions.diagramQuestions"
              :key="question.globalID"
            >
              <el-card class="box-card">
                <div slot="header" style="display: flex; align-items: center">
                  <el-tag>{{ question.questionType }}</el-tag>
                  <span style="flex: auto; margin-left: 10px">
                    {{ question.beingAsked.processedText }}
                  </span>
                  <el-button type="text" @click="onModelPredictClick(question)"
                    >模型预测</el-button
                  >
                </div>
                <div style="display: flex">
                  <div style="flex: auto">
                    <div
                      v-for="(ans, ind) in question.answerChoices"
                      :key="ind"
                    >
                      {{ ind }}. {{ ans.processedText }}
                    </div>
                  </div>
                  <div
                    style="
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                    "
                  >
                    <el-image
                      :src="imgBase + '/imgs/' + question.imagePath"
                      style="width: 200px; height: 150px"
                      fit="scale-down"
                    ></el-image>
                    <i>{{ question.imageName }}</i>
                  </div>
                </div>
                <el-divider> </el-divider>
                <div>
                  Correct Answer: {{ question.correctAnswer.processedText }}
                </div>
                <div v-if="question.globalID in predictedAnswer">
                  Predicted Answer:
                  <span
                    v-loading="!predictedAnswer[question.globalID]"
                    element-loading-spinner="el-icon-loading"
                  >
                    {{ predictedAnswer[question.globalID] }}
                  </span>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script>
import CONSTS from "../consts";

export default {
  name: "Lesson",
  props: ["lessonDetail", "status"],
  data() {
    return {
      tab: "lesson",
      predictedAnswer: {},
      imgBase: CONSTS.BROWSE_BASE,
    };
  },
  methods: {
    async onModelPredictClick(questionInfo) {
      let ans = this.predictedAnswer[questionInfo.globalID];
      if (ans) {
        return;
      }
      this.predictedAnswer = {
        ...this.predictedAnswer,
        [questionInfo.globalID]: null,
      };
      ans = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(questionInfo.correctAnswer.processedText);
        }, 500);
      });
      this.predictedAnswer = {
        ...this.predictedAnswer,
        [questionInfo.globalID]: ans,
      };
    },
  },
};
</script>

<style scoped>
.lesson-data {
  min-height: 20vh;
  margin-top: 20px;
  border: none;
  line-height: 1.6;
  text-align: justify;
}
.lesson-imgs {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.box-card {
  margin: 20px auto;
}
.pane {
  max-height: calc(100vh - 200px);
  height: calc(100vh - 200px);
  overflow-y: auto;
  padding-right: 15px;
}
</style>