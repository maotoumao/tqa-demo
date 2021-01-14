<template>
  <div class="wrapper">
    <el-dialog :visible.sync="previewVisible">
      <img width="100%" :src="previewImgUrl" alt="" />
    </el-dialog>
    <el-form :model="questionInfo" label-width="70px" label-position="left">
      <el-form-item prop="question" label="问题描述">
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
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        v-for="(candidate, index) in questionInfo.candidates"
        :label="'选项' + (index + 1)"
        :key="candidate.key"
      >
        <el-input v-model="candidate.value">
          <el-button
            class="btn-delete"
            slot="append"
            icon="el-icon-delete"
            @click.prevent="removeCandidate(candidate)"
          ></el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmitClick">提交</el-button>
        <el-button @click="addCandidate">新增选项</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import axios from 'axios';
import CONSTS from "../consts";

export default {
  name: "QaMode",
  data() {
    return {
      previewImgUrl: "",
      previewVisible: false,
      questionInfo: {
        question: "",
        candidates: [],
      },
    };
  },
  methods: {
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
    onSubmitClick() {
      const imgs = this.$refs.uploadImg.uploadFiles;

    //   axios.post('http://localhost:6028/model', {
    //       ...this.questionInfo,
    //       imgs
    //   })
      
    },
    handleImgPreview(file) {
      this.previewImgUrl = file.url;
      this.previewVisible = true;
    },
    handleImgRemove(file, fileList) {},
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
</style>