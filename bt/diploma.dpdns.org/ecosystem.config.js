module.exports = {
  apps: [{
    name: "zhengshu",
    script: "./src/server/server.js", // 您的主服务器文件路径
    watch: false,
    instances: 1,
    autorestart: true,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "development",
      PORT: 5000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 5000,
      MONGODB_URI: "mongodb+srv://shanunfghfd5236:xtqzwumgzBBhcdBq@cluster0.qkwys0c.mongodb.net/global-horizon-university?retryWrites=true&w=majority&appName=Cluster0",
      JWT_SECRET: "e8f56b7a3d12c94f7e6a5b9d0c82e1f4a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6",
      JWT_EXPIRE: "30d",
      CERTIFICATE_STORAGE_PATH: "src/server/certificates",
      FRONTEND_URL: "https://diploma.dpdns.org",
      STRIPE_SECRET_KEY: "sk_test_51RR07Z2YFyKMGIWENbk0SdTYgRZT2NVnQUPC7av14UanouJilxG8GM8sD1DbMSNJkE3BIx70q2zeMi890uyumhlN00e5C8GdkX",
      STRIPE_WEBHOOK_SECRET: "whsec_qIIOW4ZTn39nS6AE5hKRykGOYktmRSU9"
    }
  }]
};