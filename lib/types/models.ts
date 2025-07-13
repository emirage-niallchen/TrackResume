// 数据库模型相关类型
export interface Admin {
  id: string;
  username: string;
  name?: string;
  email?: string;
  password: string;
  theme: string;
  description: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
  type: string;
  description?: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface File {
  id: string;
  name: string;
  path: string;
  type: string;
  size: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: FileTag[];
}

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  description: string;
  zoom?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tech {
  id: string;
  name: string;
  description: string;
  link?: string;
  bgColor: string;
  order: number;
  icon?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: TechTag[];
  projects: ProjectTech[];
}

export interface Tag {
  id: string;
  name: string;
  description?: string;
  color: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  files: FileTag[];
  techs: TechTag[];
  projects: ProjectTag[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  images: ProjectImage[];
  links: ProjectLink[];
  techs: ProjectTech[];
  tags: ProjectTag[];
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectLink {
  id: string;
  label: string;
  url: string;
  order: number;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  path: string;
  isPublished: boolean;
  metadata?: string;
  order: number;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}


export interface ProjectTech {
  id: string;
  projectId: string;
  techId: string;
  order: number;
}

export interface FileTag {
  id: string;
  fileId: string;
  tagId: string;
  createdAt: Date;
}

export interface TechTag {
  id: string;
  techId: string;
  tagId: string;
  createdAt: Date;
}

export interface ProjectTag {
  id: string;
  projectId: string;
  tagId: string;
  createdAt: Date;
}

export interface Inbox {
  id: string;
  type: string;
  value: string;
  description?: string;
  createdAt: Date;
}

export interface ResumeSection {
  id: string;
  name: string;
  label: string;
  description?: string;
  type: string;
  component: string;
  isEnabled: boolean;
  isPublished: boolean;
  order: number;
  config?: string;
  createdAt: Date;
  updatedAt: Date;
} 

export interface FileTag {
  id: string
  fileId: string
  tagId: string
  file: File
  tag: Tag
  createdAt: Date
}

export interface TechTag {
  id: string
  techId: string
  tagId: string
  tech: Tech
  tag: Tag
  createdAt: Date
}

export interface ProjectTag {
  id: string
  projectId: string
  tagId: string
  project: Project
  tag: Tag
  createdAt: Date
} 