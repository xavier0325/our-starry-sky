<template>
  <div id="stars-container" :style="{ opacity: canShowStar ? '1' : '0' }">
    <Star
      v-for="star in stars"
      :key="star.id"
      :uuid="star.id"
      :size="star.size"
      :word="star.word"
      :style="{ transition: canShowStar ? '' : 'none' }"
      @hoverStar="handleHoverStar"
      @clickStar="handleClickStar"
    />
    <div ref="centerTextRef" class="centerText"></div>
    <StarDialog v-model:visible="dlgVisible">
      {{ activeStar.word }}
    </StarDialog>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, shallowRef, watch } from "vue";
import Star from "@/components/Star.vue";
import StarDialog from "@/components/StarDialog.vue";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import loveWords from "@/assets/520-love-words.txt?raw";
import { deBounce, heartShape } from "@/utils";

const emit = defineEmits<{
  (e: "changeSubTitle"): void;
}>();

gsap.registerPlugin(TextPlugin);
const wordsArr = loveWords
  .split("\n")
  .map((str) => str.trim().replace(/(。)$/, ""));
const stars = Array.from({ length: 520 }, (_, i) => {
  const size = +(Math.random() * 5 + 30).toFixed(1); // 随机大小
  return {
    id: i + "",
    x: (Math.random() * 85 + 5).toFixed(2) + "vw", // 屏幕宽度的百分比
    y: (Math.random() * 81).toFixed(2) + "vh", // 屏幕高度的百分比
    size,
    word: wordsArr[i],
  };
});
const centerTextRef = shallowRef<HTMLElement>();

let curClickStar: any = null;
const dlgVisible = ref(false);
const activeStar = reactive({
  word: "",
});
let zIndex = 1;
const winInnerWidth = ref(window.innerWidth);
const winInnerHeight = ref(window.innerHeight);

const centerTextState = reactive({
  index: 0,
});
const curCenterText = computed(() => wordsArr[centerTextState.index]);
let setTextTweenFlag = false;
const setTextTween = () => {
  setTextTweenFlag = true;
  gsap.to(".centerText", {
    duration: 2,
    text: curCenterText.value,
    delay: 1,
    onComplete() {
      centerTextState.index =
        centerTextState.index < wordsArr.length - 1
          ? centerTextState.index + 1
          : 0;
      setTimeout(() => {
        gsap.set(".centerText", {
          text: "",
          onComplete() {
            setTextTween();
          },
        });
      }, 1000);
    },
  });
};

let tween: gsap.core.Tween | null = null;
/** 设置爱心*/
const setLoveTeewn = (paused = true) => {
  tween = gsap.set(".star", {
    duration: 1.5,
    stagger: {
      each: 0.04,
      from: "random",
      repeat: 0,
      yoyo: false,
      ease: "none",
    },
    x(index) {
      const { x } = heartPoints[index];
      return winInnerWidth.value / 2 + +x * 12 - 16 + "px";
    },
    y(index) {
      const { y } = heartPoints[index];
      return winInnerHeight.value / 3 + +y * 15 + "px";
    },
    paused,
    onComplete() {
      const { width } = centerTextRef.value!.getBoundingClientRect();
      gsap.set(".centerText", {
        x: winInnerWidth.value / 2 - width / 2 + "px",
        y: winInnerHeight.value - 250 + "px",
        opacity: 1,
        duration: 1,
        repeat: 0,
        onComplete() {
          if (setTextTweenFlag) {
            return;
          }
          setTextTween();
        },
      });
    },
  });
};
const canShowStar = ref(false);
let initPositionNum = ref(0);
onMounted(() => {
  gsap.set(".star", {
    x: "50vw",
    y: "50vh",
    opacity: 1,
    onComplete() {
      setTimeout(() => {
        canShowStar.value = true;
        // 初始化星星位置
        stars.forEach((star) => {
          const _id = `#star-${star.id}`;
          gsap.to(_id, {
            x: star.x,
            y: star.y,
            duration: 2.5,
            delay: (Math.random() * 2).toFixed(2),
            onComplete() {
              initPositionNum.value++;
            },
          });
          // blinkAnimations[_id] = gsap.to(_id, {
          //   // scale: (Math.random() * 1.5 + 0.5).toFixed(1),
          //   repeat: -1,
          //   duration: 2,
          //   yoyo: true,
          //   delay: (Math.random() * 2).toFixed(1),
          // });
        });
      });
    },
  });
  setLoveTeewn();
  window.addEventListener(
    "resize",
    deBounce(() => {
      winInnerWidth.value = window.innerWidth;
      winInnerHeight.value = window.innerHeight;
      tween?.pause();
      const { width } = centerTextRef.value!.getBoundingClientRect();
      gsap.set(".centerText", {
        x: winInnerWidth.value / 2 - width / 2 + "px",
        y: winInnerHeight.value - 200 + "px",
      });
      setLoveTeewn(false);
    }, 200)
  );
});
/** 悬浮星星 */
const handleHoverStar = (data: { id: string }) => {
  const _id = `#star-${data.id}`;
  // curblinkStar = blinkAnimations[_id];
  // curblinkStar.pause();
  gsap.to(_id, {
    zIndex: ++zIndex,
  });
};

let clickResume: Function | null = null;
/** 点击星星 */
const handleClickStar = (data: {
  id: string;
  size: number;
  word: string;
  pause: Function;
  resume: Function;
}) => {
  const _id = `#star-${data.id}`;
  data.pause();
  clickResume = data.resume;
  curClickStar = gsap.to(_id, {
    x: window.innerWidth / 2 - data.size / 2,
    y: window.innerHeight / 2 - data.size / 2,
    scale: 9,
    opacity: 0,
    duration: 0.8,
    zIndex: 99999999999,
    onComplete: () => {
      activeStar.word = data.word;
      dlgVisible.value = true;
    },
  });
};
watch(
  () => dlgVisible.value,
  (val) => {
    if (!val) {
      curClickStar.reverse();
      // curblinkStar.resume();
      clickResume && clickResume();
    }
  }
);

const heartPoints = Array.from({ length: 520 }, (_, i) => {
  const t = (i / 520) * Math.PI * 2;
  const { x, y } = heartShape(t);
  return {
    x: x.toFixed(2),
    y: y.toFixed(2),
  };
});
const canReverse = ref(false);
const toBeLove = () => {
  if (canReverse.value) {
    tween?.reverse();
    if (setTextTweenFlag) {
      emit("changeSubTitle");
    }
    canReverse.value = false;
  } else {
    tween?.play();
    canReverse.value = true;
  }
};
const getInitPositionTweeenFinished = () => initPositionNum.value === 520;
defineExpose({
  toBeLove,
  getInitPositionTweeenFinished,
});
</script>
<style scoped>
#stars-container {
  position: fixed;
  top: 10vh;
  left: 0;
  width: 100vw;
  height: 90vh;
  /* pointer-events: none; */
  display: flex;
}
.centerText {
  opacity: 0;
  width: 60vw;
  height: fit-content;
  position: absolute;
  font-size: 28px;
  /* color: pink;  */
  text-align: center;
  /* 创建一个从左到右的线性渐变色 */
  background: linear-gradient(
    115deg,
    #4fcf70,
    #fad648,
    #a767e5,
    #12bcfe,
    #44ce7b
  );
  /* 将文字设置为透明，以显示背景渐变色 */
  color: transparent;
  /* 使用背景渐变色来实现文字的效果 */
  -webkit-background-clip: text;
  background-clip: text;
}
.centerText .char {
  opacity: 0;
}
</style>
