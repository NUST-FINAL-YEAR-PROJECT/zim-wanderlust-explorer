
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getAllUsers, updateUserRole } from '@/models/Role';
import { Profile } from '@/models/Profile';
import { UserRole } from '@/models/Role';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, UserCheck, UserX } from 'lucide-react';

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<Profile>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const userData = await getAllUsers();
      setUsers(userData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateUserRole(userId, newRole);
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: 'Success',
        description: `User role updated to ${newRole}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };

  const handleEditUser = (user: Profile) => {
    setSelectedUser(user);
    setEditedUser({
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    // This is a placeholder for the actual update function
    // In a real application, you would call an API to update the user
    toast({
      title: 'Info',
      description: 'Update user functionality is not implemented yet',
    });
    
    setIsEditDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
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
                          <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">{user.username?.charAt(0) || user.email?.charAt(0) || '?'}</span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}` 
                              : user.username || 'No username'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        {user.role === 'ADMIN' ? (
                          <Button 
                            variant="outline"
                            size="icon"
                            onClick={() => handleRoleChange(user.id, 'USER')}
                          >
                            <UserX className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button 
                            variant="outline"
                            size="icon"
                            onClick={() => handleRoleChange(user.id, 'ADMIN')}
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
          </div>
        )}
      </CardContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={editedUser.username || ''}
                onChange={(e) => setEditedUser({...editedUser, username: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First name
              </Label>
              <Input
                id="firstName"
                value={editedUser.first_name || ''}
                onChange={(e) => setEditedUser({...editedUser, first_name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last name
              </Label>
              <Input
                id="lastName"
                value={editedUser.last_name || ''}
                onChange={(e) => setEditedUser({...editedUser, last_name: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={editedUser.email || ''}
                onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={editedUser.phone || ''}
                onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UsersManagement;
