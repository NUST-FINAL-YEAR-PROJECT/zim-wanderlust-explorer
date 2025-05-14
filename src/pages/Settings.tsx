import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { updateProfile } from '@/models/Profile';
import { Camera, Upload, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ProfileFormData {
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  marketingEmails: boolean;
  bookingReminders: boolean;
  promotions: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<ProfileFormData>({
    defaultValues: {
      username: profile?.username || '',
      email: user?.email || '',
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      phone: profile?.phone || '',
    }
  });

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    marketingEmails: false,
    bookingReminders: true,
    promotions: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile?.avatar_url || null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

  const onUpdateProfile = async (data: ProfileFormData) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Handle avatar upload if there's a file
      let avatar_url = profile?.avatar_url;
      
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);
          
        if (uploadError) {
          throw new Error('Error uploading avatar: ' + uploadError.message);
        }
        
        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        avatar_url = publicUrlData.publicUrl;
      }
      
      // Update profile in database
      const updatedProfile = await updateProfile(user.id, {
        username: data.username,
        avatar_url,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      });
      
      if (!updatedProfile) {
        throw new Error('Failed to update profile');
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      
      reset({
        ...data,
        email: user.email || '',
      });
      
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (data: PasswordFormData) => {
    if (!user?.email) return;
    
    setIsPasswordLoading(true);
    
    try {
      // Verify passwords match
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      // Update password via Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      
      passwordForm.reset();
      
    } catch (error: any) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // In a real app, you would typically need admin privileges to delete users
    // Here's a placeholder for the UI flow
    toast({
      title: "Account deletion requested",
      description: "Please contact support to complete the account deletion process.",
    });
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const openAvatarDialog = () => {
    setIsAvatarDialogOpen(true);
  };

  const closeAvatarDialog = () => {
    setIsAvatarDialogOpen(false);
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information and how others see you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="h-20 w-20 cursor-pointer" onClick={openAvatarDialog}>
                      <AvatarImage src={avatarPreview || profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-purple-100 text-purple-700 text-xl">
                        {profile?.username?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" type="button">
                            <Camera className="mr-2 h-4 w-4" />
                            Change Avatar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Update Profile Picture</DialogTitle>
                            <DialogDescription>
                              Upload a new profile picture or remove your current one.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col items-center justify-center space-y-4 py-4">
                            <Avatar className="h-32 w-32">
                              <AvatarImage src={avatarPreview || profile?.avatar_url || undefined} />
                              <AvatarFallback className="bg-purple-100 text-purple-700 text-2xl">
                                {profile?.username?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex gap-2">
                              <label className="cursor-pointer">
                                <div className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-white">
                                  <Upload className="h-4 w-4" />
                                  <span>Upload</span>
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleAvatarChange} 
                                  />
                                </div>
                              </label>
                              <Button 
                                variant="outline"
                                onClick={handleRemoveAvatar}
                                type="button"
                                size="icon"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              JPG, GIF or PNG. Max size 1MB.
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, GIF or PNG. Max size 1MB.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        {...register("username", { required: "Username is required" })}
                      />
                      {errors.username && (
                        <p className="text-sm text-red-500">{errors.username.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        disabled
                        {...register("email")}
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={!isDirty || isLoading}
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={() => handleNotificationChange('emailNotifications')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about new features and offers
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={() => handleNotificationChange('marketingEmails')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Booking Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminders about upcoming bookings
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.bookingReminders}
                      onCheckedChange={() => handleNotificationChange('bookingReminders')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Special Promotions</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about special deals and promotions
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.promotions}
                      onCheckedChange={() => handleNotificationChange('promotions')}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>
                  Manage your account security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Password</h3>
                    <p className="text-sm text-muted-foreground">
                      Change your password to keep your account secure
                    </p>
                  </div>
                  
                  <form onSubmit={passwordForm.handleSubmit(handlePasswordReset)}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input 
                          id="currentPassword" 
                          type="password"
                          {...passwordForm.register("currentPassword", {
                            required: "Current password is required"
                          })}
                        />
                        {passwordForm.formState.errors.currentPassword && (
                          <p className="text-sm text-red-500">
                            {passwordForm.formState.errors.currentPassword.message}
                          </p>
                        )}
                      </div>
                      <div></div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input 
                          id="newPassword" 
                          type="password"
                          {...passwordForm.register("newPassword", {
                            required: "New password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters"
                            }
                          })}
                        />
                        {passwordForm.formState.errors.newPassword && (
                          <p className="text-sm text-red-500">
                            {passwordForm.formState.errors.newPassword.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input 
                          id="confirmPassword" 
                          type="password"
                          {...passwordForm.register("confirmPassword", {
                            required: "Please confirm your password",
                            validate: value => 
                              value === passwordForm.watch("newPassword") || "Passwords do not match"
                          })}
                        />
                        {passwordForm.formState.errors.confirmPassword && (
                          <p className="text-sm text-red-500">
                            {passwordForm.formState.errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button 
                        type="submit"
                        disabled={isPasswordLoading || !passwordForm.formState.isDirty}
                      >
                        {isPasswordLoading ? "Updating..." : "Change Password"}
                      </Button>
                    </div>
                  </form>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <h4 className="text-base font-medium text-red-800 mb-1">Delete Account</h4>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">Delete Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Yes, delete my account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
