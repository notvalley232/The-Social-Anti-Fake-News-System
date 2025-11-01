const { create, router, defaults, bodyParser } = require('json-server');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 创建 JSON Server 实例
const server = create();

// 构建数据库对象
function buildDatabase() {
  const db = {};
  
  // 读取所有 JSON 文件
  const files = ['mockNews.json', 'mockComments.json', 'mockVotes.json', 'mockUsers.json'];
  
  files.forEach(file => {
    try {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // 根据文件名确定数据键名
        if (file === 'mockNews.json') {
          db.news = data.news || data;
        } else if (file === 'mockComments.json') {
          db.comments = data.comments || data;
        } else if (file === 'mockVotes.json') {
          db.votes = data.votes || data;
        } else if (file === 'mockUsers.json') {
          db.users = data.users || data;
        }
      }
    } catch (error) {
      console.error(`Error reading ${file}:`, error.message);
    }
  });
  
  return db;
}

// 构建数据库
const db = buildDatabase();

// 写入临时 db.json 文件
fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(db, null, 2));

// 配置中间件
server.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

server.use(bodyParser);

// 添加自定义路由（在默认路由之前）
server.use('/api', router(path.join(__dirname, 'db.json')));

// 使用默认中间件
server.use(defaults());

// 使用路由器
server.use(router(path.join(__dirname, 'db.json')));

// 健康检查端点
server.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    data: {
      news: db.news?.length || 0,
      comments: db.comments?.length || 0,
      votes: db.votes?.length || 0,
      users: db.users?.length || 0
    }
  });
});

// 启动服务器
const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 JSON Server is running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📰 News API: http://localhost:${PORT}/news`);
  console.log(`💬 Comments API: http://localhost:${PORT}/comments`);
  console.log(`🗳️  Votes API: http://localhost:${PORT}/votes`);
  console.log(`👥 Users API: http://localhost:${PORT}/users`);
});

module.exports = server;