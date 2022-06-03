<template>
    <el-container>
      <el-header>
        <el-page-header content="关于我自己" @back="goBack" />
      </el-header>
      <el-main style="text-align: center">
        <h3>
          <github-button href="https://github.com/lyf2nb/official-download" data-size="large" aria-label="Star lyf2nb/official-download on GitHub">
            关注我,或者帮助我,谢谢~
          </github-button>
        </h3>
        <h3>一个公益网站,不只是下载,你可以把你想分享给其他人的任何知识分享到此网站,也可以通过指南相关引流到你自己的网站</h3>
        <h3>一个Java开发工程师,苦于成为身边朋友的:电脑软件安装师,特此做此网站,希望可以帮助更多人~</h3>
        <h3>2022-06-03上线第一版</h3>
      </el-main>
    </el-container>
</template>

<script>
import GithubButton from 'vue-github-button'
export default {
  name: "about_me",
  components: {
    GithubButton
  },
  data() {
    return {

    };
  },
  methods:{
    goBack(){
      this.$router.go(-1)
    }
  },
}
</script>
