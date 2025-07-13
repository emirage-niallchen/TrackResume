"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import useSWR from "swr";
import { formatDate } from "@/lib/utils/dateFormatter";
import { Tech } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditTechDialog } from "./components/EditTechDialog";
import { Plus, ArrowUp, ArrowDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface TechTag {
  tag: Tag;
}

export default function TechPage() {
  const [editTech, setEditTech] = useState<Tech | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: techs, mutate, error, isLoading } = useSWR<Tech[]>(
    `/api/admin/tech${searchQuery ? `?name=${encodeURIComponent(searchQuery)}` : ''}`,
    async (url: string) => {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!res.ok) throw new Error('获取数据失败');
      return res.json();
    }
  );

  const handleSearch = () => {
    setSearchQuery(searchName);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/tech/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("删除失败");
      toast.success("技术栈已删除");
      mutate();
    } catch (error) {
      toast.error("删除失败，请稍后重试");
    }
  };

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      const res = await fetch(`/api/admin/tech/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          isPublished: !isPublished
        })
      });

      if (!res.ok) throw new Error("更新失败");
      mutate();
    } catch (error) {
      toast.error("更新失败，请稍后重试");
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    try {
      const res = await fetch('/api/admin/tech/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          techId: id,
          direction
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || '操作失败');
      }

      toast.success('排序已更新');
      mutate();
    } catch (error: any) {
      toast.error(error.message || '操作失败，请稍后重试');
    }
  };

  if (error) return <div className="p-6">加载失败: {error.message}</div>;
  if (isLoading) return <div className="p-6">正在加载...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">技术栈管理</h1>
        <Button onClick={() => setEditTech({} as Tech)}>
          <Plus className="w-4 h-4 mr-2" />
          添加技术
        </Button>
      </div>

      <div className="flex mb-4 gap-2">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="输入技术名称搜索"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
        </div>
        <Button onClick={handleSearch} type="button">
          <Search className="w-4 h-4 mr-2" />
          查询
        </Button>
      </div>

      {techs && techs.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>背景颜色</TableHead>
                <TableHead>排序</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>标签</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {techs.map((tech) => (
                <TableRow key={tech.id}>
                  <TableCell className="font-medium">{tech.name}</TableCell>
                  <TableCell className="text-sm text-gray-500">{tech.description}</TableCell>
                  <TableCell>
                    <div 
                      className="w-4 h-4 rounded inline-block mr-2" 
                      style={{ backgroundColor: tech.bgColor }}
                    />
                    <span className="align-middle">{tech.bgColor}</span>
                  </TableCell>
                  <TableCell>{tech.order}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={tech.isPublished}
                        onCheckedChange={() => 
                          handleTogglePublish(tech.id, tech.isPublished)
                        }
                      />
                      <span className="text-sm">
                        {tech.isPublished ? '已公开' : '未公开'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {tech.tags?.map(({ tag }) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 text-xs rounded-full"
                          style={{
                            backgroundColor: `${tag.color}20`,
                            color: tag.color,
                            border: `1px solid ${tag.color}`
                          }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="flex flex-row gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleReorder(tech.id, 'up')}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleReorder(tech.id, 'down')}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditTech(tech)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(tech.id)}
                      >
                        删除
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          暂无技术栈数据
        </div>
      )}

      {editTech && (
        <EditTechDialog
          open={!!editTech}
          onOpenChange={(open) => {
            if (!open) setEditTech(null);
          }}
          tech={editTech}
          onSuccess={() => {
            mutate();
            setEditTech(null);
          }}
        />
      )}
    </div>
  );
} 