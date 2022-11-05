<template>
    <el-container>
        <el-header>
            <div>
                <div class="leftPart">
                    <div class="logo">
                        <img src='../assets/images/logo.svg' />
                        <span>金属表面缺陷检测系统</span>
                    </div>
                    <el-menu :default-active="defaultActive" class="el-menu-demo" mode="horizontal"
                        @select="handleSelect" :router="router">
                        <el-menu-item index="/home">智慧工厂</el-menu-item>
                        <el-menu-item index="/list">智能检测</el-menu-item>
                    </el-menu>
                </div>
                <div class="logout">
                    <img src='../assets/images/icn_logout.svg' />
                    <span>登出</span>
                </div>
            </div>
        </el-header>
        <el-main>
            <router-view />
        </el-main>
    </el-container>
</template>
  
<script>
export default {
    data() {
        return {
            router: true,
            defaultActive: "/home",
            isShow: false
        };
    },
    methods: {
        handleSelect(key) {
            this.isShow = this.defaultActive != key;
            window.console.log(this.isShow);
        }
    }
};
</script>
  
<style lang="scss">
.el-header {
    width: 100%;
    box-shadow: 0 0 5px #215ef4;

    >div {
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
        .logo {
            padding: 10px;
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
                color: #215ef4;
                font-weight: bold;
            }
        }

        .el-menu.el-menu--horizontal {
            border: 0;
        }
    }

    .logout {
        display: flex;
        align-items: center;

        img {
            width: 30px;
            height: 30px;
            margin-right: 10px;
        }
    }

}

.el-container {
    .el-main {
        padding:40px 0;
        width: 1344px;
        margin: 0 auto;
    }
}
</style>
  