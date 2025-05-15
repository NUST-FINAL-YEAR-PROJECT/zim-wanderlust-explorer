
import React from 'react';
import { Profile } from '@/models/Profile';
import { UserRole } from '@/models/Role';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  ResponsiveTableWrapper
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, UserCheck, UserX } from 'lucide-react';

interface UsersTableProps {
  users: Profile[];
  loading: boolean;
  onEditUser: (user: Profile) => void;
  onRoleChange: (userId: string, newRole: UserRole) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ 
  users, 
  loading, 
  onEditUser,
  onRoleChange 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ResponsiveTableWrapper>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center">
                  {user.avatar_url ? (
                    <img className="h-9 w-9 rounded-full" src={user.avatar_url} alt="" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {user.first_name?.charAt(0) || 
                         user.username?.charAt(0) || 
                         user.email?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-sm font-medium">
                      {user.first_name && user.last_name 
                        ? `${user.first_name} ${user.last_name}` 
                        : user.username || 'No username'}
                    </div>
                    {user.username && 
                      <div className="text-xs text-muted-foreground">
                        @{user.username}
                      </div>
                    }
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">{user.email}</div>
                {user.phone && 
                  <div className="text-xs text-muted-foreground">
                    {user.phone}
                  </div>
                }
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline"
                    size="icon"
                    onClick={() => onEditUser(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  {user.role === 'ADMIN' ? (
                    <Button 
                      variant="outline"
                      size="icon"
                      onClick={() => onRoleChange(user.id, 'USER')}
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      size="icon"
                      onClick={() => onRoleChange(user.id, 'ADMIN')}
                    >
                      <UserCheck className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ResponsiveTableWrapper>
  );
};

export default UsersTable;
