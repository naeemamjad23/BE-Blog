export default () => ({
  port: parseInt(process.env.PORT || '4001', 10),
  jwt: {
    secret: process.env.JWT_SECRET || 'blog-jwt-secret',
    expiration: process.env.JWT_EXPIRATION || '7d',
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || '/var/www/Blog/uploads',
  },
  blogUrl: process.env.BLOG_URL || 'https://blog.securemango.com',
});
