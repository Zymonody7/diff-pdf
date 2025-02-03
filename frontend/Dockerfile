# 使用 Node.js 作为基础镜像
FROM node:20 AS build

WORKDIR /src/app

# 复制 package.json 和 package-lock.json，并安装依赖
COPY package*.json ./
RUN npm install

# 复制应用源码
COPY . .

# 构建 Next.js 项目
RUN npm run build

# 使用 Nginx 作为静态资源服务器
FROM nginx:alpine

# 复制构建后的 Next.js 项目到 Nginx 服务目录
COPY --from=build /src/app/.next /usr/share/nginx/html
COPY --from=build /src/app/public /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
