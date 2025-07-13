const fs = require('fs');
const path = require('path');

const dbType = process.argv[2];

if (!dbType || !['sqlite', 'mysql'].includes(dbType)) {
  console.error('请指定数据库类型: sqlite 或 mysql');
  process.exit(1);
}

const sourceFile = path.join(__dirname, '..', 'prisma', `schema.${dbType}.prisma.example`);
const targetFile = path.join(__dirname, '..', 'prisma', 'schema.prisma');

try {
  fs.copyFileSync(sourceFile, targetFile);
  console.log(`成功切换到 ${dbType} 配置`);
  
  // 更新 .env 文件
  const envPath = path.join(__dirname, '..', '.env');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  if (dbType === 'mysql') {
    if (!envContent.includes('MYSQL_DATABASE_URL')) {
      envContent += '\nMYSQL_DATABASE_URL="mysql://root:luo123456789@192.168.0.103:52394/cv"';
    }   
  } else {
    if (!envContent.includes('SQLITE_DATABASE_URL')) {
      envContent += '\nSQLITE_DATABASE_URL="file:./cv_db.db"';
    }
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('环境变量已更新');
  
} catch (error) {
  console.error('切换数据库配置失败:', error);
  process.exit(1);
} 