"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { adminSetUserRole } from "@/app/admin/actions";
import type { AdminUser } from "@/types/article";

export function AdminUsersTable({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  if (users.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">No users found.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            <th className="px-4 py-3 font-medium">Username</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Joined</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <AdminUserRow
              key={user.id}
              user={user}
              isSelf={user.id === currentUserId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AdminUserRow({
  user,
  isSelf,
}: {
  user: AdminUser;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRoleChange = (role: "user" | "admin") => {
    if (role === user.role) return;
    if (!confirm(`Change ${user.username}'s role to ${role}?`)) return;

    startTransition(async () => {
      const result = await adminSetUserRole(user.id, role);
      if (result.error) alert(result.error);
      else router.refresh();
    });
  };

  return (
    <tr className="border-b border-border last:border-0">
      <td className="px-4 py-3">
        <span className="font-medium">{user.username}</span>
        {isSelf && (
          <span className="ml-2 text-xs text-muted-foreground">(you)</span>
        )}
      </td>
      <td className="px-4 py-3 capitalize">{user.role}</td>
      <td className="px-4 py-3 text-xs text-muted-foreground">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        {isSelf ? (
          <span className="text-xs text-muted-foreground">—</span>
        ) : (
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(e.target.value as "user" | "admin")}
            disabled={isPending}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        )}
      </td>
    </tr>
  );
}
