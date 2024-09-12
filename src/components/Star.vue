<template>
  <div
    :id="`star-${uuid}`"
    class="star"
    :style="starStyle"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <img class="star-img" :src="StarSvg" />
    <div class="content">{{ uuid }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import StarSvg from "@/assets/pink-star.svg";

interface Props {
  uuid: string;
  size?: number;
  word: string;
}
const props = withDefaults(defineProps<Props>(), {
  size: 20,
});
const emit = defineEmits<{
  (e: "hoverStar", data: any): void;
  (e: "leaveStar", data: any): void;
  (e: "clickStar", data: any): void;
}>();

let gsapInsance: gsap.core.Tween | null = null;
const starStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}));

const handleMouseOver = () => {
  emit("hoverStar", { id: props.uuid });
};
const handleMouseLeave = () => {
  emit("leaveStar", { id: props.uuid });
};

const handleClick = () => {
  const data = {
    id: props.uuid,
    size: props.size,
    word: props.word,
    gsapParam: {
      x: window.innerWidth / 2 - props.size / 2,
      y: window.innerHeight / 2 - props.size / 2,
      scale: 5,
      duration: 1,
      zIndex: 999,
      onComplete: () => {
        // 可以在这里添加更多内容，比如弹出一个模态框或显示更多信息
      },
    },
    pause() {
      gsapInsance?.pause();
    },
    resume() {
      gsapInsance?.resume();
    },
  };
  emit("clickStar", data);
  //   gsap.to(".star", {
  //     x: window.innerWidth / 2 - props.size / 2,
  //     y: window.innerHeight / 2 - props.size / 2,
  //     scale: 5,
  //     duration: 1,
  //     onComplete: () => {
  //       // 可以在这里添加更多内容，比如弹出一个模态框或显示更多信息
  //     },
  //   });
};
const starUrl = computed(() => `url('${StarSvg}')`);
onMounted(() => {
  // 自旋转（加重性能开销）
  // gsapInsance = gsap.to(`#star-${props.uuid}`, {
  //   rotation: 360,
  //   repeat: -1,
  //   duration: (Math.random() * 5 + 15).toFixed(1),
  //   yoyo: true,
  //   delay: (Math.random() * 1).toFixed(1),
  // });
});
</script>

<style scoped>
.star {
  opacity: 0;
  position: absolute;
  background-image: v-bind(starUrl);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: contain;
  pointer-events: all;
  transition: transform 0.3s ease;
  will-change: transform;
  transform-origin: center center;
  cursor: pointer;
}
.star:hover .star-img {
  transform: scale(1.5);
}
.star .content {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  top: 0;
  left: 0;
}
.star .star-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0px 0px 4px);
  animation: shadow-animation 1.8s infinite reverse linear;
  transition: transform .1s ease;
}
@keyframes shadow-animation {
  0% {
    filter: drop-shadow(0px 0px 2px);
  }
  50% {
    filter: drop-shadow(0px 0px 5px);
  }
  100% {
    filter: drop-shadow(0px 0px 2px);
  }
}
</style>
