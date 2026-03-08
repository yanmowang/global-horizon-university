PATH=/www/server/nodejs/v16.9.0/bin:/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:~/bin
export PATH

export PORT=5000
export MONGODB_URI=mongodb+srv://shanunfghfd5236:xtqzwumgzBBhcdBq@cluster0.qkwys0c.mongodb.net/global-horizon-university?retryWrites=true&w=majority&appName=Cluster0
export JWT_SECRET=e8f56b7a3d12c94f7e6a5b9d0c82e1f4a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6
export JWT_EXPIRE=30d
export CERTIFICATE_STORAGE_PATH=src/server/certificates
export NODE_ENV=production
export FRONTEND_URL=https://diploma.dpdns.org
export STRIPE_SECRET_KEY=sk_test_51RR07Z2YFyKMGIWENbk0SdTYgRZT2NVnQUPC7av14UanouJilxG8GM8sD1DbMSNJkE3BIx70q2zeMi890uyumhlN00e5C8GdkX
export STRIPE_WEBHOOK_SECRET=whsec_qIIOW4ZTn39nS6AE5hKRykGOYktmRSU9
export NODE_PROJECT_NAME="zhengshu"
cd /www/wwwroot/diploma.dpdns.org/src/server
nohup /www/server/nodejs/v16.9.0/bin/node /www/wwwroot/diploma.dpdns.org/src/server/server.js  &>> /www/wwwlogs/nodejs/zhengshu.log &
echo $! > /www/server/nodejs/vhost/pids/zhengshu.pid
