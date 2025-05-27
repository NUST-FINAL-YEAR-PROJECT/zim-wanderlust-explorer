
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
import { supabase } from '@/integrations/supabase/client';
import { updateProfile } from '@/models/Profile';
import { Camera, Upload, Trash2, User, Bell, Shield, Save, Mail, Phone, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

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
      let avatar_url = profile?.avatar_url;
      
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);
          
        if (uploadError) {
          throw new Error('Error uploading avatar: ' + uploadError.message);
        }
        
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        avatar_url = publicUrlData.publicUrl;
      }
      
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
        title: "✅ Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      
      reset({
        ...data,
        email: user.email || '',
      });
      
      setAvatarFile(null);
      
    } catch (error: any) {
      toast({
        title: "❌ Error updating profile",
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
      if (data.newPassword !== data.confirmPassword) {
        throw new Error('New passwords do not match');
      }
      
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: "🔒 Password updated",
        description: "Your password has been changed successfully.",
      });
      
      passwordForm.reset();
      
    } catch (error: any) {
      toast({
        title: "❌ Error updating password",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    toast({
      title: "📧 Account deletion requested",
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
      title: "🔔 Notification preferences updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.size > 1024 * 1024) {
      toast({
        title: "❌ File too large",
        description: "Please select an image smaller than 1MB.",
        variant: "destructive",
      });
      return;
    }
    
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setAvatarFile(null);
  };

  const displayName = profile?.username || user?.email?.split('@')[0] || "User";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <DashboardLayout>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Account Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your account preferences and security settings
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 ring-2 ring-blue-200">
              <AvatarImage src={avatarPreview || profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-blue-900">{displayName}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-blue-50 p-1 rounded-lg">
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Shield className="h-4 w-4" />
              Privacy & Security
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your profile information and how others see you on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-6">
                  <div className="flex items-center space-x-6 p-4 bg-white rounded-lg border border-blue-100">
                    <Avatar className="h-24 w-24 ring-4 ring-blue-200 cursor-pointer hover:ring-blue-300 transition-all" onClick={() => setIsAvatarDialogOpen(true)}>
                      <AvatarImage src={avatarPreview || profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-blue-900">Profile Picture</h3>
                      <p className="text-sm text-muted-foreground">
                        Click on your avatar to update your profile picture
                      </p>
                      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50">
                            <Camera className="mr-2 h-4 w-4" />
                            Change Avatar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle className="text-blue-900">Update Profile Picture</DialogTitle>
                            <DialogDescription>
                              Upload a new profile picture or remove your current one.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex flex-col items-center justify-center space-y-6 py-6">
                            <Avatar className="h-32 w-32 ring-4 ring-blue-200">
                              <AvatarImage src={avatarPreview || profile?.avatar_url || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-semibold">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex gap-3">
                              <label className="cursor-pointer">
                                <Button asChild variant="default" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                                  <div className="flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    <span>Upload New</span>
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      accept="image/*" 
                                      onChange={handleAvatarChange} 
                                    />
                                  </div>
                                </Button>
                              </label>
                              {(avatarPreview || profile?.avatar_url) && (
                                <Button 
                                  variant="outline"
                                  onClick={handleRemoveAvatar}
                                  className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground text-center">
                              JPG, PNG or GIF. Maximum size 1MB.
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2 text-blue-900">
                        <User className="h-4 w-4" />
                        Username
                      </Label>
                      <Input
                        id="username"
                        className="border-blue-200 focus:border-blue-400"
                        {...register("username", { required: "Username is required" })}
                      />
                      {errors.username && (
                        <p className="text-sm text-red-500">{errors.username.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-blue-900">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        disabled
                        className="bg-gray-50 border-gray-200"
                        {...register("email")}
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed for security reasons
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-blue-900">First Name</Label>
                      <Input
                        id="firstName"
                        className="border-blue-200 focus:border-blue-400"
                        {...register("firstName")}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-blue-900">Last Name</Label>
                      <Input
                        id="lastName"
                        className="border-blue-200 focus:border-blue-400"
                        {...register("lastName")}
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="phone" className="flex items-center gap-2 text-blue-900">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        className="border-blue-200 focus:border-blue-400"
                        {...register("phone")}
                        placeholder="+263 XX XXX XXXX"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-blue-100">
                    <Button
                      type="submit"
                      disabled={!isDirty || isLoading}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Save Changes
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Control how and when you receive notifications from Zimbabwe Travels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  {[
                    {
                      key: 'emailNotifications' as const,
                      title: 'Email Notifications',
                      description: 'Receive important updates and booking confirmations via email',
                      icon: Mail
                    },
                    {
                      key: 'bookingReminders' as const,
                      title: 'Booking Reminders',
                      description: 'Get reminders about upcoming trips and reservations',
                      icon: Bell
                    },
                    {
                      key: 'marketingEmails' as const,
                      title: 'Marketing Communications',
                      description: 'Receive newsletters and travel inspiration content',
                      icon: Mail
                    },
                    {
                      key: 'promotions' as const,
                      title: 'Special Promotions',
                      description: 'Be notified about exclusive deals and limited-time offers',
                      icon: Bell
                    }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-100">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <setting.icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-base font-medium text-blue-900">{setting.title}</Label>
                          <p className="text-sm text-muted-foreground">
                            {setting.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notificationSettings[setting.key]}
                        onCheckedChange={() => handleNotificationChange(setting.key)}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end pt-4 border-t border-blue-100">
                  <Button onClick={handleSaveNotifications} className="bg-gradient-to-r from-blue-600 to-indigo-600">
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Manage your account security settings and data privacy preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <div className="p-4 bg-white rounded-lg border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">Change Password</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Keep your account secure by using a strong, unique password
                    </p>
                    
                    <form onSubmit={passwordForm.handleSubmit(handlePasswordReset)} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input 
                            id="currentPassword" 
                            type="password"
                            className="border-blue-200 focus:border-blue-400"
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
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input 
                            id="newPassword" 
                            type="password"
                            className="border-blue-200 focus:border-blue-400"
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
                            className="border-blue-200 focus:border-blue-400"
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
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit"
                          disabled={isPasswordLoading || !passwordForm.formState.isDirty}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600"
                        >
                          {isPasswordLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              Updating...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Update Password
                            </div>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-blue-100">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Trash2 className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-red-900 mb-2">Delete Account</h4>
                        <p className="text-sm text-red-700 mb-4">
                          Permanently delete your account and all associated data. This action cannot be undone and will cancel all active bookings.
                        </p>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Account
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-red-900">Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-red-700">
                                This action cannot be undone. This will permanently delete your account,
                                cancel all bookings, and remove all your data from our servers.
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default Settings;
