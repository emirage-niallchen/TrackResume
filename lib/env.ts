import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * 环境变量集中管理与类型安全配置
 *
 * 官方推荐做法的几个关键点：
 * - 所有用到的环境变量集中在一个文件中维护（单一来源）
 * - 使用 `server` / `client` 分组，区分仅服务端和需要暴露到客户端的变量
 * - 在应用启动（build/dev）阶段做校验，避免运行时才发现配置错误
 * - 通过 `runtimeEnv` 显式映射到 `process.env`，保证类型安全
 *
 * t3-env 本身就是基于 Zod 的轻量封装，用来做“环境变量校验 + 类型推导”，
 * 这是它的官方/主流用法，不在业务代码里滥用 Zod，而是只在配置边界做一次校验。
 */
export const env = createEnv({
  /**
   * 服务端环境变量：
   *  - 永远不会被发送到浏览器
   *  - 适合放数据库连接串、密钥、第三方服务凭证等
   */
  server: {
    // 数据库 & 认证（项目已有）
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(1),

    /**
     * AWS / S3 对象存储配置
     *
     * 官方/社区常见实践：
     * - 凭证可以来自环境变量，也可以来自实例角色/容器角色，因此 accessKey/secret 可选
     * - 区域与 Bucket 通常是必填，否则根本无法工作
     * - endpoint 多用于兼容 S3 协议的对象存储（如 MinIO、阿里云等），因此设为可选
     */
    AWS_REGION: z.string().min(1),
    AWS_S3_BUCKET_NAME: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1).optional(),
    AWS_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    AWS_S3_ENDPOINT: z.string().url().optional(),

    // 运行环境
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },

  /**
   * 客户端环境变量：
   *  - 只有以 `NEXT_PUBLIC_` 开头的变量才可以放这里
   *  - 当前项目暂时不需要对外暴露 S3 / AWS 配置信息，所以保持为空
   */
  client: {
    // 例如：NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  },

  /**
   * 映射真实的 `process.env`。
   *
   * 注意：
   * - 不要在这里做额外逻辑，只做“简单映射”
   * - 任何缺失/错误会在应用启动时被抛出，方便尽早发现问题
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

    AWS_REGION: process.env.AWS_REGION,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT,

    NODE_ENV: process.env.NODE_ENV,
  },

  /**
   * 在 Docker 构建等场景下，有时会希望跳过严格校验，
   * 可通过设置 `SKIP_ENV_VALIDATION=1` 实现。
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * 让空字符串自动视为 `undefined`，
   * 避免 `VAR=''` 这种情况通过校验但实际不可用。
   */
  emptyStringAsUndefined: true,
});

 