<template>
  <div class="wrapper">
    <el-dialog :visible.sync="previewVisible">
      <img width="100%" :src="previewImgUrl" alt="" />
    </el-dialog>
    <el-form
      :model="questionInfo"
      label-width="90px"
      label-position="left"
      ref="questionForm"
    >
      <el-form-item
        prop="question"
        label="问题描述"
        required
        :rules="[{ required: true, message: '问题描述不能为空' }]"
      >
        <el-input type="textarea" v-model="questionInfo.question"></el-input>
      </el-form-item>
      <el-form-item label="示意图">
        <el-upload
          ref="uploadImg"
          :auto-upload="false"
          action="undefined"
          list-type="picture-card"
          :on-preview="handleImgPreview"
          :on-remove="handleImgRemove"
          :on-change="handleImgChange"
          :limit="1"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        v-for="(candidate, index) in questionInfo.candidates"
        :label="'选项' + (index + 1)"
        :key="candidate.key"
        :prop="'candidates.' + index + '.value'"
        required
        :rules="[{ required: true, message: '候选项不能为空' }]"
      >
        <el-input v-model="candidate.value">
          <el-button
            class="btn-delete"
            slot="append"
            icon="el-icon-delete"
            :disabled="disableAddBtn"
            @click.prevent="removeCandidate(candidate)"
          ></el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitClick">提交</el-button>
        <el-button @click="addCandidate" :disabled="disableAddBtn"
          >新增选项</el-button
        >
      </el-form-item>
    </el-form>
    <template v-if="status !== 'ready'">
      <el-divider></el-divider>
      <div>
        预测答案：
        <span v-loading="status === 'pending'" element-loading-spinner="el-icon-loading">
          <div v-if="answer">
            <div>
              {{ answerInfo.correctAnswer }}
              <el-button
                type="text"
                style="margin-left: 30px"
                @click="dialogVisible = true"
                >查看详情</el-button
              >
            </div>
          </div>
        </span>
      </div>
    </template>

    <el-dialog
      title="答案详情"
      :visible.sync="dialogVisible"
      style="line-height: 1.8"
    >
      <div style="display: flex; justify-content: space-evenly; ">
        <div
          v-for="(candidate, index) in questionInfo.candidates"
          :key="candidate.key"
        >
          <div style='display: flex; flex-direction: column; align-items:center; '>
            <el-progress
              type="circle"
              :percentage="+(100 * answerInfo.probability[index]).toFixed(4)"
            ></el-progress>
            <div style="line-height: 2">选项{{ index + 1 }}: {{ candidate.value }}</div>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <div>
        <div>参考知识：</div>
        <div v-if="answer">{{ answer.cls_sent }}</div>
      </div>

      <span slot="footer">
        <el-button type="danger" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import CONSTS from "../consts";

export default {
  name: "QaMode",
  data() {
    return {
      dialogVisible: false,
      previewImgUrl: "",
      previewVisible: false,
      questionInfo: {
        question: "",
        candidates: [],
      },
      answer: null,
      status: "ready",
      disableAddBtn: false,
      answerInfo: {
        correctAnswer: "",
        probability: [],
      },
    };
  },
  methods: {
    readFile(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (e) => {
          if (typeof e.target.result === "object") {
            resolve(new Blob([e.target.result]));
          } else {
            resolve(e.target.result);
          }
        };
      });
    },
    removeCandidate(candidate) {
      const index = this.questionInfo.candidates.indexOf(candidate);
      if (index !== -1) {
        this.questionInfo.candidates.splice(index, 1);
      }
    },
    addCandidate() {
      this.questionInfo.candidates.push({
        value: "",
        key: uuidv4(),
      });
    },
    async onSubmitClick() {
      const valid = await new Promise((resolve, reject) => {
        this.$refs.questionForm.validate((valid) => {
          if (valid) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      });
      if (!valid) {
        return;
      }
      this.status = "pending";
      this.answer = null;
      let img = this.$refs.uploadImg.uploadFiles;
      // let name;
      if (img.length) {
        // name = img[0].name;
        img = await this.readFile(img[0].raw);
      } else {
        img = null;
      }
      const question = this.questionInfo.question;
      const candidates = this.questionInfo.candidates.map((c) => c.value);
      const formData = new FormData();
      formData.append("question", question);
      if (img) {
        formData.append("imgName", `${Date.now()}-${uuidv4()}.png`);
        formData.append("img", img);
      }
      formData.append("candidates", candidates);

      const result = await axios.post(CONSTS.MODEL_BASE, formData);
      this.answer = result.data;

      // 处理数据
      let { score } = this.answer;
      score = score.substring(1, score.length - 1);
      let probArray = score.split(/\s/);

      probArray = probArray.filter((v) => v !== "");
      probArray = probArray.slice(0, this.questionInfo.candidates.length);
      const sum = probArray.reduce((prev, curr) => +prev + (+curr), 0);
      probArray = probArray.map((v) => parseFloat(v) / sum);
      const maxProb = Math.max(...probArray);
      const correctAnswer = this.questionInfo.candidates[
        probArray.indexOf(maxProb)
      ].value;

      this.answerInfo = {
        correctAnswer,
        probability: probArray,
      };

      this.status = "done";

      //   axios.post('http://localhost:6028/model', {
      //       ...this.questionInfo,
      //       imgs
      //   })
    },
    handleImgPreview(file) {
      this.previewImgUrl = file.url;
      this.previewVisible = true;
    },
    handleImgRemove(file, fileList) {
      if (fileList.length == 0) {
        this.disableAddBtn = false;
      }
    },
    handleImgChange(file, fileList) {
      if (fileList.length > 0) {
        // 示意图问题，答案只能有4个
        const length = this.questionInfo.candidates.length;
        if (length < 4) {
          for (let i = 0; i < 4 - length; ++i) {
            this.addCandidate();
          }
        } else if (length > 4) {
          this.questionInfo.candidates = this.questionInfo.candidates.slice(
            0,
            4
          );
        }
        this.disableAddBtn = true;
      }
    },
  },
};
</script>

<style scoped>
.wrapper {
  margin-top: 20px;
  padding-right: 10px;
  max-height: calc(100vh - 160px);
  height: calc(100vh - 160px);
  overflow: auto;
}
.btn-delete {
  background-color: #f56c6c !important;
  color: white !important;
  border-color: #f56c6c !important;
}

.answer-area {
  margin-top: 10px;
  min-height: 150px;
  height: 150px;
  line-height: 1.6;
}
</style>