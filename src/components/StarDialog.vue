<template>
  <teleport to="body">
    <div
      v-show="show"
      class="dialog-overlay"
      :class="{ 'back-filter': backFilter }"
    >
      <div class="dialog">
        <div class="dialog-content">
          <div class="main">
            <img id="dlg-img" :src="StarSvg" alt="star" />
            <div
              class="main-content"
              :style="{ width: showContentImg ? '60%' : '' }"
            >
              <slot />
              <img v-if="showContentImg" class="content-img" :src="Pikaqiu" />
            </div>
          </div>
          <div class="dialog-footer">
            <div class="dialog-button" @click="show = false">{{ btnText }}</div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script setup lang="ts">
import { computed, onMounted } from "vue";
import StarSvg from "@/assets/pink-star.svg";
import Pikaqiu from "@/assets/pikaqiu.png";

interface Props {
  visible: boolean;
  backFilter?: boolean;
  btnText?: string;
  showContentImg?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  backFilter: false,
  showContentImg: false,
  btnText: "知道啦",
});
const emit = defineEmits<{
  (e: "update:visible", val: boolean): void;
}>();
const show = computed({
  get: () => props.visible,
  set(val) {
    emit("update:visible", val);
  },
});
onMounted(() => {});
</script>
<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
}
.dialog-overlay.back-filter {
  backdrop-filter: blur(3.5px);
}
.dialog {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
}
.dialog-content {
  width: 60vw;
  height: 60vh;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}
.dialog-content .main {
  width: 100%;
  height: 100%;
  flex: 1 0 auto;
  display: flex;
  position: relative;
}
.dialog-content #dlg-img {
  width: 100%;
  height: 100%;
  animation: shadow-animation 2.5s infinite reverse linear;
  object-fit: contain;
  user-select: none;
}
.dialog-content .main .main-content {
  width: 50%;
  height: 60%;
  position: absolute;
  top: calc(50% + 20px);
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #001833;
  font-weight: bold;
  overflow: auto;
  font-size: 27px;
}
.dialog-content .main .main-content .content-img {
  width: 100%;
  height: 30%;
  object-fit: contain;
  user-select: none;
}
@media screen and (max-width: 600px) {
  .dialog-content .main .main-content {
    height: 40%;
    font-size: 16px;
  }
  .dialog-content .dialog-footer .dialog-button {
    padding: 2px 14px;
    font-size: 16px;
  }
}
@keyframes shadow-animation {
  0% {
    filter: drop-shadow(0px 0px 7px);
  }
  50% {
    filter: drop-shadow(0px 0px 15px);
  }
  100% {
    filter: drop-shadow(0px 0px 7px);
  }
}
.dialog-footer {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog-footer .dialog-button {
  width: auto;
  padding: 2px 24px;
  font-size: 28px;
  background-color: #ddd;
  border-radius: 100px;
  border: 3px solid pink;
  box-shadow: 0 0 12px #ddd;
  color: #001833;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.dialog-button:hover,
.dialog-button:active {
  box-shadow: 0 0 20px #ddd;
}
</style>
