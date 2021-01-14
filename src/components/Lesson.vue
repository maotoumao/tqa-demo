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
                    <template v-if="predictedAnswer[question.globalID]">
                      {{ predictedAnswer[question.globalID].answer }}
                      <el-button
                        type="text"
                        style="margin-left: 20px"
                        @click="onDetailClick(question)"
                        >查看详情</el-button
                      >
                    </template>
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
                    <template v-if="predictedAnswer[question.globalID]">
                      {{ predictedAnswer[question.globalID].answer }}
                      <el-button
                        type="text"
                        style="margin-left: 20px"
                        @click="onDetailClick(question)"
                        >查看详情</el-button
                      >
                    </template>
                  </span>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </div>
<el-dialog
      title="答案详情"
      :visible.sync="dialogVisible"
      style="line-height: 1.8"
      v-if='activeQuestion && activeCandidates && predictedAnswer[activeQuestion]'
    >
      <div style="display: flex; justify-content: space-evenly; ">
        <div
          v-for="(candidate, index) in activeCandidates"
          :key="index"
        >
          <div style='display: flex; flex-direction: column; align-items:center; '>
            <el-progress
              type="circle"
              :percentage="+(100 * predictedAnswer[activeQuestion].probability[index]).toFixed(4)"
            ></el-progress>
            <div style="line-height: 2">选项{{ index + 1 }}: {{ candidate }}</div>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <div>
        <div>参考知识：</div>
        <div>{{ predictedAnswer[activeQuestion].cls_sent }}</div>
      </div>

      <span slot="footer">
        <el-button type="danger" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    

  </div>
</template>

<script>
import axios from "axios";
import CONSTS from "../consts";

export default {
  name: "Lesson",
  props: ["lessonDetail", "status", "lessonId"],
  data() {
    return {
      tab: "lesson",
      activeQuestion: null,
      activeCandidates: null,
      dialogVisible: false,
      predictedAnswer: {},
      imgBase: CONSTS.BROWSE_BASE,
    };
  },
  methods: {
    onDetailClick(questionInfo){
      // console.log(questionInfo);
      this.activeQuestion = questionInfo.globalID;
      this.activeCandidates = Object.values(questionInfo.answerChoices).map(v => v.processedText);
      this.dialogVisible = true;
    },

    async onModelPredictClick(questionInfo) {
      let ans = this.predictedAnswer[questionInfo.globalID];
      if (ans) {
        return;
      }
      this.predictedAnswer = {
        ...this.predictedAnswer,
        [questionInfo.globalID]: null,
      };

      const formData = new FormData();
      formData.append("search", [this.lessonId, questionInfo.globalID]);

      ans = (await axios.post(CONSTS.MODEL_BASE, formData)).data;
      let { score, cls_sent } = ans;
      score = score.substring(1, score.length - 1);
      let probArray = score.split(/\s/);
      const candidates = Object.values(questionInfo.answerChoices);
      probArray = probArray.filter((v) => v !== "");
      probArray = probArray.slice(0, candidates.length);
      const sum = probArray.reduce((prev, curr) => +prev + +curr, 0);
      probArray = probArray.map((v) => parseFloat(v) / sum);
      const maxProb = Math.max(...probArray);
      const answer = candidates[probArray.indexOf(maxProb)].rawText;

      this.predictedAnswer = {
        ...this.predictedAnswer,
        [questionInfo.globalID]: {
          answer,
          probability: probArray,
          cls_sent
        },
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