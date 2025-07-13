'use client';

import { useState, useEffect } from 'react';

type File = {
  id: string;
  name: string;
  path: string;
  type: string;
};

export function FileViewer() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const response = await fetch('/api/files');
    const data = await response.json();
    setFiles(data);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* 文件列表 */}
        <div className="border p-4 rounded">
          <h3 className="font-bold mb-2">Files</h3>
          {files && files.length > 0 ? (
            <ul className="space-y-2">
              {files.map((file) => (
                <li 
                  key={file.id}
                  className="flex justify-between items-center"
                >
                  <span>{file.name}</span>
                  <div>
                    <button
                      onClick={() => setSelectedFile(file)}
                      className="text-blue-500 mr-2"
                    >
                      View
                    </button>
                    <a
                      href={file.path}
                      download
                      className="text-green-500"
                    >
                      Download
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-muted-foreground py-4">
              暂无文件
            </div>
          )}
        </div>

        {/* PDF 预览 */}
        <div className="border p-4 rounded">
          {selectedFile?.type === 'application/pdf' ? (
            <iframe
              src={selectedFile.path}
              className="w-full h-[600px]"
            />
          ) : selectedFile ? (
            <div className="text-center p-4">
              This file type cannot be previewed
            </div>
          ) : (
            <div className="text-center p-4">
              Select a file to preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 