<template>
  <div class="head">
    <div class="item">
      亦枫<span class="heart" @click.stop="handleClickHeart" title="😘">❤</span
      >芋泥
    </div>
    <div class="item" title="2024年9月3日">———&nbsp;{{ subTitle }}</div>
  </div>
  <StarsScene
    ref="starSceneRef"
    v-if="!visible"
    @change-sub-title="handleChangeSubTitle"
  />
  <StarDialog
    v-model:visible="visible"
    back-filter
    show-content-img
    btn-text="嗯呐"
    >⭐准备好了嘛⭐</StarDialog
  >
  <audio ref="audioRef" src="/bg-music.ogg" loop autoplay></audio>
</template>

<script lang="ts" setup>
import { ref, shallowRef, watch } from "vue";
import StarsScene from "@/views/StarsScene.vue";
import StarDialog from "@/components/StarDialog.vue";

const visible = ref(true);
const audioRef = shallowRef();
const subTitle = ref("致我们的四周年q(≧▽≦q)");
watch(visible, (val) => {
  if (!val) {
    audioRef.value.play().catch((err: any) => {
      console.error(err);
    });
  }
});

const starSceneRef = shallowRef<InstanceType<typeof StarsScene>>();
const handleClickHeart = () => {
  const initedPosition = starSceneRef.value?.getInitPositionTweeenFinished();
  if (!initedPosition) {
    return;
  }
  starSceneRef.value?.toBeLove();
};
const handleChangeSubTitle = () => {
  subTitle.value = "520句情话送给我最爱的人🌹🌹🌹";
};
</script>

<style>
.head {
  width: 100%;
  height: 10vh;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.head .item {
  flex: 1 0 auto;
  overflow: hidden;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.head .item:first-child {
  text-shadow: 2px 2px #fb1b1b;
}
.head .item:last-child {
  font-size: 20px;
}
.head .heart {
  cursor: pointer;
}
</style>
