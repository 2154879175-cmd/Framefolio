"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteMovieButton({ id, title }: { id: number; title: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    setDeleting(true);
    const response = await fetch(`/api/admin/movies/${id}`, { method: "DELETE" });
    const data = await response.json() as { error?: string };
    if (!response.ok) {
      toast.error(data.error || "删除失败，请稍后重试。");
      setDeleting(false);
      return;
    }
    toast.success("电影记录已删除");
    router.push("/admin");
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="border-red-400/30 text-red-300 hover:bg-red-950/40 hover:text-red-200">
          <Trash2 aria-hidden="true" />删除记录
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>删除《{title}》？</AlertDialogTitle>
          <AlertDialogDescription>评分、短评和长评都会被永久删除。此操作无法撤销。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>取消</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={remove} disabled={deleting}>
            {deleting ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}确认删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
