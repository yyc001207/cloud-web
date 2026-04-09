<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const passwordVisible = ref(false)
const loading = ref(false)

const loginForm = reactive({
  userName: '',
  password: '',
})

const rules: FormRules = {
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

// 页面加载时检查是否已登录
onMounted(() => {
  authStore.initAuth()
  if (authStore.isAuthenticated) {
    router.push('/home')
  }
})

const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await authStore.login({
          userName: loginForm.userName,
          password: loginForm.password,
        })
        ElMessage.success('登录成功')
        router.push('/home')
      } catch (error: any) {
        const message = error.response?.data?.message || '登录失败，请检查用户名和密码'
        ElMessage.error(message)
      } finally {
        loading.value = false
      }
    }
  })
}

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}
</script>

<template>
  <div class="login-page">
    <main class="login-main">
      <!-- Left Side: Editorial Branding -->
      <div class="brand-section">
        <div class="brand-header">
          <div class="brand-logo">
            <span class="material-symbols-outlined logo-icon">cloud</span>
          </div>
          <h1 class="brand-name">云巢</h1>
        </div>

        <div class="brand-content">
          <h2 class="brand-title">
            展示您的<br />
            <span class="text-variant">数字圣殿。</span>
          </h2>
          <p class="brand-description">
            通过云巢安全门户访问您的个性化工作区和资源库。为专注而设计，为生产力而生。
          </p>
        </div>

        <div class="feature-cards">
          <div class="feature-card">
            <span class="material-symbols-outlined feature-icon"
              >auto_awesome</span
            >
            <p class="feature-title">智能筑巢</p>
            <p class="feature-desc">智能化的资源组织与管理。</p>
          </div>
          <div class="feature-card">
            <span class="material-symbols-outlined feature-icon">security</span>
            <p class="feature-title">纯净隐私</p>
            <p class="feature-desc">端到端加密存储，保障数据安全。</p>
          </div>
        </div>
      </div>

      <!-- Right Side: Login Card -->
      <div class="login-section">
        <div class="login-card glass-panel">
          <!-- Mobile Logo -->
          <div class="mobile-brand">
            <div class="mobile-brand-logo">
              <span class="material-symbols-outlined">cloud</span>
            </div>
            <span class="mobile-brand-name">云巢</span>
          </div>

          <div class="login-header">
            <h3 class="login-title">欢迎回来</h3>
            <p class="login-subtitle">请输入您的凭据以进入云巢。</p>
          </div>

          <el-form
            ref="formRef"
            :model="loginForm"
            :rules="rules"
            class="login-form"
            @submit.prevent="handleLogin"
          >
            <div class="form-group">
              <label class="form-label">用户名</label>
              <div class="input-wrapper">
                <span class="material-symbols-outlined input-icon">person</span>
                <el-form-item prop="userName" class="form-item">
                  <el-input
                    v-model="loginForm.userName"
                    placeholder="请输入用户名"
                    class="custom-input"
                    :disabled="loading"
                  />
                </el-form-item>
              </div>
            </div>

            <div class="form-group">
              <div class="label-row">
                <label class="form-label">密码</label>
              </div>
              <div class="input-wrapper">
                <span class="material-symbols-outlined input-icon">lock</span>
                <el-form-item prop="password" class="form-item">
                  <el-input
                    v-model="loginForm.password"
                    :type="passwordVisible ? 'text' : 'password'"
                    placeholder="请输入密码"
                    class="custom-input"
                    :disabled="loading"
                    @keyup.enter="handleLogin"
                  />
                </el-form-item>
                <span
                  class="material-symbols-outlined visibility-icon"
                  @click="togglePasswordVisibility"
                >
                  {{ passwordVisible ? 'visibility_off' : 'visibility' }}
                </span>
              </div>
            </div>
            <el-form-item class="submit-item">
              <button
                type="submit"
                class="login-button"
                :disabled="loading"
              >
                <span v-if="loading" class="loading-text">登录中...</span>
                <span v-else>登录云巢</span>
              </button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>

    <!-- Background Decorative Elements -->
    <div class="bg-decoration">
      <div class="bg-blob bg-blob-1"></div>
      <div class="bg-blob bg-blob-2"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background:
    radial-gradient(
      circle at 10% 10%,
      rgba(111, 230, 146, 0.05),
      transparent 50%
    ),
    radial-gradient(
      circle at 90% 90%,
      rgba(111, 230, 146, 0.03),
      transparent 50%
    );
  background-color: var(--surface);
  position: relative;
  overflow: hidden;
}

.login-main {
  width: 100%;
  max-width: 1400px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

// Brand Section
.brand-section {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 3rem 0;

  @media (max-width: 1024px) {
    display: none;
  }
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-logo {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(111, 230, 146, 0.3);

  .logo-icon {
    font-size: 2rem;
    color: var(--surface);
  }
}

.brand-name {
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  font-size: 2.25rem;
  color: var(--on-surface);
  letter-spacing: -0.02em;
}

.brand-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.brand-title {
  font-family: 'Manrope', sans-serif;
  font-size: 3.75rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--primary);

  .text-variant {
    color: var(--on-surface-variant);
  }
}

.brand-description {
  font-size: 1.25rem;
  color: var(--on-surface-variant);
  max-width: 500px;
  line-height: 1.6;
}

.feature-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding-top: 3rem;
}

.feature-card {
  padding: 2rem;
  border-radius: 1rem;
  background-color: var(--surface-container-low);
  border: 1px solid rgba(61, 74, 62, 0.1);
}

.feature-icon {
  font-size: 1.875rem;
  color: var(--primary);
  margin-bottom: 1rem;
}

.feature-title {
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--on-surface);
  margin-bottom: 0.5rem;
}

.feature-desc {
  font-size: 1rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
}

// Login Section
.login-section {
  display: flex;
  justify-content: flex-end;

  @media (max-width: 1024px) {
    justify-content: center;
  }
}

.login-card {
  width: 100%;
  max-width: 540px;
  padding: 2.5rem;
  border-radius: 1.5rem;

  @media (min-width: 1024px) {
    padding: 4rem;
  }
}

.mobile-brand {
  display: none;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    display: flex;
  }
}

.mobile-brand-logo {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;

  .material-symbols-outlined {
    font-size: 1.5rem;
    color: var(--surface);
  }
}

.mobile-brand-name {
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  font-size: 1.875rem;
  color: var(--on-surface);
}

.login-header {
  margin-bottom: 3rem;
  text-align: center;

  @media (min-width: 1024px) {
    text-align: left;
  }
}

.login-title {
  font-family: 'Manrope', sans-serif;
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 1rem;
}

.login-subtitle {
  font-size: 1rem;
  color: var(--on-surface-variant);
}

// Form Styles
.login-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--on-surface-variant);
  text-transform: uppercase;
  margin-left: 0.25rem;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.25rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  &:focus-within {
    .input-icon {
      color: var(--primary);
    }
  }
}

.input-icon {
  position: absolute;
  left: 1.25rem;
  font-size: 1.375rem;
  color: var(--on-surface-variant);
  transition: color 0.2s;
  z-index: 1;
}

.visibility-icon {
  position: absolute;
  right: 1.25rem;
  font-size: 1.375rem;
  color: var(--on-surface-variant);
  cursor: pointer;
  transition: color 0.2s;
  z-index: 1;

  &:hover {
    color: var(--on-surface);
  }
}

.form-item {
  width: 100%;
  margin-bottom: 0;
}

:deep(.custom-input) {
  .el-input__wrapper {
    background-color: #0e0e0e;
    border: none;
    border-radius: 1rem;
    padding: 1.25rem 1.25rem 1.25rem 3.5rem;
    box-shadow: none;

    &.is-focus {
      box-shadow: 0 0 0 2px rgba(111, 230, 146, 0.3);
    }
  }

  .el-input__inner {
    color: var(--on-surface);
    font-size: 1rem;

    &::placeholder {
      color: rgba(187, 203, 187, 0.2);
    }
  }

  &.has-suffix {
    .el-input__wrapper {
      padding-right: 3rem;
    }
  }
}

.submit-item {
  margin-bottom: 0;
  padding-top: 0.5rem;
}

.login-button {
  width: 100%;
  padding: 1.25rem;
  background-color: var(--primary);
  color: #003919;
  font-family: 'Manrope', sans-serif;
  font-weight: 800;
  font-size: 1.125rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(111, 230, 146, 0.2);
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    box-shadow: 0 16px 32px rgba(111, 230, 146, 0.3);
    transform: scale(1.01);
  }

  &:active:not(:disabled) {
    transform: scale(0.99);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.loading-text {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

// Background Decoration
.bg-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.bg-blob {
  position: absolute;
  border-radius: 50%;
  background: rgba(111, 230, 146, 0.05);
  filter: blur(160px);
}

.bg-blob-1 {
  width: 800px;
  height: 800px;
  top: -160px;
  left: -160px;
}

.bg-blob-2 {
  width: 600px;
  height: 600px;
  bottom: -160px;
  right: -160px;
  filter: blur(140px);
}
</style>
