# mottainai-no
Apps for もったいないNO

# 開発方法

必要なもの

* Node.js(stable)
* yarn

## 開発サーバの起動

```
yarn dev
```

## ソースコードのビルド

```
yarn build
```

`js/script.js`は自動生成されるファイルです。[src/index.js](src/index.js)がエントリーポイントとなっています。
ウェブページに反映したい場合のみ、`yarn build`を実行し、`js/script.js`をコミットしてください。
