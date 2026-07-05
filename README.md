# Skynote

心情 + 天气 + 私人短记手机 App 原型，当前重点是完善本地记录功能。

## 下载 APK

安卓测试包：[`release/skynote-debug.apk`](https://github.com/joker-make/Skynote/raw/main/release/skynote-debug.apk)

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://127.0.0.1:5173/`。

## 开发者打包

```bash
npm run build
npm run preview
```

如需后续发布为 PWA 或 Android 包，再单独执行对应打包流程；当前应用内不展示安装或下载入口。

## 当前能力

- 一天可保存多条记录，每条记录都有自己的心情、天气、温度和标签。
- 自动天气使用 Open-Meteo 实时天气接口；有定位权限时按当前位置请求，没有权限时回退上海坐标。
- 每种心情有多条激励语，可在记录页切换。
- 回顾页会显示同一天的多条记录数量。
- 设置页可清除本地记录；详情页可删除单条记录。
