<template>
  <!-- 个人简介 -->
  <div class="person">
    <Lightning
      :hue="210"
      :x-offset="0"
      :speed="1"
      :intensity="1"
      :size="2"
      class="w-full h-full"
    />
    <div class="text">
      <div class="text-name">
        <ShinyText
          text="李航  河南科技大学  7年经验 前端开发工程师  在职-考虑机会"
          :disabled="false"
          :speed="3"
          class-name="name-text"
        />
      </div>
      <div class="text-brief">
       <div class="brief" v-for="item in briefList" :key="item.id">
        {{ item.id }}. {{ item.content }}
       </div>
      </div>
      <div class="text-work">
        <p>工作经历</p>
        <div class="works">
          <div class="work" v-for="item in workList" :key="item.id">
          <div class="name-time">
          <div class="work-name">{{ item.name }}</div>
          <div class="work-time">{{ item.time }}</div>
          </div>
          <div class="content" v-for="content in item.content" :key="content.id">
          <div>{{ content.id }}.{{ content.detail }}</div>
        </div>
        </div>
        </div>
      </div>
      <!-- <div class="text-projects">4444</div> -->
    </div>
    <div class="back-btn">
      <el-button  type="info" round @click="turnToHome">返回</el-button>
    </div>
  </div>
</template>

<script>
import Lightning from "./Lightning.vue";
import ShinyText from "./ShinyText.vue";
export default {
  name: "TestMobile",
  components: {
    Lightning,
    ShinyText,
  },
  data() {
    return {
      briefList:[
        {
          id: 1,
          content: "熟悉w3c标准、弹性布局、HTML5、CSS3、JavaScript、ES6、TS"
        },
        {
          id: 2,
          content: "熟练用 Vue2/Vue3、React、uni-app 框架开发，了解 Angular 框架"
        },
        {
          id: 3,
          content: "熟练用 Element-ui/plus、vant、Echarts、ahooks、AntDesign 等组件库"
        },
        {
          id: 4,
          content: "熟练用 Ajax（fetch/xhr）、RS485+websocket 实时通讯"
        },
        {
          id: 5,
          content: "熟练用 node.js、webpack 、vite ，使用 git 控制版本和团队协作"
        },
        {
          id: 6,
          content: "熟练掌握 Electron 桌面应用，HbuilderX 开发多端项目"
        },
        {
          id: 7,
          content: "three.js+3Dlingo，anime, gsap"
        },
        {
          id: 8,
          content: "qiankun,ruoYi集成微前端框架,熟悉使用鸿蒙开发"
        },
        {
          id: 9,
          content: "熟练掌握ai培养调试开发,如cursor等"
        }
      ],
      workList:[
        {
          id: 1,
          name: "中电信医疗健康科技有限公司",
          time: "2023.06-至今",
          content: [
            {
              id: 1,
              detail: "负责智慧医院与公共卫生团队的项目前端框架搭建与业务开发."
            },
            {
              id: 2,
              detail: "各省区相关卫健委平台项目PC/移动端的开发."
            },
            {
              id: 3,
              detail: "老旧医院系统的升级改造."
            },
            {
              id: 4,
              detail: "集成系统的改造优化,进一步延伸扩展适合各地区的定制功能."
            }
          ]
        },
         {
          id: 2,
          name: "成都唐源电气股份有限公司",
          time: "2023.04-2023.05",
          content: [
            {
              id: 1,
              detail: "EIS 系统的维护与开发以及新的微服务-文件系统的开发."
            },
            {
              id: 2,
              detail: "根据简洁的流程图和截图式原型图进行布局开发."
            },
            {
              id: 3,
              detail: "开发文件分类、文件信息、文件变更三大模块以及主要核心业务逻辑送审以及审核流程."
            },
            {
              id: 4,
              detail: "细节功能的的增加，例如签名、预览、评论回复."
            }
          ]
        },
        {
          id: 3,
          name: "昂顿科技（上海）有限公司",
          time: "2020.04-2023.03",
          content: [
            {
              id: 1,
              detail: "电力能源数字化方向,保留部分原有功能，重新设计开发，从0-1构建pc端云平台二代."
            },
            {
              id: 2,
              detail: "RS485软硬件通讯技术,传感器与通管机结合前端实时通讯."
            },
            {
              id: 3,
              detail: "根据公司需求和客户要求进行功能的增加与优化,进一步提升功能性向数字化方向发展."
            }
          ]
        },
        {
          id: 4,
          name: "北京宇信科技集团股份有限公司",
          time: "2018.09-2020.04",
          content: [
            {
              id: 1,
              detail: "web前端的开发,根据UI设计图完成页面的编写."
            },
            {
              id: 2,
              detail: "逻辑优化调整，与后端进行接口的调试,与测试进行bug修复."
            },
            {
              id: 3,
              detail: "参与定制化系统/可视化大屏/小程序/APP的开发."
            }
          ]
        },
      ]
    };
  },
  methods: {
    turnToHome() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped lang="scss">
.person {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  .text {
    position: relative;
    width: 880px;
    height: 880px;
    margin: 0 auto;
    top: 1%;
    border-radius: 10px;
    z-index: 2;
    /* overflow-y: auto; */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .text-name {
      color: rgba(208, 246, 253, 0.5);
      font-size: 28px;
      font-family: FZYaSongS-H-GB;
      font-weight: 500;
      height: 60px;
      margin-top: 20px;
    }
    .text-brief {
      height: 280px;
      color: rgba(236, 252, 255, 0.5);
      margin-left: 20px;
      .brief {
        margin-top: 5px;
      }
    }
    .text-work {
      /* height: 300px; */
      margin-left: 20px;
      color: rgba(236, 252, 255, 0.5);
      margin-bottom: 10px;
      p {
        font-weight: 600;
        font-size: 20px;
      }
      .works {
        .work {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        .name-time {
          display: flex;
          width: 80%;
          justify-content: space-between;
          margin-bottom: 10px;
        }
      }
      }
    }
    .text-projects {
      /* height: 500px; */
      color: rgba(236, 252, 255, 0.5);
    }
  }
  .back-btn {
    position: absolute;
    top: 50%;
    left: 20px;
    z-index: 3;
  }
}
</style>
