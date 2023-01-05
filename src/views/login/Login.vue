<template>
  <div class="login">
    <el-row>
      <el-col :span="14">
        <div class="loginLeft"></div>
      </el-col>
      <el-col :span="10">
          <div class="loginWrapper">
            <h1 class="loginTitle">金属表面缺陷检测系统</h1>
            <el-form
              class="demo-ruleForm"
              ref="lform"
              :model="loginform"
              :rules="rules"
              label-width="0"
            >
              <el-form-item label="" prop="username">
                <el-input name="username" v-model="loginform.username" placeholder="用户名"></el-input>
              </el-form-item>
              <el-form-item label="" prop="pass">
                <el-input
                  name="password"
                  type="password"
                  v-model="loginform.password"
                  autocomplete="off"
                  placeholder="密码"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="login" style="width: 100%;">登录</el-button>
                <!-- <el-button type="text">
                  <router-link to="/">回到首页</router-link>
                </el-button> -->
              </el-form-item>
            </el-form>
          </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import users from "./users.json";
export default {
  data() {
    return {
      labelPosition: "right",
      loginform: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          // {
          //   min: 5,
          //   max: 20,
          //   message: "密码长度在 5 到 20 个字符",
          //   trigger: "blur"
          // }
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.lform.validate((valid) => {
        if (valid) {
          this.$http({
            method: "post",
            url: "/login",
            data: this.loginform,
          }).then(async (res) => {
            if (res.data && res.data.code == 1) {
              this.$message({
                message: "登录成功",
                type: "success",
              });
              localStorage.setItem("token","0536D68E34548DAC419F4B36D2757473")
              this.$router.push("/home");
            } else {
              this.$message({
                message: "账号或密码错误",
                type: "error",
              });
            }
          });
          // const user = users.find(
          //   (item) =>
          //     item.name == this.loginform.name &&
          //     item.pass === this.loginform.pass
          // );
          // if (user) {
          //   if (user.pass === this.loginform.pass) {
          //     this.$message({
          //       message: "登录成功",
          //       type: "success",
          //     });
          //     localStorage.setItem("token","0536D68E34548DAC419F4B36D2757473")
          //     this.$router.push("/home");
          //   } else {
          //     this.$message({
          //       message: "账号或密码错误",
          //       type: "error",
          //     });
          //   }
          // } else {
          //   this.$message({
          //     message: "账号或密码错误",
          //     type: "error",
          //   });
          // }
        } else {
          this.$message({
            message: "请输入合法的值",
            type: "error",
          });
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: #409eff;
}

.login {
  //display: flex;
  //padding: 200px 0;
  width: 100%;
  height: 100%;
  //background-image: url("../../assets/images/bg2.jpg");
  //background-repeat: no-repeat;
  //background-size: cover;
  //background-position: center;
  .el-row,.el-col,.el-card{
    height: 100%;
  }
  .loginWrapper{
    display: flex;
    flex-direction: column;
    margin: 150px 100px;
    .loginTitle{
      color:#215ef4;
      margin-bottom: 80px;
    }
    .el-form-item{
      margin-bottom: 45px;
    }
  }
  
}
.loginLeft{
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/login.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

</style>
