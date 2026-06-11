# GitHub 推送指南

本指南记录将项目代码推送到 GitHub 的完整流程，适用于 Windows + 代理环境。

---

## 环境信息

- **代理工具**：平行线路（HTTP 代理端口 7890）
- **GitHub 用户名**：xbacklyx
- **默认分支**：main

---

## 一、首次推送（新项目）

### 1. 在 GitHub 创建仓库

打开 [github.com/new](https://github.com/new)，填写仓库名，**不要勾选** "Add a README file"，点创建。

### 2. 配置 Git 身份（仅第一次）

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

### 3. 初始化并推送

```bash
# 进入项目目录
cd 你的项目文件夹

# 初始化 Git（只在全新项目第一次推送前执行一次，目的是在项目文件夹里生成一个隐藏的 .git
  目录，之后所有的提交记录、远程地址等信息都存在里面。一旦 .git
  目录存在，就不需要再执行 git init 了）
git init

# 添加所有文件
git add -A

# 提交
git commit -m "初始化"

# 关联远程仓库（换成你自己的仓库地址）
git remote add origin https://github.com/你的用户名/仓库名.git

# 推送（首次需要 -u 绑定）
git push -u origin main
```

---

## 二、后续修改推送

```bash
git add -A
git commit -m "描述你改了什么"
git push
```

---

## 三、代理配置（解决国内无法访问 GitHub）

```bash
# 设置代理（端口改成你自己代理工具的端口）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 查看当前代理配置
git config --global --get http.proxy

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

> **注意**：此配置是全局的（`--global`），影响本机所有 Git 项目。如果换代理工具或端口变了，需要重新设置。

---

## 四、常见问题

### Q: 提示 "src refspec master does not match any"

**原因**：你的默认分支是 `main`，不是 `master`。

**解决**：把命令中的 `master` 换成 `main`。

```bash
git push -u origin main
```

### Q: 提示 "Connection timed out"

**原因**：命令行 Git 没有走代理。

**解决**：按第三章配置代理。

### Q: 查看当前分支

```bash
git branch
```

---

## 五、命令速查

| 命令 | 作用 |
|------|------|
| `git init` | 初始化 Git 仓库 |
| `git add -A` | 添加所有修改 |
| `git commit -m "..."` | 提交并写说明 |
| `git push` | 推送到 GitHub |
| `git push -u origin main` | 首次推送并绑定分支 |
| `git remote -v` | 查看远程仓库地址 |
| `git remote set-url origin 新地址` | 修改远程仓库地址 |
| `git status` | 查看当前状态 |
| `git log --oneline` | 查看提交记录 |
| `git branch` | 查看当前分支 |
