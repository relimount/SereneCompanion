<template>
  <el-header>
    <div class="header-content">
      <!-- 左侧折叠按钮 -->
      <div class="header-left flex-box">
        <el-icon class="header-icon" size="20">
          <Fold />
        </el-icon>
      </div>
      <!-- 右侧头像、用户名+登出 -->
      <div class="header-right flex-box">
        <el-dropdown>
    <span class="el-dropdown-link flex-box">
      <el-avatar
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
      <p class="username">用户名</p>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
      </div>
    </div>
  </el-header>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.flex-box{
    display: flex;
    align-items: center;
}
.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height:100%;
    background-color: #fff;
    padding-right: 25px;
    .header-left{
        height: 100%;
        .header-icon{
            width: 45px;
            height: 100%;
        }
        .header-icon:hover{
            background-color: #f5f5f5;
            cursor: pointer;
        }
    }
    .header-right{
        height: 100%;
        .username{
            margin-left: 10px;
        }
    }
}
</style>