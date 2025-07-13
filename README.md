# Personal Resume Website

[English](README.md) | [中文](README.zh-CN.md)

A personal resume website built with Next.js, Prisma, and TailwindCSS.

## Features

- 🎨 Theme customization
- 📱 Responsive design
- 🖼️ Project showcase with image carousel
- 📍 Location display with interactive map
- 📄 File management system
- 🔐 Admin dashboard for content management

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** SQLite with Prisma ORM
- **Styling:** TailwindCSS
- **Maps:** Leaflet
- **Authentication:** NextAuth.js

## Getting Started

1. Clone the repository:
``` bash
git clone <repository-url>
```
2. Install dependencies:
```bash
npm install
```
3. Set up the database:
```bash
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure
```bash
├── prisma/ # Database schema and migrations
├── public/ # Static files
├── src/
│ ├── app/ # Next.js app router pages
│ ├── components/ # React components
│ ├── contexts/ # React contexts
│ └── themes/ # Theme configurations
```
## License

MIT License - see LICENSE for details

## Contact

- Email: [your-email]
- GitHub: [your-github]
