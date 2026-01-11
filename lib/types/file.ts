import type { File, FileTag, Tag } from '@prisma/client';

export type FileVO = File & {
  tags: Array<FileTag & { tag: Tag }>;
};


