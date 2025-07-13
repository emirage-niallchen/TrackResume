# TrackResume

[English](README.md) | [中文](README.zh-CN.md)

![Banner](./public/Track-Resume.svg)

> Personal resume website built with Next.js, Prisma, and TailwindCSS. Includes homepage display, attachment showcase, and admin dashboard to continuously track career development.

## Features

- 🎨 Customizable homepage information
- 📱 Responsive design
- 🖼️ Project showcase with markdown upload
- 📍 Career history display
- 📄 Tech stack showcase
- 🔐 Admin dashboard
- 🔐 Private deployment

## Tech Stack

- **Framework:** Next.js 14, React 18.0.0
- **Database:** MySQL with Prisma ORM
- **Styling:** TailwindCSS + shadcn/ui

## Installation

Two installation methods available: source code deployment and Docker deployment.

### Docker Installation
1. Create and enter a new directory:
```bash
mkdir -p track-resume && cd track-resume
```

2. Create docker-compose.yml file:
```bash
vim docker-compose.yml  # or use any text editor
```

3. Copy the following content or use the docker-compose.yml file from the project and modify environment variables:
```yaml
version: '3.8'

services:
  app:
    image: niallchen/track-resume:latest
    container_name: TrackResume
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      MYSQL_DATABASE_URL: mysql://user:password@ip:port/cv_dev?connection_limit=5&connect_timeout=60&acquire_timeout=60&timeout=60&pool_timeout=60
      JWT_SECRET: f14w5er468ergwd486jh31gh3e5t4h863yr431fv165tr4uj86r
      NEXTAUTH_URL: http://localhost:3000 
      NEXTAUTH_SECRET: rwgq5ret6746f4e6ew7t684d6wq464fd6a74tg867
      NEXT_TELEMETRY_DISABLED: 1
    volumes:
      - ./public/uploads:/app/public/uploads
      - ./public/project:/app/public/project
```

4. Set appropriate permissions:
```bash
chmod 775 ./public/uploads ./public/project
```

5. Start the container:
```bash
docker-compose up -d
```

### Source Code Installation
1. Clone the repository:
```bash
git clone <repository-url>
```

2. Enter the project directory:
```bash
cd TrackResume
```

3. Install dependencies:
```bash
npm install
```

4. Configure the database:
- Modify `.env.example` in the root directory to `.env` and add database connection info
```
DATABASE_URL="mysql://username:password@ip:port/database"
```

5. Initialize the database:
```bash
npx prisma db push
```

6. Build for production:
```bash
npm run build
```

7. Start the production server:
```bash
npm run start
```

## Detailed Information and Usage
Please refer to the documentation:
https://cv-doc.artithm.com/

## License
The MIT License

Copyright (c) 2025 emirage-niallchen

## Contact
- Email: [admin@artithm.com]
