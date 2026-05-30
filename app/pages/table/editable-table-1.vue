<template>
  <html lang="ja">
    <head>
      <meta charset="UTF-8" />
    </head>
    <body>
      <table>
        <thead>
          <tr>
            <th>項目</th>
            <th>内容（編集可能）</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>名前</td>
            <td contenteditable="true">クリックして編集</td>
          </tr>
          <tr>
            <td>ステータス</td>
            <td contenteditable="true">進行中</td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
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
/* 編集可能なセルがわかりやすいように背景色を変える */
td[contenteditable='true'] {
  background-color: #f9f9f9;
  cursor: text;
}
td[contenteditable='true']:hover {
  background-color: #e9e9e9;
}
</style>
