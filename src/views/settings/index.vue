<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAppStore } from '../../store/app';

const appStore = useAppStore();
const appId = ref(appStore.appId);

// 更新应用ID
const updateAppId = () => {
  if (appId.value.trim()) {
    appStore.setAppId(appId.value);
    console.log('应用ID已更新:', appId.value);
  }
};

onMounted(() => {
  console.log('Settings页面已挂载');
  console.log('当前应用ID:', appStore.appId);
});
</script>

<template>
  <div class="settings-container">
    <h1>设置</h1>
    
    <el-card class="settings-card">
      <template #header>
        <div class="card-header">
          <span>项目信息</span>
        </div>
      </template>
      
      <div class="settings-form">
        <el-form label-width="100px">
          <el-form-item label="应用ID">
            <el-input v-model="appId" placeholder="请输入应用ID"></el-input>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="updateAppId">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.settings-container {
  padding: 20px;
}

.settings-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.settings-form {
  max-width: 500px;
}
</style>
