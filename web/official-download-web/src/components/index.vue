<template>
  <el-container>

    <el-header>
      <el-affix>
        <el-row style="background-color: #ffffff; padding: 0.5%; border-bottom: 1px solid #dcdfe6;">
          <el-col :span="4" :offset="4" style="text-align: center">
            <el-link href="/">
              <el-icon><Bottom /></el-icon>
              官方下载
            </el-link>
          </el-col>
          <el-col :span="4" style="text-align: center">
            <el-input
                v-model="param.keyword"
                placeholder="搜索">
              <template #append>
                <el-button @click="search"><el-icon><Search /></el-icon></el-button>
              </template>
            </el-input>

          </el-col>
          <el-col :span="4" style="text-align: center">
            <el-link href="/about_me">
              <el-icon><House /></el-icon>关于我
            </el-link>
          </el-col>
          <el-col :span="2" style="text-align: center">
            <el-link href="https://support.qq.com/product/409834" target="_blank">
              <el-icon><Message /></el-icon>在线反馈
            </el-link>
          </el-col>
          <el-col :span="2" style="text-align: center">
            <github-button href="https://github.com/lyf2nb/official-download" data-size="large" aria-label="Star lyf2nb/official-download on GitHub">关注</github-button>
          </el-col>
        </el-row>
      </el-affix>
    </el-header>

    <el-main>
      <el-row :gutter="20" v-if="bannerList.length>0">
        <el-col :span="16" :offset="4">
          <el-carousel indicator-position="outside">
            <el-carousel-item v-for="item in bannerList" :key="item" style="text-align: center">
              <el-link :href="item.bannerUrl" target="_blank" :disabled="!item.disabled">
                <img :src="item.imageUrl"/>
              </el-link>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-main>
    <el-container style="height: 800px">
      <el-container>
        <el-aside width="300px">
          <el-menu :default-active="param.type +''">
            <el-menu-item v-for="item in typeList" :index="item.code +''" @click="typeChange">
              <span>{{ item.name }}</span>
            </el-menu-item>
          </el-menu>

        </el-aside>
        <el-main>
            <ul  v-infinite-scroll="load" :infinite-scroll-distance="2" infinite-scroll-delay="1000">
              <li style="list-style: none">
                <el-space wrap size="large">
                  <el-card v-for="item in softwareList" :body-style="{ padding: '10px',margin: '10px',width:'180px' }">
                    <el-row>
                      <el-col :span="24">
                        <el-row>
                          <el-col :span="24">
                            <el-image style="width: 180px; height: 180px" :src="item.logoUrl" fit="fill" />
                          </el-col>
                          <el-col :span="24" style="text-align: center">
                            <el-tag effect="dark" type="success">名称:{{item.name}}</el-tag>
                          </el-col>
                          <el-col :span="24">
                            <el-link :href="item.officialWebsite" target="_blank">
                              <el-button style="width: 180px;margin-top: 2px" type="primary">去官网</el-button>
                            </el-link>
                          </el-col>
                          <el-col :span="24">
                            <el-link :href="item.downloadLink" target="_blank">
                              <el-button style="width: 180px;margin-top: 2px" type="success">直接下载</el-button>
                            </el-link>
                          </el-col>
                          <el-col :span="24">
                            <el-tooltip
                                effect="dark"
                                content="如果网盘需要复杂操作(例如关注公众号),或者信息不对可以点击下边的不喜欢,到达一定数量则自动删除网盘连接"
                                placement="right">
                              <el-link :href="item.panUrl" target="_blank">
                                <el-button style="width: 180px;margin-top: 2px" type="warning">网盘连接</el-button>
                              </el-link>
                            </el-tooltip>

                          </el-col>
                          <el-col :span="24">
                            <el-link :href="item.tutorialUrl" target="_blank">
                              <el-button style="width: 180px;margin-top: 2px" type="primary" color="#626aef">网友指南</el-button>
                            </el-link>
                          </el-col>
                          <el-col :span="2" :offset="1">
                            <el-tooltip
                                effect="dark"
                                content="第二版做,不好意思"
                                placement="right">
                              <el-button  style="margin-top: 2px"  type="primary" circle>
                                <el-icon><StarFilled /></el-icon>
                              </el-button>
                            </el-tooltip>
                          </el-col>
                          <el-col :span="2" :offset="8" style="text-align: center;margin-top: 2px">
                            {{ item.likeNum }}
                          </el-col>
                          <el-col :span="2" :offset="5">
                            <el-tooltip
                                effect="dark"
                                content="第二版做,不好意思"
                                placement="right">
                              <el-button  style="margin-top: 2px" type="danger" circle >
                                <el-icon><CloseBold /></el-icon>
                              </el-button>
                            </el-tooltip>
                          </el-col>
                        </el-row>

                      </el-col>

                    </el-row>

                  </el-card>
                </el-space>
              </li>
            </ul>
        </el-main>
      </el-container>



<!--      <el-footer style="text-align: center">不要看了,暂时没有页脚内容~~~</el-footer>-->
    </el-container>
  </el-container>
</template>

<script>
import GithubButton from 'vue-github-button'
export default {
  name: "index",
  components: {
    GithubButton
  },
  data() {
    return {
      param:{
        keyword:null,
        type:0,
        page:0,
      },
      bannerList:[],
      typeList:[],
      softwareList:[],
      busy:false
    };
  },
  methods: {
    typeChange(param){
      if (param.index !=0){
        this.softwareList = [];
      }
      this.param.page = 0;
      this.param.type = param.index;
      this.search()
    },
    load(){
        this.param.page += 1
        this.search();
    },
    aaa(){
      console.log( this.$router.getRoutes())
      this.$router.push({ path: "/test" });
    },
    search(){
      var vm = this;
      this.axios.get('/official-download/getBaseSoftwareByParam',{
        "params":this.param}).then(function (response) {
        //合并这两个数组后需要将no相同的去掉，首先合并两个数组
        vm.softwareList=([...vm.softwareList,...response.data])
        const res = new Map();  //定义常量 res,值为一个Map对象实例
        //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
        vm.softwareList = vm.softwareList.filter((arr) => !res.has(arr.code) && res.set(arr, 1))
      }).catch(function (error) {
        console.log(error);
      });
    },
    getAllType(){
      var vm = this;
      this.axios.get('/official-download/getAllType').then(function (response) {
          vm.typeList = response.data;
      }).catch(function (error) {
          console.log(error);
      });
    }
  },
  mounted() {
    this.getAllType();
    this.search();
  }
}
</script>
