'use client';

import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { userService } from '@/shared/services/firebase.service';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

export default function MembersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
  });

  const loadMembers = async () => {
    try {
      const firebaseUsers = await userService.getAllUsers();
      if (firebaseUsers.length > 0) {
        const mappedMembers: Member[] = firebaseUsers.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: 'active',
          joinDate:
            user.createdAt?.toISOString?.().split('T')[0] ||
            new Date().toISOString().split('T')[0],
        }));
        setMembers(mappedMembers);
      }
    } catch (error) {
      console.error('회원 정보 로드 실패:', error);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'admin') {
      router.push('/');
    } else {
      // Firebase에서 회원 정보 로드
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadMembers();
    }
  }, [status, router, session]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newMember.password) {
        alert('비밀번호를 입력해주세요.');
        return;
      }
      const newUserId = await userService.createUser({
        name: newMember.name,
        email: newMember.email,
        password: newMember.password,
        role: newMember.role,
      });

      const member: Member = {
        id: newUserId,
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
      };
      setMembers([...members, member]);
      setNewMember({ name: '', email: '', password: '', role: 'user' });
      setShowForm(false);
      alert('회원이 추가되었습니다!');
    } catch (error) {
      console.error('회원 추가 실패:', error);
      alert('회원 추가 중 오류가 발생했습니다.');
    }
  };

  const toggleMemberStatus = async (id: string) => {
    // 상태 업데이트 (실제로는 status 필드가 필요)
    setMembers(
      members.map((m) =>
        m.id === id
          ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' }
          : m
      )
    );
  };

  const deleteMember = async (id: string) => {
    if (confirm('정말 이 회원을 삭제하시겠습니까?')) {
      try {
        await userService.deleteUser(id);
        setMembers(members.filter((m) => m.id !== id));
        alert('회원이 삭제되었습니다!');
      } catch (error) {
        console.error('회원 삭제 실패:', error);
        alert('회원 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-slate-950 dark:to-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Members Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Total members: {members.length}
            </p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Member'}
          </Button>
        </div>

        {/* Add Member Form */}
        {showForm && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-slate-800">
            <h2 className="mb-4 text-xl font-semibold text-black dark:text-white">
              Add New Member
            </h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) =>
                      setNewMember({ ...newMember, name: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black placeholder-gray-400 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) =>
                      setNewMember({ ...newMember, email: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black placeholder-gray-400 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newMember.password}
                    onChange={(e) =>
                      setNewMember({ ...newMember, password: e.target.value })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black placeholder-gray-400 dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                    placeholder="Password"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </label>
                  <select
                    value={newMember.role}
                    onChange={(e) =>
                      setNewMember({
                        ...newMember,
                        role: e.target.value as 'user' | 'admin',
                      })
                    }
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black dark:border-gray-600 dark:bg-slate-700 dark:text-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Member
              </Button>
            </form>
          </div>
        )}

        {/* Members Table */}
        <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-100 dark:border-gray-700"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          member.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                          member.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {member.joinDate}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleMemberStatus(member.id)}
                          className="rounded-md bg-yellow-600 px-3 py-1 text-xs font-medium text-white hover:bg-yellow-700"
                        >
                          {member.status === 'active'
                            ? 'Deactivate'
                            : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteMember(member.id)}
                          className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
