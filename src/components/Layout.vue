<template>
  <el-container>
    <el-header>
      <div>
        <div class="leftPart">
          <div class="logo">
            <img src="../assets/images/logo.svg" />
            <span>金属表面缺陷检测系统</span>
          </div>
          <el-menu
            :default-active="defaultActive"
            class="el-menu-demo"
            mode="horizontal"
            :router="router"
          >
            <el-menu-item index="/home">智慧工厂</el-menu-item>
            <el-menu-item index="/list">智能检测</el-menu-item>
          </el-menu>
        </div>
        <div class="logout" @click="logout()">
          <img src="../assets/images/icn_logout.svg" />
          <span style="font-size: 14px">登出</span>
        </div>
      </div>
    </el-header>
    <el-main>
      <router-view />
    </el-main>
    <el-footer height="220px">
      <div class="footer-content">
        <div class="logo">
          <img src="../assets/images/logo.svg" />
          <span>金属表面缺陷检测系统</span>
        </div>
        <div style="display: flex">
          <ul class="content-nav">
            <li>
              <p>网站导航</p>
              <el-link @click="handleRoute('home')" >智慧工厂</el-link>
              <el-link @click="handleRoute('list')">智能检测</el-link>
            </li>
          </ul>
          <ul class="content-nav">
            <li>
              <p>联系方式</p>
              <span>邮箱：jzw@freelycar.com</span>
              <span>地址：安徽省宿州市博望路58号</span>
            </li>
          </ul>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      router: true,
      defaultActive: this.$route.name === "home" ? "/home" : "/list"
    };
  },
  methods: {
    logout() {
      localStorage.setItem("token", "");
      this.$router.push(`/login`);
      this.$message({
        message: "登出成功",
        type: "success",
      });
    },
    handleRoute(data) {
      this.$router.push(`/${data}`);
    },
  },
  watch:{
    $route: function(newRouter,oldRouter) {
      this.defaultActive = newRouter.path === "/home" ? "/home" : "/list"
    }
  }
};
</script>

<style lang="scss">
.el-header {
  width: 100%;
  box-shadow: 0px 4px 4px rgba(33, 94, 243, 0.08);

  > div {
    width: 1344px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    margin: 0 auto;
  }

  .leftPart {
    display: flex;
    align-content: center;
    align-items: center;

    .el-menu.el-menu--horizontal {
      border: 0;
    }
  }

  .logout {
    display: flex;
    align-items: center;
    cursor: pointer;

    img {
      width: 30px;
      height: 30px;
      margin-right: 5px;
    }
  }
}

.el-container {
  min-height: 100%;
  .logo {
    display: flex;
    align-items: center;
    margin-right: 200px;

    img {
      width: 40px;
      height: 40px;
      line-height: 60px;
      margin-right: 10px;
    }

    span {
      color: #215ef3;
      font-family: "Arial";
      font-style: normal;
      font-weight: 700;
      font-size: 18px;
    }
  }

  .el-main {
    min-height: calc(100% - 280px);
    padding: 5px 0 0 0;
    margin-bottom: 40px;

    .widFix {
      padding-top: 40px;
      width: 1344px;
      margin: 0 auto;
    }
  }

  .el-footer {
    width: 100%;
    padding: 0;
    overflow: hidden;
    background-color: #ecf1fe;
    margin-bottom: 0 !important;
    padding-top: 30px;
    .logo {
      img {
        width: 30px;
        height: 30px;
      }
    }
    .footer-content {
      width: 1344px;
      margin: 0 auto;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      .content-nav {
        display: flex;
        justify-content: space-around;
        margin-right: 80px;
        li {
          display: flex;
          flex-direction: column;
          padding: 0 20px;
          //justify-content: center;
          align-items: flex-start;

          p {
            color: #215ef3;
            font-family: "PingFang SC";
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 22px;
            margin-bottom: 20px;
          }

          > span,
          > a {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 15px;
          }
          > span {
            color: #606266;
          }
        }
      }
    }
  }
}
</style>
