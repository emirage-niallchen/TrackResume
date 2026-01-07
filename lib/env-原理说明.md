# 环境变量读取原理详解

## 整体流程概览

```
.env 文件 / 系统环境变量 / Docker环境变量
    ↓
Next.js 自动加载到 process.env
    ↓
lib/env.ts 中的 runtimeEnv 映射
    ↓
createEnv() 函数执行校验
    ↓
返回类型安全的 env 对象
```

## 第一步：Next.js 如何加载环境变量

Next.js 内置了环境变量加载机制，**无需手动安装 dotenv**。启动时会按以下顺序加载：

1. **`.env.local`** (优先级最高，本地开发用，通常加入 .gitignore)
2. **`.env.development`** / **`.env.production`** (根据 NODE_ENV 加载)
3. **`.env`** (通用配置)
4. **系统环境变量** (如 Docker、Vercel 等平台设置的环境变量)

**关键点**：
- Next.js 在启动时（`next dev` / `next build`）会自动读取这些文件
- 读取后填充到 `process.env` 对象中
- 所有值都是**字符串类型**（即使你写的是数字）

## 第二步：process.env 是什么

`process.env` 是 Node.js 的全局对象，存储所有环境变量：

```javascript
// 例如 .env 文件中有：
// MYSQL_DATABASE_URL=mysql://user:pass@localhost:3306/db

// 在代码中可以直接访问：
console.log(process.env.MYSQL_DATABASE_URL);
// 输出: "mysql://user:pass@localhost:3306/db"
```

**问题**：
- `process.env` 的类型是 `NodeJS.ProcessEnv`，所有值都是 `string | undefined`
- 没有类型提示，容易写错变量名
- 没有校验，缺失变量要到运行时才发现

## 第三步：runtimeEnv 的作用

在 `lib/env.ts` 中，`runtimeEnv` 的作用是**显式映射**：

```typescript
runtimeEnv: {
  MYSQL_DATABASE_URL: process.env.MYSQL_DATABASE_URL,
  AWS_REGION: process.env.AWS_REGION,
  // ...
}
```

**为什么需要显式映射？**
1. **类型安全**：告诉 TypeScript 哪些变量是我们需要的
2. **明确依赖**：一眼看出代码依赖哪些环境变量
3. **避免魔法字符串**：不会因为拼写错误导致 bug

## 第四步：createEnv() 函数做了什么

`createEnv()` 是 `@t3-oss/env-nextjs` 提供的函数，内部执行以下步骤：

### 4.1 合并 server 和 client 配置

```typescript
// 内部逻辑（简化版）
const allServerVars = { ...server, ...client };
```

### 4.2 使用 Zod Schema 校验

```typescript
// 对于每个变量，执行类似这样的校验：
const schema = z.string().min(1); // 例如 MYSQL_DATABASE_URL
const value = runtimeEnv.MYSQL_DATABASE_URL;
const validatedValue = schema.parse(value); // 如果失败会抛出错误
```

**校验时机**：
- ✅ **开发模式** (`next dev`)：启动时校验
- ✅ **构建模式** (`next build`)：构建时校验
- ❌ **生产运行** (`next start`)：不校验（因为构建时已经校验过了）

### 4.3 处理空字符串

如果设置了 `emptyStringAsUndefined: true`：

```typescript
// .env 文件中：AWS_S3_ENDPOINT=
// 处理前：process.env.AWS_S3_ENDPOINT = ""
// 处理后：runtimeEnv.AWS_S3_ENDPOINT = undefined
```

### 4.4 生成类型安全的返回值

```typescript
// createEnv 返回的对象类型是：
{
  MYSQL_DATABASE_URL: string;  // 不是 string | undefined
  AWS_REGION: string;
  AWS_ACCESS_KEY_ID?: string;  // optional 的才是可选的
  // ...
}
```

## 完整示例流程

假设 `.env` 文件内容：
```bash
MYSQL_DATABASE_URL=mysql://user:pass@localhost:3306/db
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=my-bucket
```

### 执行流程：

1. **Next.js 启动** → 读取 `.env` → 填充 `process.env`
   ```javascript
   process.env.MYSQL_DATABASE_URL = "mysql://user:pass@localhost:3306/db"
   process.env.AWS_REGION = "us-east-1"
   process.env.AWS_S3_BUCKET_NAME = "my-bucket"
   ```

2. **导入 lib/env.ts** → 执行 `createEnv()`
   ```typescript
   runtimeEnv.MYSQL_DATABASE_URL = process.env.MYSQL_DATABASE_URL
   // = "mysql://user:pass@localhost:3306/db"
   ```

3. **Zod 校验**
   ```typescript
   z.string().min(1).parse("mysql://user:pass@localhost:3306/db")
   // ✅ 通过，返回字符串
   ```

4. **返回 env 对象**
   ```typescript
   export const env = {
     MYSQL_DATABASE_URL: "mysql://user:pass@localhost:3306/db",
     AWS_REGION: "us-east-1",
     AWS_S3_BUCKET_NAME: "my-bucket",
     // ...
   }
   ```

5. **在代码中使用**
   ```typescript
   import { env } from "@/lib/env";
   
   // ✅ 有类型提示
   // ✅ 如果缺失会立即报错（启动时）
   const dbUrl = env.MYSQL_DATABASE_URL;
   ```

## 常见问题

### Q: 为什么需要 runtimeEnv，直接用 process.env 不行吗？

**A**: 可以，但会失去：
- ❌ 类型安全（所有值都是 `string | undefined`）
- ❌ 启动时校验（缺失变量要到运行时才发现）
- ❌ 明确的依赖关系（不知道代码需要哪些环境变量）

### Q: 如果环境变量缺失会怎样？

**A**: 
- **开发/构建时**：立即抛出错误，阻止应用启动
- **生产运行时**：不会校验（因为构建时已经校验过了）

### Q: Docker 环境变量如何传递？

**A**: Docker 容器启动时，`docker-compose.yml` 中的 `environment:` 会直接设置到容器的 `process.env`，Next.js 会自动读取。

### Q: 为什么 client 变量需要 NEXT_PUBLIC_ 前缀？

**A**: Next.js 的安全机制。只有 `NEXT_PUBLIC_` 开头的变量才会被打包到客户端代码中，防止敏感信息泄露到浏览器。

## 总结

**核心原理**：
1. Next.js 自动加载 `.env` → `process.env`
2. `runtimeEnv` 显式映射需要的变量
3. `createEnv()` 用 Zod 校验并生成类型安全的对象
4. 校验在启动/构建时完成，运行时直接使用

**优势**：
- ✅ 类型安全
- ✅ 启动时发现配置错误
- ✅ 明确的依赖关系
- ✅ 符合 Next.js 官方推荐实践

