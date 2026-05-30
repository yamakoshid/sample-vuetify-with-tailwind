<script setup>
import { ref } from 'vue'

// 1. リアクティブなテーブルデータを用意
const tableData = ref([
  { id: 1, item: '名前', content: 'クリックして編集' },
  { id: 2, item: 'ステータス', content: '進行中' },
])

// 2. 編集が終わったら（フォーカスが外れたら）データを更新する関数
function updateContent(index, event) {
  tableData.value[index].content = event.target.innerText
}
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>項目</th>
        <th>内容（編集可能）</th>
      </tr>
    </thead>
    <tbody>
      <!-- v-forで配列をループ処理 -->
      <tr v-for="(row, index) in tableData" :key="row.id">
        <td>{{ row.item }}</td>
        <!-- 編集可能にして、フォーカスアウト時に反映 -->
        <td
          class="editable-cell"
          contenteditable="true"
          @blur="updateContent(index, $event)"
        >
          {{ row.content }}
        </td>
      </tr>
    </tbody>
  </table>

  <!-- データがリアルタイムに連動しているか確認用 -->
  <pre>{{ tableData }}</pre>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}
.editable-cell {
  background-color: #f9f9f9;
  cursor: text;
}
.editable-cell:hover {
  background-color: #e9e9e9;
}
</style>
