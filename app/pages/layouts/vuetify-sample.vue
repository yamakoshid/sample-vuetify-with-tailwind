<template>
  <!-- tailwindcssとの同時使用のせいでv-containerのパディングが消えてる?
    - elevation
        - classにelevation-0などがある。
    - valiant=outlinedなど
        - borderでやれ?
    - height
        - OK
    -->
  <v-container>
    <div class="text-h6 mt-2">共通</div>
    <span>幅(width)の指定は有効</span><br />

    <div class="text-h6 mt-2">div</div>
    <div
      class="rounded-lg bg-black"
      elevation="3"
      height="200px"
      max-width="500px"
    >
      <span>height 指定は無視される</span><br />
      <span>max-width 指定は無視される</span><br />
      <span>デフォルトでpaddingが設定されていない</span><br />
      <span>影(elevation)の指定ができない</span><br />
      <span>背景色、文字色の指定は class で行う</span><br />
      <span>角(rounded)の指定は有効</span><br />
    </div>

    <div class="text-h6 mt-2">div with style</div>
    <div
      class="rounded-lg bg-black"
      elevation="3"
      style="height: 200px; max-width: 500px"
    >
      <span>styleにheightを入れれば使える</span><br />
      <span>styleにmax-widthを入れれば使える</span><br />
      <span>デフォルトでpaddingが設定されていない</span><br />
      <span>影(elevation)の指定ができない</span><br />
      <span>背景色、文字色の指定は class で行う</span><br />
      <span>角(rounded)の指定は有効</span><br />
    </div>

    <div class="text-h6 mt-2">v-container</div>
    <v-container
      class="bg-green-lighten-3 rounded-lg"
      elevation="3"
      height="200px"
      max-width="500px"
    >
      <span>height 指定は無視される</span><br />
      <span>max-width 指定は無視される</span><br />
      <span>デフォルトでpaddingが設定されている</span><br />
      <span>影(elevation) の指定ができない</span><br />
      <span>背景色、文字色の指定は class で行う</span><br />
      <span>角(rounded)の指定は有効</span><br />
    </v-container>

    <div class="text-h6 mt-2">v-sheet</div>
    <v-sheet
      class="bg-red-lighten-3 rounded-lg"
      elevation="3"
      height="200px"
      max-width="500px"
    >
      <span>height 指定は有効</span><br />
      <span>max-width 指定は有効</span><br />
      <span>デフォルトでpaddingが設定されていない</span><br />
      <span>影(elevation) の指定ができる</span><br />
      <span>背景色、文字色の指定は class で行う</span><br />
      <span>角(rounded)の指定は有効</span><br />
    </v-sheet>

    <div class="text-h6 mt-2">v-card</div>
    <v-card color="blue-lighten-3" height="200px" max-width="500px" tonal>
      <span>height 指定は有効</span><br />
      <span>max-width 指定は有効</span><br />
      <span>デフォルトでpaddingが設定されていない</span><br />
      <span>色の指定は <b>color</b> で行う（背景色、文字色は自動で決まる）</span
      ><br />
      <span>影(elevation)の指定はできるが variant と競合することがある</span
      ><br />
      <span>角(rounded)は指定はできるが variant と競合することがある</span
      ><br />
    </v-card>
  </v-container>
</template>
